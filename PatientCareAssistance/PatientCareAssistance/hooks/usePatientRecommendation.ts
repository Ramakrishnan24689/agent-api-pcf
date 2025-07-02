import * as React from 'react';
import { CopilotMessage, ServiceResponse, PatientInsights, ParsedTextData } from '../types';
import { getPatientCareRecommendation } from '../CopilotService';
import { IInputs } from '../generated/ManifestTypes';

export interface UsePatientRecommendationResult {
  recommendation: string;
  loadingRecommendation: boolean;
  insights: PatientInsights;
  error: string;
  fetchRecommendation: () => Promise<void>;
}

export const usePatientRecommendation = (
  context: ComponentFramework.Context<IInputs>,
  patientId?: string,
  symptoms?: string
): UsePatientRecommendationResult => {
  const [recommendation, setRecommendation] = React.useState<string>("");
  const [loadingRecommendation, setLoadingRecommendation] = React.useState<boolean>(true);
  const [insights, setInsights] = React.useState<PatientInsights>({});
  const [error, setError] = React.useState<string>("");

  const fetchRecommendation = React.useCallback(async () => {
    try {
      setLoadingRecommendation(true);
      setError("");
      
      const result: ServiceResponse<CopilotMessage[]> = await getPatientCareRecommendation(
        context, 
        patientId, 
        symptoms
      );
      
      if (!result.success) {
        throw new Error(result.error ?? "Unknown error occurred");
      }

      if (!result.data?.length) {
        throw new Error("No data received from service");
      }

      // Handle the message-based response structure
      const messageResult = result.data[0];
      
      // Parse the text field which contains the actual recommendation data
      let parsedData: ParsedTextData;
      try {
        if (messageResult.text) {
          // First, parse the outer JSON structure
          const outerParsed: unknown = JSON.parse(messageResult.text);
          
          // Type guard to check if parsed data is an object
          if (typeof outerParsed !== 'object' || outerParsed === null) {
            throw new Error('Parsed data is not an object');
          }
          
          const outerData = outerParsed as Record<string, unknown>;
          
          // Check if we have structured output (preferred) or text field
          let innerData: Record<string, unknown> | null = null;
          
          if (outerData.structuredOutput && typeof outerData.structuredOutput === 'object' && outerData.structuredOutput !== null) {
            innerData = outerData.structuredOutput as Record<string, unknown>;
          } else if (outerData.text && typeof outerData.text === 'string') {
            try {
              const innerParsed: unknown = JSON.parse(outerData.text);
              if (typeof innerParsed === 'object' && innerParsed !== null) {
                innerData = innerParsed as Record<string, unknown>;
              }
            } catch (innerError) {
              console.warn("Failed to parse inner text JSON:", innerError);
              // Fallback to using the outer parsed data directly
              innerData = outerData;
            }
          } else {
            // Fallback to using the outer parsed data directly
            innerData = outerData;
          }
          
          if (innerData) {
            parsedData = {
              patientInsights: typeof innerData.patientInsights === 'object' && innerData.patientInsights !== null 
                ? innerData.patientInsights as PatientInsights 
                : undefined,
              recommendation: typeof innerData.recommendation === 'string' 
                ? innerData.recommendation 
                : undefined
            };
          } else {
            throw new Error('Unable to extract data from Copilot response');
          }
        } else {
          throw new Error('No text content in Copilot response');
        }
      } catch (error) {
        console.error('Failed to parse Copilot response text:', error);
        throw new Error('Invalid response format from Copilot service');
      }
      
      // Extract recommendation and patient insights
      const extractedRecommendation = parsedData.recommendation ?? 'No recommendation available';
      const patientInsights: PatientInsights = parsedData.patientInsights ?? {
        recentSymptoms: 0,
        averageSeverity: 'Unknown',
        lastTreatmentDate: 'Unknown'
      };

      setRecommendation(extractedRecommendation);
      setInsights(patientInsights);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error fetching recommendation:', error);
      setError(errorMessage);
      setRecommendation('');
    } finally {
      setLoadingRecommendation(false);
    }
  }, [context, patientId, symptoms]);

  React.useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      void fetchRecommendation().catch(error => {
        console.error('Unhandled error in fetchRecommendation:', error);
      });
    }

    return () => { isMounted = false; };
  }, [fetchRecommendation]);

  return {
    recommendation,
    loadingRecommendation,
    insights,
    error,
    fetchRecommendation
  };
};
