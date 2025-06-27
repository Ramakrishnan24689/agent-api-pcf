import * as React from 'react';
import { Card, CardHeader, CardFooter, FluentProvider, webLightTheme } from '@fluentui/react-components';
import { 
  CalendarMonthRegular, 
  MoneyRegular, 
  DataTrendingRegular, 
  InfoSparkleFilled,
  ShieldTaskRegular,
  DataTrendingRegular as TrendingRegular,
  ShieldCheckmarkRegular,
  PersonSupportRegular
} from '@fluentui/react-icons';
import { GaugeChart, DataVizPalette, getColorFromToken } from '@fluentui/react-charts';
import { getFinancialRiskAssessment, CopilotFinancialResponse } from "./FinancialCopilotService";
import { IInputs } from './generated/ManifestTypes';

export interface IFinancialAdvisorAssistantProps {
  clientId: string;
  marketData: string;
  portfolioComposition: string;
  riskAdjustment: string;
  getFinancialRiskAssessment: typeof getFinancialRiskAssessment;
  context: ComponentFramework.Context<IInputs>;
  setRiskAdjustment: (adjustment: string) => void;
}

const FinancialShimmer: React.FC = () => (
  <div style={{ minHeight: 60, display: 'flex', alignItems: 'center' }}>
    <div className="financial-shimmer" style={{ width: '100%', height: 32, borderRadius: 4, background: 'linear-gradient(90deg, #f3f2f1 25%, #e0e0e0 50%, #f3f2f1 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite linear' }} />
    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  </div>
);

