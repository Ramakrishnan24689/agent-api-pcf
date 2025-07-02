// Type definitions for the Patient Care Assistant component

export interface CopilotMessage {
  type: string;
  timestamp: string;
  replyToId: string;
  attachments: unknown[];
  id: string;
  textFormat: string;
  text: string;
}

export interface CopilotResult {
  completionTokens?: number;
  dataUsed?: string;
  finishReason?: string;
  imagesCount?: number;
  modelName?: string;
  modelType?: string;
  promptTokens?: number;
  structuredOutput?: {
    patientInsights?: PatientInsights;
    recommendation?: string;
  };
  text?: string;
  thoughtSteps?: string;
  totalTokens?: number;
  [key: string]: unknown;
}

export interface PatientInsights {
  recentSymptoms?: number;
  averageSeverity?: string | number;
  lastTreatmentDate?: string;
  [key: string]: unknown;
}

export interface ParsedTextData {
  patientInsights?: PatientInsights;
  recommendation?: string;
  [key: string]: unknown;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  retryAttempt?: number;
}
