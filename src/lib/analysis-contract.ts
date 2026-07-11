import { type AdvancedAnalysisResult, type ContractScoreBreakdown, type ContractScoreCard } from "@/types/analysis"

// Compare evidence against original document (ignoring case and extra whitespace)
function verifyEvidence(evidence: string | null | undefined, documentText: string): string | null {
  if (!evidence) return null;
  const cleanEvidence = evidence.replace(/\s+/g, " ").trim().toLowerCase();
  const cleanDoc = documentText.replace(/\s+/g, " ").trim().toLowerCase();
  
  if (cleanDoc.includes(cleanEvidence)) {
    return evidence;
  }
  // Allow partial match (80% length) to handle OCR/whitespace glitches
  if (cleanEvidence.length > 20) {
    const startIdx = Math.floor(cleanEvidence.length * 0.1);
    const endIdx = Math.floor(cleanEvidence.length * 0.9);
    const coreChunk = cleanEvidence.substring(startIdx, endIdx);
    if (cleanDoc.includes(coreChunk)) return evidence;
  }
  return null;
}

function dedupeStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

export function buildContractScoreCard(score: ContractScoreBreakdown | null | undefined): ContractScoreCard | null {
  if (!score) return null;
  const normalizedScore = Math.max(0, Math.min(10, Math.round(score.overallScore)))
  const balance =
    normalizedScore >= 8 ? "Favorable" :
    normalizedScore >= 5 ? "Balanced" :
    "One-sided"
  const riskExposure =
    score.riskExposureScore >= 8 ? "High" :
    score.riskExposureScore >= 5 ? "Medium" :
    "Low"

  return {
    score: normalizedScore,
    balance,
    riskExposure,
    fairnessExplanation: score.explanation,
    breakdown: score,
  }
}

export function normalizeAnalysisResult(result: AdvancedAnalysisResult, documentText?: string): AdvancedAnalysisResult {
  const verify = (evidence: string | null | undefined) => documentText ? verifyEvidence(evidence, documentText) : (evidence || null);

  return {
    ...result,
    topRedFlags: result.topRedFlags.slice(0, 50).map(i => ({ ...i, evidence: verify(i.evidence) })),
    importantClauses: result.importantClauses.slice(0, 100).map(i => ({ ...i, evidence: verify(i.evidence) })),
    rightsObligations: {
      rights: result.rightsObligations.rights.slice(0, 100).map(i => ({ ...i, evidence: verify(i.evidence) })),
      obligations: result.rightsObligations.obligations.slice(0, 100).map(i => ({ ...i, evidence: verify(i.evidence) })),
    },
    importantDates: result.importantDates.slice(0, 100),
    financialAnalysis: {
      ...result.financialAnalysis,
      financialRedFlags: dedupeStrings(result.financialAnalysis.financialRedFlags),
    },
    beforeYouSign: {
      questionsToAsk: dedupeStrings(result.beforeYouSign.questionsToAsk),
      clausesToNegotiate: dedupeStrings(result.beforeYouSign.clausesToNegotiate),
      missingProtections: dedupeStrings(result.beforeYouSign.missingProtections),
      potentialLegalConcerns: dedupeStrings(result.beforeYouSign.potentialLegalConcerns),
    },
    legalInsights: {
      ...result.legalInsights,
      canClientTerminate: { ...result.legalInsights.canClientTerminate, evidence: verify(result.legalInsights.canClientTerminate?.evidence) },
      canProviderTerminate: { ...result.legalInsights.canProviderTerminate, evidence: verify(result.legalInsights.canProviderTerminate?.evidence) },
      liabilityLimitation: { ...result.legalInsights.liabilityLimitation, evidence: verify(result.legalInsights.liabilityLimitation?.evidence) },
      arbitrationRequired: { ...result.legalInsights.arbitrationRequired, evidence: verify(result.legalInsights.arbitrationRequired?.evidence) },
      jurisdictionSpecified: { ...result.legalInsights.jurisdictionSpecified, evidence: verify(result.legalInsights.jurisdictionSpecified?.evidence) },
      confidentialityPresent: { ...result.legalInsights.confidentialityPresent, evidence: verify(result.legalInsights.confidentialityPresent?.evidence) },
      autoRenewalPresent: { ...result.legalInsights.autoRenewalPresent, evidence: verify(result.legalInsights.autoRenewalPresent?.evidence) },
      indemnificationPresent: { ...result.legalInsights.indemnificationPresent, evidence: verify(result.legalInsights.indemnificationPresent?.evidence) },
      nonCompetePresent: { ...result.legalInsights.nonCompetePresent, evidence: verify(result.legalInsights.nonCompetePresent?.evidence) },
      ipTransferPresent: { ...result.legalInsights.ipTransferPresent, evidence: verify(result.legalInsights.ipTransferPresent?.evidence) },
      conflictOfInterestPresent: { ...result.legalInsights.conflictOfInterestPresent, evidence: verify(result.legalInsights.conflictOfInterestPresent?.evidence) },
      unusualClauses: dedupeStrings(result.legalInsights.unusualClauses),
      oneSidedProvisions: dedupeStrings(result.legalInsights.oneSidedProvisions),
    },
    conflictOfInterest: { ...result.conflictOfInterest, evidence: verify(result.conflictOfInterest?.evidence) },
    favorableClauses: result.favorableClauses.slice(0, 100).map(i => ({ ...i, evidence: verify(i.evidence) })),
    jurisdictionInsights: { ...result.jurisdictionInsights, evidence: verify(result.jurisdictionInsights?.evidence) }
  }
}
