/**
 * Custom hook for managing financial analysis data and Agent API integration
 * 
 * This hook demonstrates how to:
 * - Manage complex state related to AI responses
 * - Handle Agent API calls with proper error handling
 * - Process both structured and unstructured agent responses
 * - Implement loading states and user feedback
 */
import * as React from 'react';
import { getFinancialRiskAssessment, CopilotFinancialResponse } from '../FinancialCopilotService';
import { IInputs } from '../generated/ManifestTypes';

interface FinancialInsights {
  currentRiskLevel?: string;
  riskScore?: number;
  expectedReturn?: number;
  probabilityOfGoal?: number;
  volatilityForecast?: string;
  immediateActions?: string[];
  hedgingStrategies?: string[];
  behavioralManagement?: string[];
  [key: string]: unknown;
}

interface ParsedTextData {
  riskAssessment?: {
    currentRiskLevel?: string;
    riskScore?: number;
    volatilityForecast?: string;
    correlationRisk?: string;
  };
  marketInsights?: {
    macroeconomicOutlook?: string;
    sectorRotationProbability?: string;
  };
  optimizationRecommendations?: {
    immediateActions?: string[];
    hedgingStrategies?: string[];
    behavioralManagement?: string[];
  };
  quantitativeProjections?: {
    expectedReturn?: number;
    probabilityOfGoal?: number;
  };
  recommendation?: string;
  [key: string]: unknown;
}

interface UseFinancialAnalysisProps {
  context: ComponentFramework.Context<IInputs>;
  clientId: string;
  marketData: string;
  portfolioComposition: string;
  setRiskAdjustment: (adjustment: string) => void;
}

