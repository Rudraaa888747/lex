import OpenAI from "openai"
import { type AdvancedAnalysisResult, type ContractScoreBreakdown } from "@/types/analysis"
import { normalizeAnalysisResult } from "@/lib/analysis-contract"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
})

const MODEL = "openai/gpt-4o-mini"

// Keep these utilities for chat and comparison which haven't been migrated to structured outputs yet
function extractJSON(text: string): string {
  const jsonBlock = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
  if (jsonBlock) return jsonBlock[1].trim()

  const firstBrace = text.indexOf("{")
  const lastBrace = text.lastIndexOf("}")
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1)
  }

  return text.trim()
}

function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T
  } catch {
    return fallback
  }
}

export function validateContent(content: string): boolean {
  const cleaned = content?.trim() || ""
  return cleaned.length >= 10
}

const ANALYSIS_SYSTEM_PROMPT = `You are a Principal Legal Analyst auditing a contract.
Your objective is to identify liabilities, unilateral rights, financial exposures, and critical deadlines.
DO NOT summarize broadly. DO NOT output "No dates found" if notice periods or renewal windows exist.
Every extracted clause MUST have a severityScore (0-10) and exact text evidence.

You MUST generate ALL output content in the {TARGET_LANGUAGE} language (except for raw text evidence quotations, which should remain in their original language). Maintain highly professional, rigorous legal terminology in {TARGET_LANGUAGE}.

You MUST extract and output the findings according to the requested JSON schema. Be exhaustive, rigorous, and highly analytical.`;

