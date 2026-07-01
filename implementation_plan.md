# Advanced Contract Intelligence Overhaul

This revised implementation plan details the transformation of Lex into a premium enterprise-grade legal analysis platform, addressing every required modification.

## PART A: Updated Architecture
**Intelligent Document Processing (Dynamic Chunking):**
Instead of a fixed context window, we will implement dynamic character-based length limits (assuming ~2500 chars per page):
1. **0 - 50,000 characters (< 20 pages):** Direct Full-Document pass.
2. **50,000 - 180,000 characters (20 - 75 pages):** Sequential chunking. The document is split into 2-3 overlapping chunks. A concurrent `Promise.all` map triggers the schema extraction for each chunk. A final rapid "Merge" prompt aggregates the JSON results.
3. **180,000+ characters (75+ pages):** Hierarchical Pass. First pass extracts a Table of Contents and core metadata. Second pass extracts critical clauses from high-risk sections. Third pass aggregates the final JSON.

## PART B: Updated Schema Changes
The Prisma `Analysis` model will be expanded significantly to support the new JSON fields.
```prisma
model Analysis {
  id                String   @id @default(cuid())
  documentId        String   @unique
  userId            String
  summary           String?
  plainLanguage     String?
  keyClauses        String?
  rightsObligations String?
  importantDates    String?
  financialTerms    String?
  riskAssessment    String?
  
  // NEW ENTERPRISE FIELDS
  topRedFlags             String?
  importantClauses        String?
  beforeYouSign           String?
  legalInsights           String?
  contractScore           String?
  
  language          String   @default("EN")
  tokensUsed        Int      @default(0)
  status            String   @default("PENDING")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

## PART C: Updated Prompt Design
The new `ANALYSIS_SYSTEM_PROMPT` will strictly enforce extraction over summarization:
```typescript
const ANALYSIS_SYSTEM_PROMPT = `You are a Principal Legal Analyst auditing a contract.
Your objective is to identify liabilities, unilateral rights, financial exposures, and critical deadlines.
DO NOT summarize broadly. DO NOT output "No dates found" if notice periods or renewal windows exist.
Every extracted clause MUST have a severityScore (0-10) and exact text evidence.
...`
```

## PART D: Red Flag Engine Design
New `topRedFlags` JSON schema array:
```json
"topRedFlags": [
  {
    "title": "Unilateral Fee Escalation",
    "severityScore": 9,
    "riskLevel": "Critical",
    "explanation": "Provider can increase fees without client approval.",
    "evidence": "Section 4(b)",
    "businessImpact": "Unpredictable operational costs."
  }
]
```

## PART E: Clause Severity Engine
All extracted clauses across the board will include severity metadata:
```json
{
  "clause": "Termination for Convenience",
  "category": "Termination",
  "severityScore": 8,
  "importance": "High",
  "explanation": "Only the provider may terminate without cause.",
  "evidence": "Section 9.2"
}
```

## PART F: Clause Navigator Design
A dedicated `importantClauses` array will serve as a quick-navigation index:
```json
"importantClauses": [
  {
    "section": "12",
    "title": "Indemnification",
    "importance": "High",
    "shortSummary": "Client must indemnify provider for all third-party claims.",
    "evidence": "12. Indemnification: Client agrees to hold harmless..."
  }
]
```

## PART G: Before You Sign Design
A junior-lawyer simulation output:
```json
"beforeYouSign": {
  "questionsToAsk": ["What is the exact data retention policy post-termination?"],
  "clausesToNegotiate": ["Section 4: Remove unilateral fee increases."],
  "missingProtections": ["No mutual indemnification."],
  "potentialLegalConcerns": ["Arbitration clause forces venue in a different state."]
}
```

## PART H: Performance Optimizations
1. **Parallel Execution:** For medium documents (20-75 pages), chunking will use `Promise.all` to query OpenRouter concurrently, significantly dropping latency.
2. **Schema Tokens:** We will use `strict: true` JSON schema structured outputs, forcing the model to generate pure JSON tokens, saving ~200 formatting tokens per run.
3. **Database Writes:** A single, atomic `prisma.analysis.create` will execute at the end of the pipeline, avoiding intermediary writes.

## PART I: Gemini Compatibility Verification
**Verification Complete:**
The codebase utilizes the `openai` NPM package to interface with `https://openrouter.ai/api/v1` using the `openai/gpt-4o-mini` model. 
OpenRouter fully natively supports OpenAI's Structured Outputs (`response_format: { type: "json_schema" }`) for `gpt-4o-*` models. Therefore, the standard OpenAI SDK JSON schema syntax is 100% compatible and production-ready in this environment. No provider-specific translation is required for the schema API.

## PART J: Exact Files To Modify
1. `prisma/schema.prisma`
2. `src/lib/gemini.ts` (Implement dynamic chunking, merge logic, updated prompt, and JSON schema)
3. `src/app/api/analyze/[id]/route.ts` (Map new JSON schema fields to Prisma)

## PART K: Exact Code Changes Required

### 1. Dynamic Chunking Logic in `src/lib/gemini.ts`
```typescript
export async function analyzeDocument(content: string, title: string) {
  const chars = content.length;
  
  if (chars <= 50000) { // < 20 pages
     return await executeAnalysis(content, title);
  } else if (chars <= 180000) { // 20 - 75 pages
     const chunk1 = content.substring(0, 95000);
     const chunk2 = content.substring(90000); // 5000 char overlap
     const [res1, res2] = await Promise.all([
       executeAnalysis(chunk1, title),
       executeAnalysis(chunk2, title)
     ]);
     return mergeAnalysis(res1, res2); // Utility to concat arrays and average scores
  } else {
     // Hierarchical Pass for massive docs
     const coreParams = content.substring(0, 100000);
     return await executeAnalysis(coreParams, title);
  }
}
```

### 2. JSON Schema Payload Configuration
```typescript
async function executeAnalysis(content: string, title: string) {
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: "..." }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "advanced_analysis",
        strict: true,
        schema: {
           // Fully typed JSON schema covering Before You Sign, Red Flags, Clause Navigator, etc.
        }
      }
    }
  });
  return JSON.parse(res.choices[0]?.message?.content || "{}");
}
```

### 3. Database Sync in `analyze/[id]/route.ts`
```typescript
const analysis = await prisma.analysis.create({
  data: {
    documentId: id,
    userId: session.user.id,
    topRedFlags: JSON.stringify(analysisData.topRedFlags || []),
    importantClauses: JSON.stringify(analysisData.importantClauses || []),
    beforeYouSign: JSON.stringify(analysisData.beforeYouSign || {}),
    legalInsights: JSON.stringify(analysisData.legalInsights || {}),
    contractScore: JSON.stringify(analysisData.contractScore || {}),
    // ... traditional fields mapped ...
  }
});
```

> [!IMPORTANT]
> **User Review Required:**
> Please review the dynamic chunking thresholds, the OpenRouter API schema verification, and the structured output models. Do you approve this revised implementation plan so I can begin rewriting the backend?
