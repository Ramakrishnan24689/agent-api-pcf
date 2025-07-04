/**
 * Financial Copilot Service
 * 
 * This service demonstrates how to integrate with the Agent API in a PCF control.
 * It shows the proper way to call AI agents and handle their responses.
 */
import { IInputs } from "./generated/ManifestTypes";

// Define the structure of the Copilot response
export interface CopilotFinancialResponse {
  completionTokens?: number;
  dataUsed?: string;
  finishReason?: string;
  imagesCount?: number;
  modelName?: string;
  modelType?: string;
  promptTokens?: number;
  structuredOutput?: {
    riskAssessment?: {
      currentRiskLevel?: string;
      riskScore?: number;
      volatilityForecast?: string;
      correlationRisk?: string;
      behavioralRisk?: string;
    };
    marketInsights?: {
      macroeconomicOutlook?: string;
      sectorRotationProbability?: string;
      geopoliticalImpact?: string;
      timeHorizon?: string;
    };
    optimizationRecommendations?: {
      immediateActions?: (string | { item: string })[];
      hedgingStrategies?: (string | { item: string })[];
      behavioralManagement?: (string | { item: string })[];
    };
    quantitativeProjections?: {
      expectedReturn?: number;
      volatilityReduction?: string;
      probabilityOfGoal?: number;
      worstCaseScenario?: string;
    };
  };
  text?: string;
  thoughtSteps?: string;
  totalTokens?: number;
}

/**
 * Main function to get financial risk assessment from the Agent API
 * 
 * This function demonstrates the key pattern for calling agents:
 * 1. Use context.copilot.executeEvent() with a unique event name
 * 2. Pass relevant data as parameters
 * 3. Handle both structured and unstructured responses
 * 4. Implement proper error handling
 */
export async function getFinancialRiskAssessment(
  context: ComponentFramework.Context<IInputs>,
  clientId?: string,
  marketData?: string,
  portfolioComposition?: string
): Promise<CopilotFinancialResponse> {
  try {
    // IMPORTANT: This is the key Agent API call pattern
    // - First parameter: unique event name for your agent
    // - Second parameter: data object with relevant information
    // The agent can use this information to provide recommendations
    // though in this example agent uses AI Tool Prompts to get relevant details.
    const result = await context.copilot.executeEvent(
      "financial.dynamic_risk_optimization.pcf",
      { 
        clientId: clientId ?? "", 
        marketData: marketData ?? "", 
        portfolioComposition: portfolioComposition ?? ""
      }
    );
    console.log("Financial Copilot response:", result);
    
    // Handle empty or invalid responses
    if (!Array.isArray(result) || !result.length) {
      return { text: "No financial assessment received from Copilot agent." };
    }

    // Extract the response text from the Agent API result
    const responseText = result[0].text;
    if (!responseText) {
      return { text: "No assessment text returned from Copilot agent." };
    }

    // Try to parse the response as structured JSON
    // This allows for both structured and unstructured agent responses
    try {
      const parsedResponse = JSON.parse(responseText) as CopilotFinancialResponse;
      return parsedResponse;
    } catch (parseError) {
      // If parsing fails, return the raw text
      // This ensures the control still works even if the agent returns plain text
      console.warn("Failed to parse Copilot response as JSON:", parseError);
      return { text: responseText };
    }
    
  } catch (err) {
    // Proper error handling for Agent API calls
    return { text: `Error: ${err instanceof Error ? err.message : String(err)}` };
  }
}
