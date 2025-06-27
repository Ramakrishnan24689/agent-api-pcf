import * as React from 'react';
import { Button, Label, Card, CardHeader, CardFooter, FluentProvider, webLightTheme } from '@fluentui/react-components';
import { CalendarMonthRegular, HistoryRegular, LineHorizontal4Regular, InfoSparkleFilled } from '@fluentui/react-icons';
import { getPatientCareRecommendation } from "./CopilotService";
import { IInputs } from './generated/ManifestTypes';

export interface IPatientCareAssistantProps {
  patientId: string;
  symptoms: string;
  treatmentPlan: string;
  getPatientCareRecommendation: typeof getPatientCareRecommendation;
  context: ComponentFramework.Context<IInputs>,
  setTreatmentPlan: (plan: string) => void;
}

const CopilotFlair: React.FC = () => (
  <span className="copilot-flair">
    <span className="sparkle sparkle1" />
    <span className="sparkle sparkle2" />
    <span className="sparkle sparkle3" />
    <span style={{ marginLeft: 8, fontWeight: 500, color: '#7f56d9' }}>Copilot is thinking...</span>
    <style>{`
      .copilot-flair {
        display: inline-flex;
        align-items: center;
        position: relative;
      }
      .sparkle {
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #7f56d9 0%, #00cfff 100%);
        border-radius: 50%;
        margin-right: 2px;
        animation: sparkle 1.2s infinite alternate;
        opacity: 0.85;
        box-shadow: 0 0 6px #7f56d9aa;
      }
      .sparkle1 { animation-delay: 0s; }
      .sparkle2 { animation-delay: 0.4s; }
      .sparkle3 { animation-delay: 0.8s; }
      @keyframes sparkle {
        0% { transform: scale(1); opacity: 0.85; }
        50% { transform: scale(1.7); opacity: 1; }
        100% { transform: scale(1); opacity: 0.85; }
      }
    `}</style>
  </span>
);

const CopilotShimmer: React.FC = () => (
  <div style={{ minHeight: 60, display: 'flex', alignItems: 'center' }}>
    <div className="copilot-shimmer" style={{ width: '100%', height: 32, borderRadius: 4, background: 'linear-gradient(90deg, #f3f2f1 25%, #e0e0e0 50%, #f3f2f1 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite linear' }} />
    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  </div>
);