export const FinancialAdvisorAssistantComponent: React.FC<IFinancialAdvisorAssistantProps> = ({
  clientId,
  marketData,
  portfolioComposition,
  riskAdjustment,
  getFinancialRiskAssessment,
  context,
  setRiskAdjustment
}) => {
  // Define types for the financial analysis result
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

  const [recommendation, setRecommendation] = React.useState<string>("");
  const [loadingAnalysis, setLoadingAnalysis] = React.useState<boolean>(true);
  const [insights, setInsights] = React.useState<{
    currentRiskLevel?: string;
    riskScore?: number;
    expectedReturn?: number;
    probabilityOfGoal?: number;
    volatilityForecast?: string;
    immediateActions?: string[];
    hedgingStrategies?: string[];
    behavioralManagement?: string[];
    [key: string]: unknown;
  }>({});
  const [applied, setApplied] = React.useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = React.useState<boolean>(false);
  const [gaugeContainerRef, setGaugeContainerRef] = React.useState<HTMLDivElement | null>(null);
  const [gaugeDimensions, setGaugeDimensions] = React.useState({ width: 252, height: 160 });

  // Update gauge dimensions based on container size
  React.useEffect(() => {
    if (!gaugeContainerRef) return;

    const updateDimensions = () => {
      const containerRect = gaugeContainerRef.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Calculate responsive dimensions with some padding
      const maxWidth = Math.min(containerWidth - 40, 400); // 20px padding on each side, max 400px
      const aspectRatio = 160 / 252; // Original aspect ratio (height/width)
      const calculatedHeight = maxWidth * aspectRatio;
      
      setGaugeDimensions({
        width: Math.max(200, maxWidth), // Minimum width of 200px
        height: Math.max(120, calculatedHeight) // Minimum height of 120px
      });
    };

    // Initial calculation
    updateDimensions();

    // Add resize observer for responsive updates
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(gaugeContainerRef);

    return () => {
      resizeObserver.disconnect();
    };
  }, [gaugeContainerRef]);

  // Fetch financial analysis on mount
  React.useEffect(() => {
    let isMounted = true;
    
    const fetchFinancialAnalysis = async () => {
      try {
        setLoadingAnalysis(true);
        const result = await getFinancialRiskAssessment(context, clientId, marketData, portfolioComposition);
        
        let parsed: CopilotFinancialResponse = {};
        console.log('Financial Analysis Result:', result);
        
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
  }, [context, clientId, marketData, portfolioComposition, getFinancialRiskAssessment]);

  // Apply optimization recommendations
  const handleApplyOptimization = () => {
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
  };

  React.useEffect(() => {
    setApplied(false);
  }, [recommendation]);

  // Risk color configuration for visual representation
  const getRiskColor = (riskScore: number): string => {
    if (riskScore <= 30) return '#10B981'; // Green - Low risk
    if (riskScore <= 60) return '#F59E0B'; // Yellow - Medium risk  
    return '#EF4444'; // Red - High risk
  };

  // Get risk segments for the gauge chart
  const getRiskSegments = (riskScore: number) => {
    const lowRiskSize = Math.min(riskScore, 33);
    const mediumRiskSize = riskScore > 33 ? Math.min(riskScore - 33, 34) : 0;
    const highRiskSize = riskScore > 67 ? riskScore - 67 : 0;

    return [
      {
        size: 33,
        color: getColorFromToken(DataVizPalette.success),
        legend: 'Low Risk',
      },
      {
        size: 34,
        color: getColorFromToken(DataVizPalette.warning),
        legend: 'Medium Risk',
      },
      {
        size: 33,
        color: getColorFromToken(DataVizPalette.error),
        legend: 'High Risk',
      },
    ];
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <Card style={{ width: 600, minHeight: 500, margin: '0 auto', background: '#f8fafd', border: 'none', boxShadow: '0 2px 12px #e0e7ef', position: 'relative' }} className={!loadingAnalysis && recommendation ? 'financial-card-success-flair' : ''}>
        {loadingAnalysis && (
          <div className="financial-progress-bar">
            <div className="financial-progress-fill"></div>
          </div>
        )}
        <style>{`
          .financial-progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: rgba(16, 185, 129, 0.1);
            border-radius: 0 0 8px 8px;
            overflow: hidden;
          }
          
          .financial-progress-fill {
            height: 100%;
            width: 40%;
            background: linear-gradient(90deg, 
              transparent 0%, 
              rgba(16, 185, 129, 0.3) 20%, 
              #10B981 50%, 
              #F59E0B 60%, 
              rgba(245, 158, 11, 0.3) 80%, 
              transparent 100%
            );
            border-radius: 0 0 8px 8px;
            animation: financial-progress-sweep 1.5s infinite linear;
            box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
          }
          
          .financial-card-success-flair {
            border: 2px solid transparent;
            background: linear-gradient(#f8fafd, #f8fafd) padding-box, 
                        linear-gradient(90deg, #10B981 0%, #F59E0B 50%, #10B981 100%) border-box;
            border-radius: 12px;
            animation: financial-success-glow 3s ease-in-out infinite;
          }
          
          .financial-card-success-flair::before {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            background: linear-gradient(90deg, #10B981, #F59E0B, #10B981);
            border-radius: 15px;
            z-index: -1;
            animation: financial-border-rotate 4s linear infinite;
            opacity: 0.4;
            filter: blur(2px);
          }
          
          @keyframes financial-progress-sweep {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(250%);
            }
          }
          
          @keyframes financial-success-glow {
            0% { 
              box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
            }
            50% { 
              box-shadow: 0 6px 24px rgba(245, 158, 11, 0.25), 
                          0 0 0 1px rgba(16, 185, 129, 0.1);
            }
            100% { 
              box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
            }
          }
          
          @keyframes financial-border-rotate {
            0% { 
              background: linear-gradient(0deg, #10B981, #F59E0B, #10B981, #F59E0B);
            }
            25% { 
              background: linear-gradient(90deg, #F59E0B, #10B981, #F59E0B, #10B981);
            }
            50% { 
              background: linear-gradient(180deg, #10B981, #F59E0B, #10B981, #F59E0B);
            }
            75% { 
              background: linear-gradient(270deg, #F59E0B, #10B981, #F59E0B, #10B981);
            }
            100% { 
              background: linear-gradient(360deg, #10B981, #F59E0B, #10B981, #F59E0B);
            }
          }
          
          .insights-header {
            background: linear-gradient(90deg, #10B981 0%, #F59E0B 100%);
            color: #fff;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 8px 8px 0 0;
            font-size: 1.1em;
            letter-spacing: 1px;
          }
          
          .insights-section {
            padding: 16px;
            border-bottom: 1px solid #e0e0e0;
            background: #fff;
          }
          
          .risk-gauge-section {
            padding: 20px;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #e0e0e0;
            width: 100%;
            min-height: 200px;
            box-sizing: border-box;
          }
          
          .recommendations-section {
            padding: 16px;
            background: #f3f2f1;
            border-radius: 0 0 8px 8px;
          }
          
          .ai-disclaimer {
            font-size: 0.8em;
            color: #888;
            margin-top: 8px;
            text-align: right;
          }
          
          .financial-apply-btn {
            display: inline-flex;
            align-items: center;
            border: 2px solid transparent;
            background: linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #10B981 0%, #F59E0B 100%) border-box;
            color: #222;
            border-radius: 8px;
            padding: 8px 22px 8px 14px;
            font-size: 1rem;
            font-weight: 600;
            box-shadow: 0 2px 8px #e0e7ef;
            cursor: pointer;
            transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
            outline: none;
            margin-top: 12px;
            min-width: 180px;
            min-height: 40px;
          }
          
          .financial-apply-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #f3f2f1;
          }
          
          .financial-apply-btn:hover:not(:disabled),
          .financial-apply-btn:focus-visible:not(:disabled) {
            box-shadow: 0 4px 16px rgba(16, 185, 129, 0.33);
            background: #f8fafd;
            border-color: #F59E0B;
          }
        `}</style>
        
        <div className="insights-header">
          <ShieldTaskRegular style={{ fontSize: 16, marginRight: 8, verticalAlign: 'middle' }} />
          Portfolio Risk Assessment
        </div>
        
        <div className="insights-section" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 16, alignItems: 'stretch', background: '#fff', padding: '20px 16px 12px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <TrendingRegular style={{ fontSize: 28, color: '#10B981', marginBottom: 4 }} />
            <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Expected Return</div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {insights.expectedReturn ? `${insights.expectedReturn}%` : '--'}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <DataTrendingRegular style={{ fontSize: 28, color: '#F59E0B', marginBottom: 4 }} />
            <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Goal Probability</div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {insights.probabilityOfGoal ? `${insights.probabilityOfGoal}%` : '--'}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <CalendarMonthRegular style={{ fontSize: 28, color: '#6B7280', marginBottom: 4 }} />
            <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Risk Level</div>
            <div style={{ fontWeight: 600, fontSize: 18, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {insights.currentRiskLevel ?? '--'}
            </div>
          </div>
        </div>

        <div className="risk-gauge-section" ref={setGaugeContainerRef}>
          <GaugeChart
            width={gaugeDimensions.width}
            height={gaugeDimensions.height}
            segments={getRiskSegments(insights.riskScore ?? 0)}
            chartValue={insights.riskScore ?? 0}
            maxValue={100}
            minValue={0}
            hideMinMax={false}
            variant="multiple-segments"
            enableGradient={false}
            roundCorners={true}
            chartTitle="Portfolio Risk Score"
            sublabel={insights.volatilityForecast ?? 'Risk assessment in progress...'}
            legendProps={{
              canSelectMultipleLegends: false,
            }}
          />
        </div>
        
        <div className="insights-header" style={{ marginTop: 0 }}>
          <InfoSparkleFilled style={{ fontSize: 16, marginRight: 8, verticalAlign: 'middle' }} />
          AI Optimization Recommendations
        </div>
        
        <div className="recommendations-section">
          {loadingAnalysis ? <FinancialShimmer /> : (
            <>
              {recommendation ? (
                <div style={{ marginBottom: '16px' }}>{recommendation}</div>
              ) : (
                <span style={{ color: '#888' }}>No recommendations available yet.</span>
              )}
              
              {insights.immediateActions && insights.immediateActions.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldTaskRegular style={{ fontSize: '16px', color: '#DC2626' }} />
                    Immediate Actions:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#6B7280' }}>
                    {insights.immediateActions.slice(0, 3).map((action, index) => (
                      <li key={index} style={{ marginBottom: '4px', fontSize: '13px' }}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}

              {insights.hedgingStrategies && insights.hedgingStrategies.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheckmarkRegular style={{ fontSize: '16px', color: '#059669' }} />
                    Hedging Strategies:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#6B7280' }}>
                    {insights.hedgingStrategies.slice(0, 3).map((strategy, index) => (
                      <li key={index} style={{ marginBottom: '4px', fontSize: '13px' }}>{strategy}</li>
                    ))}
                  </ul>
                </div>
              )}

              {insights.behavioralManagement && insights.behavioralManagement.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <PersonSupportRegular style={{ fontSize: '16px', color: '#7C3AED' }} />
                    Behavioral Management:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#6B7280' }}>
                    {insights.behavioralManagement.slice(0, 3).map((guidance, index) => (
                      <li key={index} style={{ marginBottom: '4px', fontSize: '13px' }}>{guidance}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          
          <CardFooter>
            <button
              onClick={handleApplyOptimization}
              disabled={loadingAnalysis || !recommendation || applied || isOptimizing}
              className="financial-apply-btn"
              type="button"
            >
              <span style={{ fontSize: 20, marginRight: 8, verticalAlign: 'middle', color: '#10B981', display: 'inline-flex', alignItems: 'center' }}>
                {isOptimizing ? '⏳' : '⚡'}
              </span>
              <span style={{ fontWeight: 600 }}>
                {isOptimizing ? 'Optimizing Portfolio...' : 
                 applied ? 'Optimization Applied ✓' : 
                 'Apply Optimization'}
              </span>
            </button>
          </CardFooter>
          
          <div className="ai-disclaimer">AI-generated content may be incorrect.</div>
        </div>
      </Card>
    </FluentProvider>
  );
};
