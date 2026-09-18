/**
 * AI-Clinical Misconception System - Shared Types
 */

export type Role = 'student' | 'lecturer' | 'researcher' | 'admin';

export type SubmissionStatus =
  | 'SUBMITTED'
  | 'ANALYZING'
  | 'ANALYSIS_FAILED'
  | 'PENDING_VALIDATION'
  | 'VALIDATED'
  | 'REJECTED';

export type ValidationAction = 'ACCEPTED' | 'EDITED' | 'REJECTED';

export type MisconceptionStatus = 'LECTURER_DEFINED' | 'LLM_CANDIDATE' | 'PROMOTED' | 'REJECTED';

export interface DiagnosticTier {
  id: string;
  name: string;
  code: string;
  level: number; // 1 (Highest mastery) to 4 (Critical misconception/safety risk)
  color: string;
  bgLight: string;
  borderLight: string;
  textColor: string;
  description: string;
  subjectId?: string; // If undefined, universal fallback
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string;
  lecturerCount: number;
  studentCount: number;
  activeSetsCount: number;
  accentColor: string;
  icon: string;
}

export interface ConceptIndicator {
  id: string;
  code: string;
  label: string;
  weight: number; // Stored as decimal e.g. 0.3500. Total must be 1.0000
  clinicalRationale: string;
}

export interface QuestionVersion {
  id: string;
  questionId: string;
  versionNumber: number;
  prompt: string;
  clinicalScenario: string;
  modelAnswer: string;
  isPublished: boolean;
  publishedAt?: string;
  indicators: ConceptIndicator[];
  attachedMisconceptions: string[];
  createdAt: string;
}

export interface Question {
  id: string;
  setId: string;
  title: string;
  order: number;
  clinicalDomain: string;
  versions: QuestionVersion[];
  activeVersionId: string;
}

export interface QuestionSet {
  id: string;
  subjectId: string;
  topicId: string;
  topicName: string;
  title: string;
  code: string; // e.g. "CARD-2026-Q1"
  description: string;
  estimatedMinutes: number;
  questions: Question[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
}

export interface KnowledgeChunk {
  id: string;
  documentTitle: string;
  subjectId: string;
  chunkIndex: number;
  content: string;
  similarityScore: number; // Cosine similarity e.g. 0.89
  retrievalSource: string;
}

export interface LLMAnalysis {
  id: string;
  submissionId: string;
  percentageScore: number;
  tierId: string;
  tierName: string;
  confidence: number; // 0.0 - 1.0
  explanation: string;
  detectedMisconceptions: Array<{
    id: string;
    label: string;
    isNewCandidate: boolean;
    evidenceQuote: string;
    clinicalCorrection: string;
  }>;
  suggestedMaterials: string[];
  conceptScores: Array<{
    indicatorId: string;
    label: string;
    score: number; // 0.0 - 1.0
    weight: number;
    remarks: string;
  }>;
  retrievedChunks: KnowledgeChunk[];
  rawJson: string;
  modelUsed: string;
  processingTimeMs: number;
  createdAt: string;
}

export interface StructuredDiff {
  score?: { original: number; modified: number };
  tier?: { original: string; modified: string };
  explanation?: { original: string; modified: string };
  misconceptions?: { original: string[]; modified: string[] };
  materials?: { original: string[]; modified: string[] };
}

export interface LecturerValidation {
  id: string;
  analysisId: string;
  submissionId: string;
  lecturerId: string;
  lecturerName: string;
  status: ValidationAction;
  finalScore?: number;
  finalTierId?: string;
  finalTierName?: string;
  finalExplanation?: string;
  finalMaterials?: string[];
  notes?: string;
  structuredDiff?: StructuredDiff;
  validatedAt: string;
}

export interface Submission {
  id: string;
  questionSetId: string;
  questionSetName: string;
  questionId: string;
  questionTitle: string;
  versionId: string;
  subjectId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  attemptNo: number;
  answer: string;
  submittedAt: string;
  status: SubmissionStatus;
  analysis?: LLMAnalysis;
  validation?: LecturerValidation;
}

export interface MisconceptionCatalogItem {
  id: string;
  subjectId: string;
  topicName: string;
  label: string;
  description: string;
  clinicalConsequence: string;
  remediationNote: string;
  status: MisconceptionStatus;
  frequency: number;
  evidenceQuotes: string[];
  firstDetectedAt: string;
  promotedBy?: string;
  promotedAt?: string;
  associatedQuestionTitles: string[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: Role;
  action: string;
  entityType: string;
  entityId: string;
  subjectId?: string;
  details: string;
  diffSummary?: string;
}

export interface ExportJob {
  id: string;
  requestedBy: string;
  role: Role;
  subjectId: string;
  subjectName: string;
  format: 'CSV' | 'PDF';
  scope: string; // e.g. "Subject Cardiology - All Validated 2026"
  dateRange: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  rowCount?: number;
  downloadUrl?: string;
  createdAt: string;
}

export interface AnomalyFlag {
  id: string;
  submissionId: string;
  studentName: string;
  type: 'PROMPT_INJECTION' | 'DUPLICATE_ANSWER' | 'EXTREME_LENGTH' | 'TOKEN_ANOMALY';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  detectedAt: string;
  detail: string;
  status: 'PENDING_REVIEW' | 'DISMISSED' | 'CONFIRMED_VIOLATION';
}
