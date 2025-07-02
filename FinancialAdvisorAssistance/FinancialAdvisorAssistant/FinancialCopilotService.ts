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

export async function getFinancialRiskAssessment(
  context: ComponentFramework.Context<IInputs>,
  clientId: string,
  marketData: string,
  portfolioComposition: string
): Promise<CopilotFinancialResponse> {
  try {
     // Note : In this example, record is passed along with unique event name to the Copilot agent. 
     // The agent can use this information to provide a recommendation, but in this example, it is NOT used in the agent.
    const result = await context.copilot.executeEvent(
      "financial.dynamic_risk_optimization.pcf",
      { 
        clientId, 
        marketData, 
        portfolioComposition 
      }
    );
    console.log("Financial Copilot response:", result);
    
    if (!Array.isArray(result) || !result.length) {
      return { text: "No financial assessment received from Copilot agent." };
    }

    // Get the text from the MCS response
    const responseText = result[0].text;
    if (!responseText) {
      return { text: "No assessment text returned from Copilot agent." };
    }

    // Try to parse the text as our financial response structure
    try {
      const parsedResponse = JSON.parse(responseText) as CopilotFinancialResponse;
      return parsedResponse;
    } catch (parseError) {
      // If parsing fails, return the raw text
      console.warn("Failed to parse Copilot response as JSON:", parseError);
      return { text: responseText };
    }
    
  } catch (err) {
    return { text: `Error: ${err instanceof Error ? err.message : String(err)}` };
  }
}
