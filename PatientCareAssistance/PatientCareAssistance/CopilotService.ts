import { IInputs } from "./generated/ManifestTypes";
import { ServiceResponse, CopilotMessage } from "./types";
import { CONFIG, VALIDATION_MESSAGES } from "./config";

export async function getPatientCareRecommendation(
  context: ComponentFramework.Context<IInputs>,
  patientId?: string,
  symptoms?: string
): Promise<ServiceResponse<CopilotMessage[]>> {
  try {
    // Note: In this example, record is passed along with unique event name to the Copilot agent. 
    // The agent can use this information to provide a recommendation.
    const result = await Promise.race([
      context.copilot.executeEvent(
        CONFIG.COPILOT_EVENT_NAME,
        { id: patientId ?? "", symptoms: symptoms ?? "" }
      ),
      new Promise((_resolve, reject) => 
        setTimeout(() => reject(new Error(VALIDATION_MESSAGES.TIMEOUT_ERROR)), CONFIG.LOADING_TIMEOUT_MS)
      )
    ]);

    console.log("Copilot response - ", result);
    
    if (!Array.isArray(result) || !result.length) {
      return { 
        success: false, 
        error: VALIDATION_MESSAGES.NO_RECOMMENDATION 
      };
    }

    return { 
      success: true, 
      data: result as CopilotMessage[]
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Copilot service error:", errorMessage, err);
    
    // Categorize errors for better user experience
    let userFriendlyError: string = VALIDATION_MESSAGES.GENERIC_ERROR;
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      userFriendlyError = VALIDATION_MESSAGES.NETWORK_ERROR;
    } else if (errorMessage.includes('timeout')) {
      userFriendlyError = VALIDATION_MESSAGES.TIMEOUT_ERROR;
    }
    
    return { 
      success: false, 
      error: `${userFriendlyError}: ${errorMessage}` 
    };
  }
}
