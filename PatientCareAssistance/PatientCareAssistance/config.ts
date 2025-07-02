// Configuration constants for the Patient Care Assistant component

export const CONFIG = {
  COPILOT_EVENT_NAME: "healthcare.patient_care_optimization.pcf",
  DEFAULT_CARD_WIDTH: 500,
  DEFAULT_CARD_HEIGHT: 400,
  LOADING_TIMEOUT_MS: 30000, // 30 seconds
} as const;

export const VALIDATION_MESSAGES = {
  PATIENT_ID_REQUIRED: "Patient ID is required",
  SYMPTOMS_REQUIRED: "Symptoms are required",
  NO_RECOMMENDATION: "No recommendation received from Copilot agent",
  NETWORK_ERROR: "Network error occurred. Please check your connection",
  TIMEOUT_ERROR: "Request timed out. Please try again",
  GENERIC_ERROR: "An error occurred while processing your request",
} as const;

export const UI_STRINGS = {
  LOADING_MESSAGE: "Copilot is thinking...",
  APPLY_BUTTON_TEXT: "Apply Recommendation",
  APPLIED_BUTTON_TEXT: "Recommendation Applied",
  AI_DISCLAIMER: "AI-generated content may be incorrect",
  NO_RECOMMENDATION_MESSAGE: "No recommendation yet",
} as const;