// JSON Schema definition for Structured Outputs
const AdvancedAnalysisSchema = {
  type: "object",
  properties: {
    executiveSummary: { type: "string" },
    plainLanguage: { type: "string" },
    topRedFlags: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          severityScore: { type: "number" },
          riskLevel: { type: "string" },
          explanation: { type: "string" },
          evidence: { type: "string" },
          businessImpact: { type: "string" }
        },
        required: ["title", "severityScore", "riskLevel", "explanation", "evidence", "businessImpact"],
        additionalProperties: false
      }
    },
    importantClauses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          section: { type: "string" },
          title: { type: "string" },
          importance: { type: "string" },
          shortSummary: { type: "string" },
          evidence: { type: "string" }
        },
        required: ["section", "title", "importance", "shortSummary", "evidence"],
        additionalProperties: false
      }
    },
    rightsObligations: {
      type: "object",
      properties: {
        rights: {
          type: "array",
          items: {
            type: "object",
            properties: {
              clause: { type: "string" },
              category: { type: "string" },
              severityScore: { type: "number" },
              importance: { type: "string" },
              explanation: { type: "string" },
              evidence: { type: "string" }
            },
            required: ["clause", "category", "severityScore", "importance", "explanation", "evidence"],
            additionalProperties: false
          }
        },
        obligations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              clause: { type: "string" },
              category: { type: "string" },
              severityScore: { type: "number" },
              importance: { type: "string" },
              explanation: { type: "string" },
              evidence: { type: "string" }
            },
            required: ["clause", "category", "severityScore", "importance", "explanation", "evidence"],
            additionalProperties: false
          }
        }
      },
      required: ["rights", "obligations"],
      additionalProperties: false
    },
    importantDates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          deadline: { type: "string" },
          meaning: { type: "string" },
          impact: { type: "string" }
        },
        required: ["deadline", "meaning", "impact"],
        additionalProperties: false
      }
    },
    financialAnalysis: {
      type: "object",
      properties: {
        expectedCosts: { type: "string" },
        paymentObligations: { type: "string" },
        hiddenCosts: { type: "string" },
        collectionExposure: { type: "string" },
        financialRedFlags: { type: "array", items: { type: "string" } }
      },
      required: ["expectedCosts", "paymentObligations", "hiddenCosts", "collectionExposure", "financialRedFlags"],
      additionalProperties: false
    },
    beforeYouSign: {
      type: "object",
      properties: {
        questionsToAsk: { type: "array", items: { type: "string" } },
        clausesToNegotiate: { type: "array", items: { type: "string" } },
        missingProtections: { type: "array", items: { type: "string" } },
        potentialLegalConcerns: { type: "array", items: { type: "string" } }
      },
      required: ["questionsToAsk", "clausesToNegotiate", "missingProtections", "potentialLegalConcerns"],
      additionalProperties: false
    },
    legalInsights: {
      type: "object",
      properties: {
        canClientTerminate: { type: "object", properties: { answer: { type: "boolean" }, evidence: { type: "string" } }, required: ["answer", "evidence"], additionalProperties: false },
        canProviderTerminate: { type: "object", properties: { answer: { type: "boolean" }, evidence: { type: "string" } }, required: ["answer", "evidence"], additionalProperties: false },
        liabilityLimitation: { type: "object", properties: { answer: { type: "boolean" }, evidence: { type: "string" } }, required: ["answer", "evidence"], additionalProperties: false },
        arbitrationRequired: { type: "object", properties: { answer: { type: "boolean" }, evidence: { type: "string" } }, required: ["answer", "evidence"], additionalProperties: false },
        jurisdictionSpecified: { type: "object", properties: { answer: { type: "boolean" }, evidence: { type: "string" } }, required: ["answer", "evidence"], additionalProperties: false },
        confidentialityPresent: { type: "object", properties: { answer: { type: "boolean" }, evidence: { type: "string" } }, required: ["answer", "evidence"], additionalProperties: false },
        autoRenewalPresent: { type: "object", properties: { answer: { type: "boolean" }, evidence: { type: "string" } }, required: ["answer", "evidence"], additionalProperties: false },
        indemnificationPresent: { type: "object", properties: { answer: { type: "boolean" }, evidence: { type: "string" } }, required: ["answer", "evidence"], additionalProperties: false },
        nonCompetePresent: { type: "object", properties: { answer: { type: "boolean" }, evidence: { type: "string" } }, required: ["answer", "evidence"], additionalProperties: false },
        ipTransferPresent: { type: "object", properties: { answer: { type: "boolean" }, evidence: { type: "string" } }, required: ["answer", "evidence"], additionalProperties: false },
        conflictOfInterestPresent: { type: "object", properties: { answer: { type: "boolean" }, evidence: { type: "string" } }, required: ["answer", "evidence"], additionalProperties: false },
        unusualClauses: { type: "array", items: { type: "string" } },
        oneSidedProvisions: { type: "array", items: { type: "string" } }
      },
      required: [
        "canClientTerminate", "canProviderTerminate", "liabilityLimitation", "arbitrationRequired",
        "jurisdictionSpecified", "confidentialityPresent", "autoRenewalPresent", "indemnificationPresent",
        "nonCompetePresent", "ipTransferPresent", "conflictOfInterestPresent", "unusualClauses", "oneSidedProvisions"
      ],
      additionalProperties: false
    },
    conflictOfInterest: {
      type: "object",
      properties: {
        riskLevel: { type: "string" },
        explanation: { type: "string" },
        evidence: { type: "string" },
        potentialImpact: { type: "string" },
        recommendedAction: { type: "string" }
      },
      required: ["riskLevel", "explanation", "evidence", "potentialImpact", "recommendedAction"],
      additionalProperties: false
    },
    favorableClauses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          clause: { type: "string" },
          benefit: { type: "string" },
          evidence: { type: "string" }
        },
        required: ["clause", "benefit", "evidence"],
        additionalProperties: false
      }
    },
    jurisdictionInsights: {
      type: "object",
      properties: {
        jurisdiction: { type: "string" },
        governingLaw: { type: "string" },
        legalContext: { type: "string" },
        evidence: { type: "string" }
      },
      required: ["jurisdiction", "governingLaw", "legalContext", "evidence"],
      additionalProperties: false
    },
    contractScore: {
      type: "object",
      properties: {
        overallScore: { type: "number" },
        riskExposureScore: { type: "number" },
        financialExposureScore: { type: "number" },
        terminationFairnessScore: { type: "number" },
        transparencyScore: { type: "number" },
        conflictRiskScore: { type: "number" },
        explanation: { type: "string" }
      },
      required: ["overallScore", "riskExposureScore", "financialExposureScore", "terminationFairnessScore", "transparencyScore", "conflictRiskScore", "explanation"],
      additionalProperties: false
    }
  },
  required: [
    "executiveSummary", "plainLanguage", "topRedFlags", "importantClauses",
    "rightsObligations", "importantDates", "financialAnalysis", "beforeYouSign",
    "legalInsights", "conflictOfInterest", "favorableClauses", "jurisdictionInsights", "contractScore"
  ],
  additionalProperties: false
};

async function executeAnalysis(content: string, title: string, language: string): Promise<AdvancedAnalysisResult> {
  const systemPrompt = ANALYSIS_SYSTEM_PROMPT.replace(/\{TARGET_LANGUAGE\}/g, language);
  const prompt = `${systemPrompt}\n\nDocument Title: ${title}\n\nDocument Text:\n${content}`;

  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "advanced_analysis",
        strict: true,
        schema: AdvancedAnalysisSchema
      }
    }
  });

  const raw = res.choices[0]?.message?.content || "{}";
  return JSON.parse(raw) as AdvancedAnalysisResult
}

function mergeScoreBreakdowns(scores: ContractScoreBreakdown[]): ContractScoreBreakdown {
  const divisor = scores.length || 1

  return {
    overallScore: Math.round(scores.reduce((sum, item) => sum + item.overallScore, 0) / divisor),
    riskExposureScore: Math.round(scores.reduce((sum, item) => sum + item.riskExposureScore, 0) / divisor),
    financialExposureScore: Math.round(scores.reduce((sum, item) => sum + item.financialExposureScore, 0) / divisor),
    terminationFairnessScore: Math.round(scores.reduce((sum, item) => sum + item.terminationFairnessScore, 0) / divisor),
    transparencyScore: Math.round(scores.reduce((sum, item) => sum + item.transparencyScore, 0) / divisor),
    conflictRiskScore: Math.round(scores.reduce((sum, item) => sum + item.conflictRiskScore, 0) / divisor),
    explanation: scores.map((item) => item.explanation).filter(Boolean).join("\n\n"),
  }
}

