import * as React from 'react';
import { 
  DataTrendingRegular,
  CalendarMonthRegular
} from '@fluentui/react-icons';

interface InsightsMetricsProps {
  expectedReturn?: number;
  probabilityOfGoal?: number;
  currentRiskLevel?: string;
}

export const InsightsMetrics: React.FC<InsightsMetricsProps> = ({
  expectedReturn,
  probabilityOfGoal,
  currentRiskLevel
}) => {
  return (
    <div 
      className="insights-section" 
      style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        gap: 16, 
        alignItems: 'stretch', 
        background: '#fff', 
        padding: '20px 16px 12px 16px' 
      }}
      role="region"
      aria-label="Portfolio Key Metrics"
    >
      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}
        role="group"
        aria-labelledby="expected-return-label"
      >
        <DataTrendingRegular 
          style={{ fontSize: 28, color: '#10B981', marginBottom: 4 }} 
          aria-hidden="true"
        />
        <div 
          id="expected-return-label"
          style={{ fontSize: 13, color: '#888', marginBottom: 2 }}
        >
          Expected Return
        </div>
        <div 
          style={{ fontWeight: 600, fontSize: 18, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          aria-label={`Expected return: ${expectedReturn ? `${expectedReturn} percent` : 'not available'}`}
        >
          {expectedReturn ? `${expectedReturn}%` : '--'}
        </div>
      </div>
      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}
        role="group"
        aria-labelledby="goal-probability-label"
      >
        <DataTrendingRegular 
          style={{ fontSize: 28, color: '#F59E0B', marginBottom: 4 }} 
          aria-hidden="true"
        />
        <div 
          id="goal-probability-label"
          style={{ fontSize: 13, color: '#888', marginBottom: 2 }}
        >
          Goal Probability
        </div>
        <div 
          style={{ fontWeight: 600, fontSize: 18, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          aria-label={`Goal probability: ${probabilityOfGoal ? `${probabilityOfGoal} percent` : 'not available'}`}
        >
          {probabilityOfGoal ? `${probabilityOfGoal}%` : '--'}
        </div>
      </div>
      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}
        role="group"
        aria-labelledby="risk-level-label"
      >
        <CalendarMonthRegular 
          style={{ fontSize: 28, color: '#6B7280', marginBottom: 4 }} 
          aria-hidden="true"
        />
        <div 
          id="risk-level-label"
          style={{ fontSize: 13, color: '#888', marginBottom: 2 }}
        >
          Risk Level
        </div>
        <div 
          style={{ fontWeight: 600, fontSize: 18, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          aria-label={`Risk level: ${currentRiskLevel ?? 'not available'}`}
        >
          {currentRiskLevel ?? '--'}
        </div>
      </div>
    </div>
  );
};