export const PatientCareAssistantComponent: React.FC<IPatientCareAssistantProps> = ({
  patientId,
  symptoms,
  treatmentPlan,
  getPatientCareRecommendation,
  context,
  setTreatmentPlan
}) => {
  // Define a type for the Copilot result
  interface CopilotResult {
    completionTokens?: number;
    dataUsed?: string;
    finishReason?: string;
    imagesCount?: number;
    modelName?: string;
    modelType?: string;
    promptTokens?: number;
    structuredOutput?: {
      patientInsights?: {
        averageSeverity?: string;
        lastTreatmentDate?: string;
        recentSymptoms?: number;
      };
      recommendation?: string;
    };
    text?: string;
    thoughtSteps?: string;
    totalTokens?: number;
    [key: string]: unknown;
  }

  // Define a type for the parsed text data structure
  interface ParsedTextData {
    patientInsights?: {
      recentSymptoms?: number;
      averageSeverity?: string;
      lastTreatmentDate?: string;
    };
    recommendation?: string;
    [key: string]: unknown;
  }

  const [recommendation, setRecommendation] = React.useState<string>("");
  const [loadingRecommendation, setLoadingRecommendation] = React.useState<boolean>(true);
  const [insights, setInsights] = React.useState<{
    recentSymptoms?: number;
    averageSeverity?: string | number;
    lastTreatmentDate?: string;
    [key: string]: unknown;
  }>({});
  const [applied, setApplied] = React.useState<boolean>(false);

  // Fetch recommendation and insights on mount
  React.useEffect(() => {
    let isMounted = true;
    
    const fetchRecommendation = async () => {
      try {
        setLoadingRecommendation(true);
        const result = await getPatientCareRecommendation(context, patientId, symptoms);
        
        // Try to parse result as CopilotResult if possible
        let parsed: CopilotResult = {};
        
        if (typeof result === 'string') {
          try {
            parsed = JSON.parse(result) as CopilotResult;
          } catch {
            parsed = { text: result };
          }
        } else if (typeof result === 'object' && result !== null) {
          parsed = result as CopilotResult;
        }
        
        // Extract recommendation from structuredOutput or text fallback
        let recommendation = "";
        let patientInsights = {
          recentSymptoms: undefined as number | undefined,
          averageSeverity: undefined as string | number | undefined,
          lastTreatmentDate: undefined as string | undefined,
        };

        if (parsed.structuredOutput) {
          // Use structured output (preferred)
          recommendation = parsed.structuredOutput.recommendation ?? "";
          if (parsed.structuredOutput.patientInsights) {
            patientInsights = {
              recentSymptoms: parsed.structuredOutput.patientInsights.recentSymptoms,
              averageSeverity: parsed.structuredOutput.patientInsights.averageSeverity,
              lastTreatmentDate: parsed.structuredOutput.patientInsights.lastTreatmentDate,
            };
          }
        } else if (parsed.text) {
          try {
            const textData = JSON.parse(parsed.text) as ParsedTextData;
            recommendation = textData.recommendation ?? "";
            if (textData.patientInsights) {
              patientInsights = {
                recentSymptoms: textData.patientInsights.recentSymptoms,
                averageSeverity: textData.patientInsights.averageSeverity,
                lastTreatmentDate: textData.patientInsights.lastTreatmentDate,
              };
            }
          } catch {
            // Fallback to text as recommendation
            recommendation = parsed.text;
          }
        }
        
        if (isMounted) {
          setRecommendation(recommendation);
          setInsights({
            recentSymptoms: patientInsights.recentSymptoms,
            averageSeverity: patientInsights.averageSeverity,
            lastTreatmentDate: patientInsights.lastTreatmentDate,
            ...parsed
          });
        }
      } catch (error) {
        console.error('Error fetching recommendation:', error);
        if (isMounted) {
          setRecommendation('Failed to load recommendation. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoadingRecommendation(false);
        }
      }
    };

    fetchRecommendation().catch(error => {
      console.error('Unhandled error in fetchRecommendation:', error);
    });

    return () => { isMounted = false; };
  }, [context, patientId, symptoms, getPatientCareRecommendation]);

  // Apply recommendation to Treatment Plan field
  const handleApplyRecommendation = () => {
    setTreatmentPlan(recommendation);
    setApplied(true);
  };

  React.useEffect(() => {
    setApplied(false); // Reset applied state when recommendation changes
  }, [recommendation]);

  return (
    <Card style={{ width: 500, minHeight: 400, margin: '0 auto', background: '#f8fafd', border: 'none', boxShadow: '0 2px 12px #e0e7ef', position: 'relative' }} className={!loadingRecommendation && recommendation ? 'copilot-card-success-flair' : ''}>
      {loadingRecommendation && (
        <div className="copilot-progress-bar">
          <div className="copilot-progress-fill"></div>
        </div>
      )}
      <style>{`
        .copilot-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(127, 86, 217, 0.1);
          border-radius: 0 0 8px 8px;
          overflow: hidden;
        }
        
        .copilot-progress-fill {
          height: 100%;
          width: 40%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(127, 86, 217, 0.3) 20%, 
            #7f56d9 50%, 
            #00cfff  60%, 
            rgba(0, 207, 255, 0.3) 80%, 
            transparent 100%
          );
          border-radius: 0 0 8px 8px;
          animation: copilot-progress-sweep 1.5s infinite linear;
          box-shadow: 0 0 12px rgba(127, 86, 217, 0.3);
        }
        
        .copilot-card-success-flair {
          border: 2px solid transparent;
          background: linear-gradient(#f8fafd, #f8fafd) padding-box, 
                      linear-gradient(90deg, #7f56d9 0%, #00cfff 50%, #7f56d9 100%) border-box;
          border-radius: 12px;
          animation: copilot-success-glow 3s ease-in-out infinite;
        }
        
        .copilot-card-success-flair::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(90deg, #7f56d9, #00cfff, #7f56d9);
          border-radius: 15px;
          z-index: -1;
          animation: copilot-border-rotate 4s linear infinite;
          opacity: 0.4;
          filter: blur(2px);
        }
        
        @keyframes copilot-progress-sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(250%);
          }
        }
        
        @keyframes copilot-success-glow {
          0% { 
            box-shadow: 0 4px 16px rgba(127, 86, 217, 0.15);
          }
          50% { 
            box-shadow: 0 6px 24px rgba(0, 207, 255, 0.25), 
                        0 0 0 1px rgba(127, 86, 217, 0.1);
          }
          100% { 
            box-shadow: 0 4px 16px rgba(127, 86, 217, 0.15);
          }
        }
        
        @keyframes copilot-border-rotate {
          0% { 
            background: linear-gradient(0deg, #7f56d9, #00cfff, #7f56d9, #00cfff);
          }
          25% { 
            background: linear-gradient(90deg, #00cfff, #7f56d9, #00cfff, #7f56d9);
          }
          50% { 
            background: linear-gradient(180deg, #7f56d9, #00cfff, #7f56d9, #00cfff);
          }
          75% { 
            background: linear-gradient(270deg, #00cfff, #7f56d9, #00cfff, #7f56d9);
          }
          100% { 
            background: linear-gradient(360deg, #7f56d9, #00cfff, #7f56d9, #00cfff);
          }
        }
        
        .insights-header {
          background: linear-gradient(90deg, #7f56d9 0%, #00cfff 100%);
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
        .copilot-apply-btn {
          display: inline-flex;
          align-items: center;
          border: 2px solid transparent;
          background: linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #7f56d9 0%, #00cfff 100%) border-box;
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
        .copilot-apply-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f3f2f1;
        }
        .copilot-apply-btn:hover:not(:disabled),
        .copilot-apply-btn:focus-visible:not(:disabled) {
          box-shadow: 0 4px 16px #7f56d933;
          background: #f8fafd;
          border-color: #00cfff;
        }
      `}</style>
      <div className="insights-header">Patient Insights</div>
      <div className="insights-section" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 16, alignItems: 'stretch', background: '#fff', borderRadius: '0 0 0 0', borderBottom: '1px solid #e0e0e0', padding: '20px 16px 12px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <HistoryRegular style={{ fontSize: 28, color: '#7f56d9', marginBottom: 4 }} />
          <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Recent Symptoms</div>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{insights.recentSymptoms ?? '--'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <LineHorizontal4Regular style={{ fontSize: 28, color: '#00cfff', marginBottom: 4 }} />
          <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Avg. Severity</div>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{insights.averageSeverity ?? '--'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <CalendarMonthRegular style={{ fontSize: 28, color: '#ffb300', marginBottom: 4 }} />
          <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>Last Treatment</div>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{insights.lastTreatmentDate ?? '--'}</div>        </div>
      </div>
      <div className="insights-header" style={{ marginTop: 8 }}>
        <InfoSparkleFilled style={{ fontSize: 16, marginRight: 8, verticalAlign: 'middle' }} />
        Recommendations
      </div>
      <div className="recommendations-section">
        {loadingRecommendation ? <CopilotShimmer /> : (
          recommendation
            ? <div>{recommendation}</div>
            : <span style={{ color: '#888' }}>No recommendation yet.</span>
        )}
        <CardFooter>
          <button
            onClick={handleApplyRecommendation}
            disabled={loadingRecommendation || !recommendation || applied}
            className="copilot-apply-btn"
            type="button"
          >
            <span style={{ fontSize: 20, marginRight: 8, verticalAlign: 'middle', color: '#7f56d9', display: 'inline-flex', alignItems: 'center' }}>✨</span>
            <span style={{ fontWeight: 600 }}>{applied ? 'Recommendation Applied' : 'Apply Recommendation'}</span>
          </button>
        </CardFooter>
        <div className="ai-disclaimer">AI-generated content may be incorrect.</div>
      </div>
    </Card>
  );
};
