import { IInputs } from "./generated/ManifestTypes";

export async function getPatientCareRecommendation(
  context: ComponentFramework.Context<IInputs>,
  patientId: string,
  symptoms: string
): Promise<string> {
  try {
    // Note : In this example, record is passed along with unique event name to the Copilot agent. 
    // The agent can use this information to provide a recommendation, but in this example we DO NOT use it in the agent.
    const result = await context.copilot.executeEvent(
      "healthcare.patient_care_optimization.pcf",
      { id: patientId, symptoms }
    );
    console.log("Copilot response:", result);
    if (!Array.isArray(result) || !result.length) {
      return "No recommendation received from Copilot agent.";
    }
    return result[0].text ?? "No recommendation text returned.";
  } catch (err) {
    return `Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}
