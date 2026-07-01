import { type AdvancedAnalysisResult, type ContractScoreBreakdown, type ContractScoreCard } from "@/types/analysis"

function dedupeStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

export function buildContractScoreCard(score: ContractScoreBreakdown): ContractScoreCard {
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

export function normalizeAnalysisResult(result: AdvancedAnalysisResult): AdvancedAnalysisResult {
  return {
    ...result,
    topRedFlags: result.topRedFlags.slice(0, 12),
    importantClauses: result.importantClauses.slice(0, 20),
    rightsObligations: {
      rights: result.rightsObligations.rights.slice(0, 20),
      obligations: result.rightsObligations.obligations.slice(0, 20),
    },
    importantDates: result.importantDates.slice(0, 20),
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
      unusualClauses: dedupeStrings(result.legalInsights.unusualClauses),
      oneSidedProvisions: dedupeStrings(result.legalInsights.oneSidedProvisions),
    },
    favorableClauses: result.favorableClauses.slice(0, 20),
  }
}
