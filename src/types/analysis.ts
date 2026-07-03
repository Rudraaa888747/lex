export interface RedFlag {
  title: string
  severityScore: number
  riskLevel: string
  explanation: string
  evidence: string | null
  businessImpact: string
}

export interface ImportantClause {
  section: string
  title: string
  importance: string
  shortSummary: string
  evidence: string | null
}

export interface RightsObligationsItem {
  clause: string
  category: string
  severityScore: number
  importance: string
  explanation: string
  evidence: string | null
}

export interface RightsObligations {
  rights: RightsObligationsItem[]
  obligations: RightsObligationsItem[]
}

export interface ImportantDate {
  deadline: string
  meaning: string
  impact: string
}

export interface FinancialAnalysis {
  expectedCosts: string
  paymentObligations: string
  hiddenCosts: string
  collectionExposure: string
  financialRedFlags: string[]
}

export interface BeforeYouSign {
  questionsToAsk: string[]
  clausesToNegotiate: string[]
  missingProtections: string[]
  potentialLegalConcerns: string[]
}

export interface LegalInsight {
  answer: boolean | null
  evidence: string | null
}

export interface LegalInsights {
  canClientTerminate: LegalInsight
  canProviderTerminate: LegalInsight
  liabilityLimitation: LegalInsight
  arbitrationRequired: LegalInsight
  jurisdictionSpecified: LegalInsight
  confidentialityPresent: LegalInsight
  autoRenewalPresent: LegalInsight
  indemnificationPresent: LegalInsight
  nonCompetePresent: LegalInsight
  ipTransferPresent: LegalInsight
  conflictOfInterestPresent: LegalInsight
  unusualClauses: string[]
  oneSidedProvisions: string[]
}

export interface ConflictOfInterest {
  riskLevel: string
  explanation: string
  evidence: string | null
  potentialImpact: string
  recommendedAction: string
}

export interface FavorableClause {
  clause: string
  benefit: string
  evidence: string | null
}

export interface JurisdictionInsights {
  jurisdiction: string
  governingLaw: string
  legalContext: string
  evidence: string | null
}

export interface ContractScoreBreakdown {
  overallScore: number
  riskExposureScore: number
  financialExposureScore: number
  terminationFairnessScore: number
  transparencyScore: number
  conflictRiskScore: number
  explanation: string
}

export interface ContractScoreCard {
  score: number
  balance: string
  riskExposure: string
  fairnessExplanation: string
  breakdown: ContractScoreBreakdown | null
}

export interface AdvancedAnalysisResult {
  documentType: string
  documentTypeReasoning: string
  executiveSummary: string
  plainLanguage: string
  topRedFlags: RedFlag[]
  importantClauses: ImportantClause[]
  rightsObligations: RightsObligations
  importantDates: ImportantDate[]
  financialAnalysis: FinancialAnalysis
  beforeYouSign: BeforeYouSign
  legalInsights: LegalInsights
  conflictOfInterest: ConflictOfInterest
  favorableClauses: FavorableClause[]
  jurisdictionInsights: JurisdictionInsights
  contractScore: ContractScoreBreakdown | null
}
