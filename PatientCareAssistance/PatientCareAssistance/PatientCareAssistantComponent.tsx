import * as React from 'react';
import { Card, CardFooter } from '@fluentui/react-components';
import { InfoSparkleFilled } from '@fluentui/react-icons';
import { getPatientCareRecommendation } from "./CopilotService";
import { IInputs } from './generated/ManifestTypes';
import { PatientInsights } from './components/PatientInsights';
import { CopilotShimmer as LoadingShimmer } from './components/LoadingComponents';
import { usePatientRecommendation } from './hooks/usePatientRecommendation';
import { UI_STRINGS } from './config';

export interface IPatientCareAssistantProps {
  patientId?: string;
  symptoms?: string;
  treatmentPlan: string;
  getPatientCareRecommendation: typeof getPatientCareRecommendation;
  context: ComponentFramework.Context<IInputs>,
  setTreatmentPlan: (plan: string) => void;
}

export const PatientCareAssistantComponent: React.FC<IPatientCareAssistantProps> = ({
  patientId,
  symptoms,
  treatmentPlan,
  getPatientCareRecommendation,
  context,
  setTreatmentPlan
}) => {
  const {
    recommendation,
    loadingRecommendation,
    insights,
    error
  } = usePatientRecommendation(context, patientId, symptoms);

  const [applied, setApplied] = React.useState<boolean>(false);

  // Apply recommendation to Treatment Plan field
  const handleApplyRecommendation = () => {
    setTreatmentPlan(recommendation);
    setApplied(true);
  };

  // Reset applied state when recommendation changes
  React.useEffect(() => {
    setApplied(false);
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
          margin-right: 8px;
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
        .error-message {
          color: #d13438;
          font-size: 0.9em;
          margin-bottom: 12px;
          padding: 8px;
          background: #fef2f2;
          border-radius: 4px;
          border-left: 4px solid #d13438;
        }
      `}</style>
      <div className="insights-header">Patient Insights</div>
      <PatientInsights insights={insights} loading={loadingRecommendation} />
      
      <div className="insights-header" style={{ marginTop: 8 }}>
        <InfoSparkleFilled style={{ fontSize: 16, marginRight: 8, verticalAlign: 'middle' }} />
        Recommendations
      </div>
      
      <div className="recommendations-section">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {loadingRecommendation ? (
          <LoadingShimmer />
        ) : (
          recommendation ? (
            <div>{recommendation}</div>
          ) : (
            <span style={{ color: '#888' }}>{UI_STRINGS.NO_RECOMMENDATION_MESSAGE}</span>
          )
        )}
        
        <CardFooter>
          <button
            onClick={handleApplyRecommendation}
            disabled={loadingRecommendation || !recommendation || applied}
            className="copilot-apply-btn"
            type="button"
            aria-label={applied ? "Recommendation has been applied" : "Apply AI recommendation to treatment plan"}
            aria-describedby="recommendation-text"
          >
            <span style={{ fontSize: 20, marginRight: 8, verticalAlign: 'middle', color: '#7f56d9', display: 'inline-flex', alignItems: 'center' }}>✨</span>
            <span style={{ fontWeight: 600 }}>
              {applied ? UI_STRINGS.APPLIED_BUTTON_TEXT : UI_STRINGS.APPLY_BUTTON_TEXT}
            </span>
          </button>
        </CardFooter>
        
        <div className="ai-disclaimer">{UI_STRINGS.AI_DISCLAIMER}</div>
      </div>
    </Card>
  );
};