function splitIntoChunks(content: string, chunkSize = 45000, overlap = 2500) {
  const chunks: string[] = []
  let start = 0

  while (start < content.length) {
    const end = Math.min(content.length, start + chunkSize)
    chunks.push(content.slice(start, end))
    if (end === content.length) break
    start = end - overlap
  }

  return chunks
}

function mergeAnalysisResults(results: AdvancedAnalysisResult[]) {
  return normalizeAnalysisResult({
    executiveSummary: results.map((item) => item.executiveSummary).join("\n\n"),
    plainLanguage: results.map((item) => item.plainLanguage).join("\n\n"),
    topRedFlags: results.flatMap((item) => item.topRedFlags),
    importantClauses: results.flatMap((item) => item.importantClauses),
    rightsObligations: {
      rights: results.flatMap((item) => item.rightsObligations.rights),
      obligations: results.flatMap((item) => item.rightsObligations.obligations),
    },
    importantDates: results.flatMap((item) => item.importantDates),
    financialAnalysis: {
      expectedCosts: results.map((item) => item.financialAnalysis.expectedCosts).filter(Boolean).join(" | "),
      paymentObligations: results.map((item) => item.financialAnalysis.paymentObligations).filter(Boolean).join(" | "),
      hiddenCosts: results.map((item) => item.financialAnalysis.hiddenCosts).filter(Boolean).join(" | "),
      collectionExposure: results.map((item) => item.financialAnalysis.collectionExposure).filter(Boolean).join(" | "),
      financialRedFlags: results.flatMap((item) => item.financialAnalysis.financialRedFlags),
    },
    beforeYouSign: {
      questionsToAsk: results.flatMap((item) => item.beforeYouSign.questionsToAsk),
      clausesToNegotiate: results.flatMap((item) => item.beforeYouSign.clausesToNegotiate),
      missingProtections: results.flatMap((item) => item.beforeYouSign.missingProtections),
      potentialLegalConcerns: results.flatMap((item) => item.beforeYouSign.potentialLegalConcerns),
    },
    legalInsights: results[0].legalInsights,
    conflictOfInterest: results[0].conflictOfInterest,
    favorableClauses: results.flatMap((item) => item.favorableClauses),
    jurisdictionInsights: results[0].jurisdictionInsights,
    contractScore: mergeScoreBreakdowns(results.map((item) => item.contractScore)),
  })
}

export async function analyzeDocument(content: string, title: string, language: string = "English") {
  const langStr = language === "HI" ? "Hindi" : language === "GU" ? "Gujarati" : "English"
  const chunks = splitIntoChunks(content)

  if (chunks.length === 1) {
    return normalizeAnalysisResult(await executeAnalysis(chunks[0], title, langStr))
  }

  const results: AdvancedAnalysisResult[] = []

  for (const [index, chunk] of chunks.entries()) {
    results.push(await executeAnalysis(chunk, `${title} (Part ${index + 1} of ${chunks.length})`, langStr))
  }

  return mergeAnalysisResults(results)
}

export async function chatWithDocument(message: string, context: string, language: string = "EN") {
  const langStr = language === "HI" ? "Hindi" : language === "GU" ? "Gujarati" : "English";

  const prompt = `You are Lex AI, an elite legal document assistant. Answer the user's question based on the document context provided.
IMPORTANT: You MUST respond in ${langStr}.

Document context:
${context?.substring(0, 15000) || "No document selected. Answer general legal questions at a high level."}

User question: ${message}

Provide a clear, helpful, and highly accurate legal response. If you're not sure about something, state clearly that the document does not contain this information. Keep responses professional and well-formatted.`

  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  })

  return res.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
}

const COMPARE_TEMPLATE = `{
  "summary": "2-3 sentence comparison summary",
  "clauses": {"clause name": "comparison across documents"},
  "risks": ["risk1", "risk2"],
  "differences": ["key difference1", "key difference2"]
}`

export async function compareDocuments(docs: { title: string; content: string }[]) {
  const docText = docs
    .map((d, i) => `DOCUMENT ${i + 1}: ${d.title}\n${d.content.substring(0, 5000)}`)
    .join("\n\n---\n\n")

  const prompt = `You are a legal document comparison expert. Compare the following documents.

Return ONLY a valid JSON object with EXACTLY these keys and structure — no markdown, no code blocks, no explanation before or after:
${COMPARE_TEMPLATE}

${docText}`

  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  })

  const raw = res.choices[0]?.message?.content || ""
  const extracted = extractJSON(raw)
  const parsed = safeJsonParse<any>(extracted, null)

  if (!parsed) {
    throw new Error(`AI returned invalid JSON. Raw: ${raw.substring(0, 200)}`)
  }

  return {
    summary: parsed.summary || parsed.Summary || "",
    clauses: parsed.clauses || parsed.Clauses || {},
    risks: parsed.risks || parsed.Risks || [],
    differences: parsed.differences || parsed.Differences || [],
  }
}