export const useFinancialAnalysis = ({
  context,
  clientId,
  marketData,
  portfolioComposition,
  setRiskAdjustment
}: UseFinancialAnalysisProps) => {
  const [recommendation, setRecommendation] = React.useState<string>("");
  const [loadingAnalysis, setLoadingAnalysis] = React.useState<boolean>(true);
  const [insights, setInsights] = React.useState<FinancialInsights>({});
  const [applied, setApplied] = React.useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = React.useState<boolean>(false);

  // Fetch financial analysis when input parameters change
  // This demonstrates the proper pattern for calling agents in React components
  React.useEffect(() => {
    let isMounted = true;
    
    const fetchFinancialAnalysis = async () => {
      try {
        setLoadingAnalysis(true);
        
        // Call the Agent API through our service
        const result = await getFinancialRiskAssessment(context, clientId, marketData, portfolioComposition);
        
        // Process the agent response
        let parsed: CopilotFinancialResponse = {};
        console.log('Financial Analysis Result:', result);
        
        // Handle different response formats from the agent
        if (typeof result === 'string') {
          try {
            parsed = JSON.parse(result) as CopilotFinancialResponse;
          } catch {
            parsed = { text: result };
          }
        } else if (typeof result === 'object' && result !== null) {
          parsed = result;
        }
        
        // Extract insights from structured output or text fallback
        let recommendation = "";
        const riskInsights = {
          currentRiskLevel: undefined as string | undefined,
          riskScore: undefined as number | undefined,
          expectedReturn: undefined as number | undefined,
          probabilityOfGoal: undefined as number | undefined,
          volatilityForecast: undefined as string | undefined,
          immediateActions: undefined as string[] | undefined,
          hedgingStrategies: undefined as string[] | undefined,
          behavioralManagement: undefined as string[] | undefined,
        };

        if (parsed.structuredOutput) {
          // Use structured output (preferred)
          const riskAssessment = parsed.structuredOutput.riskAssessment;
          const quantProjections = parsed.structuredOutput.quantitativeProjections;
          const optimization = parsed.structuredOutput.optimizationRecommendations;
          
          if (riskAssessment) {
            riskInsights.currentRiskLevel = riskAssessment.currentRiskLevel;
            riskInsights.riskScore = riskAssessment.riskScore;
            riskInsights.volatilityForecast = riskAssessment.volatilityForecast;
          }
          
          if (quantProjections) {
            riskInsights.expectedReturn = quantProjections.expectedReturn;
            riskInsights.probabilityOfGoal = quantProjections.probabilityOfGoal;
          }
          
          if (optimization) {
            riskInsights.immediateActions = optimization.immediateActions?.map(action => 
              typeof action === 'string' ? action : (action as { item: string }).item
            );
            riskInsights.hedgingStrategies = optimization.hedgingStrategies?.map(strategy => 
              typeof strategy === 'string' ? strategy : (strategy as { item: string }).item
            );
            riskInsights.behavioralManagement = optimization.behavioralManagement?.map(guidance => 
              typeof guidance === 'string' ? guidance : (guidance as { item: string }).item
            );
          }
          
          // Build recommendation text
          recommendation = `Risk Level: ${riskAssessment?.currentRiskLevel ?? 'Unknown'}. `;
          recommendation += `Expected Return: ${quantProjections?.expectedReturn ?? 'N/A'}%. `;
          recommendation += `Goal Probability: ${quantProjections?.probabilityOfGoal ?? 'N/A'}%. `;
          
          const allRecommendations = [
            ...(riskInsights.immediateActions ?? []),
            ...(riskInsights.hedgingStrategies ?? []),
            ...(riskInsights.behavioralManagement ?? [])
          ];
          
          if (allRecommendations.length > 0) {
            recommendation += `Key Recommendations: ${allRecommendations.slice(0, 2).join('; ')}.`;
          }
        } else if (parsed.text) {
          try {
            const textData = JSON.parse(parsed.text) as ParsedTextData;
            recommendation = textData.recommendation ?? "";
            
            if (textData.riskAssessment) {
              riskInsights.currentRiskLevel = textData.riskAssessment.currentRiskLevel;
              riskInsights.riskScore = textData.riskAssessment.riskScore;
              riskInsights.volatilityForecast = textData.riskAssessment.volatilityForecast;
            }
            
            if (textData.quantitativeProjections) {
              riskInsights.expectedReturn = textData.quantitativeProjections.expectedReturn;
              riskInsights.probabilityOfGoal = textData.quantitativeProjections.probabilityOfGoal;
            }
            
            if (textData.optimizationRecommendations) {
              riskInsights.immediateActions = textData.optimizationRecommendations.immediateActions;
              riskInsights.hedgingStrategies = textData.optimizationRecommendations.hedgingStrategies;
              riskInsights.behavioralManagement = textData.optimizationRecommendations.behavioralManagement;
            }
          } catch {
            recommendation = parsed.text;
          }
        }
        
        if (isMounted) {
          setRecommendation(recommendation);
          setInsights({
            currentRiskLevel: riskInsights.currentRiskLevel,
            riskScore: riskInsights.riskScore ?? 65, // Default for demo
            expectedReturn: riskInsights.expectedReturn,
            probabilityOfGoal: riskInsights.probabilityOfGoal,
            volatilityForecast: riskInsights.volatilityForecast,
            immediateActions: riskInsights.immediateActions,
            hedgingStrategies: riskInsights.hedgingStrategies,
            behavioralManagement: riskInsights.behavioralManagement,
            ...parsed
          });
        }
      } catch (error) {
        console.error('Error fetching financial analysis:', error);
        if (isMounted) {
          setRecommendation('Failed to load financial analysis. Please try again.');
          setInsights({
            currentRiskLevel: 'Error',
            riskScore: 0,
            expectedReturn: 0,
            probabilityOfGoal: 0
          });
        }
      } finally {
        if (isMounted) {
          setLoadingAnalysis(false);
        }
      }
    };

    fetchFinancialAnalysis().catch(error => {
      console.error('Unhandled error in fetchFinancialAnalysis:', error);
    });

    return () => { isMounted = false; };
  }, [context, clientId, marketData, portfolioComposition]);

  // Apply optimization recommendations
  const handleApplyOptimization = React.useCallback(() => {
    setIsOptimizing(true);
    setRiskAdjustment(recommendation);
    
    // Delay the risk reduction animation for better UX
    setTimeout(() => {
      setInsights(prevInsights => {
        const currentRiskScore = prevInsights.riskScore ?? 65;
        const reductionFactor = 0.7 + (Math.random() * 0.2); // 10-30% reduction
        const optimizedRiskScore = Math.max(15, Math.round(currentRiskScore * reductionFactor));
        
        let newRiskLevel = 'Low';
        if (optimizedRiskScore > 30) newRiskLevel = 'Medium';
        if (optimizedRiskScore > 60) newRiskLevel = 'High';
        
        const reductionPercentage = Math.round((currentRiskScore - optimizedRiskScore) / currentRiskScore * 100);
        
        return {
          ...prevInsights,
          riskScore: optimizedRiskScore,
          currentRiskLevel: newRiskLevel,
          volatilityForecast: `Optimized Portfolio: ${reductionPercentage}% risk reduction achieved`,
          expectedReturn: prevInsights.expectedReturn ? Math.round((prevInsights.expectedReturn + 0.5) * 10) / 10 : undefined,
          probabilityOfGoal: prevInsights.probabilityOfGoal ? Math.min(95, prevInsights.probabilityOfGoal + 5) : undefined
        };
      });
      
      setApplied(true);
      setIsOptimizing(false);
    }, 1500); // 1.5 second delay for animation effect
  }, [recommendation, setRiskAdjustment]);

  // Reset applied state when recommendation changes
  React.useEffect(() => {
    setApplied(false);
  }, [recommendation]);

  return {
    recommendation,
    loadingAnalysis,
    insights,
    applied,
    isOptimizing,
    handleApplyOptimization
  };
};
