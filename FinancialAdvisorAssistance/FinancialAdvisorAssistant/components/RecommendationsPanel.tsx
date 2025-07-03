import * as React from 'react';
import { 
  ShieldTaskRegular,
  ShieldCheckmarkRegular,
  PersonSupportRegular
} from '@fluentui/react-icons';

interface RecommendationsPanelProps {
  recommendation: string;
  immediateActions?: string[];
  hedgingStrategies?: string[];
  behavioralManagement?: string[];
  isLoading: boolean;
}

const FinancialShimmer: React.FC = () => (
  <div style={{ minHeight: 60, display: 'flex', alignItems: 'center' }}>
    <div className="financial-shimmer" style={{ 
      width: '100%', 
      height: 32, 
      borderRadius: 4, 
      background: 'linear-gradient(90deg, #f3f2f1 25%, #e0e0e0 50%, #f3f2f1 75%)', 
      backgroundSize: '200% 100%', 
      animation: 'shimmer 1.2s infinite linear' 
    }} />
    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  </div>
);

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendation,
  immediateActions,
  hedgingStrategies,
  behavioralManagement,
  isLoading
}) => {
  return (
    <div 
      className="recommendations-section"
      role="region"
      aria-label="AI Portfolio Optimization Recommendations"
      aria-live="polite"
    >
      {isLoading ? (
        <div aria-label="Loading recommendations" role="status">
          <FinancialShimmer />
        </div>
      ) : (
        <>
          {recommendation ? (
            <div 
              style={{ marginBottom: '16px' }}
              aria-label={`Main recommendation: ${recommendation}`}
            >
              {recommendation}
            </div>
          ) : (
            <span 
              style={{ color: '#888' }}
              aria-label="No recommendations currently available"
            >
              No recommendations available yet.
            </span>
          )}
          
          {immediateActions && immediateActions.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ 
                margin: '0 0 8px 0', 
                color: '#374151', 
                fontSize: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px' 
              }}>
                <ShieldTaskRegular style={{ fontSize: '16px', color: '#DC2626' }} />
                Immediate Actions:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#6B7280' }}>
                {immediateActions.slice(0, 3).map((action, index) => (
                  <li key={index} style={{ marginBottom: '4px', fontSize: '13px' }}>{action}</li>
                ))}
              </ul>
            </div>
          )}

          {hedgingStrategies && hedgingStrategies.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ 
                margin: '0 0 8px 0', 
                color: '#374151', 
                fontSize: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px' 
              }}>
                <ShieldCheckmarkRegular style={{ fontSize: '16px', color: '#059669' }} />
                Hedging Strategies:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#6B7280' }}>
                {hedgingStrategies.slice(0, 3).map((strategy, index) => (
                  <li key={index} style={{ marginBottom: '4px', fontSize: '13px' }}>{strategy}</li>
                ))}
              </ul>
            </div>
          )}

          {behavioralManagement && behavioralManagement.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ 
                margin: '0 0 8px 0', 
                color: '#374151', 
                fontSize: '14px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px' 
              }}>
                <PersonSupportRegular style={{ fontSize: '16px', color: '#7C3AED' }} />
                Behavioral Management:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#6B7280' }}>
                {behavioralManagement.slice(0, 3).map((guidance, index) => (
                  <li key={index} style={{ marginBottom: '4px', fontSize: '13px' }}>{guidance}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};
