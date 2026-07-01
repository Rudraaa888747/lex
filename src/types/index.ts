export interface DocumentItem {
  id: string
  title: string
  type?: string
}

export interface DocumentData {
  id: string
  title: string
  type: string
  status: string
  createdAt: string
  content?: string
}

export interface AnalysisData {
  summary?: string
  plainLanguage?: string
  keyClauses?: string
  rightsObligations?: string
  importantDates?: string
  financialTerms?: string
  riskAssessment?: string
  topRedFlags?: string
  importantClauses?: string
  beforeYouSign?: string
  legalInsights?: string
  contractScore?: string
  conflictOfInterest?: string
  favorableClauses?: string
  jurisdictionInsights?: string
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export interface ActivityItem {
  id: string
  action: string
  details?: string
  createdAt: string
  type?: string
}

export interface DashboardDocument {
  id: string
  title: string
  type: string
  status: string
  createdAt: string
  fileSize: number
  language: string
}

export interface DashboardStats {
  totalDocuments: number
  analyzedDocuments: number
  totalRisksFound: number
  activeSubscriptions: number
}
