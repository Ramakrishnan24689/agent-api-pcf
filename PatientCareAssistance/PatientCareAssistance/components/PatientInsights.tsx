import * as React from 'react';
import { CalendarMonthRegular, HistoryRegular, LineHorizontal4Regular } from '@fluentui/react-icons';
import { PatientInsights as IPatientInsights } from '../types';

interface PatientInsightsProps {
  insights: IPatientInsights;
  loading: boolean;
}

export const PatientInsights: React.FC<PatientInsightsProps> = ({ insights, loading }) => {
  const insightItems = [
    {
      icon: <HistoryRegular style={{ fontSize: 28, color: '#7f56d9', marginBottom: 4 }} />,
      label: 'Recent Symptoms',
      value: insights.recentSymptoms ?? '--',
      color: '#7f56d9'
    },
    {
      icon: <LineHorizontal4Regular style={{ fontSize: 28, color: '#00cfff', marginBottom: 4 }} />,
      label: 'Avg. Severity',
      value: insights.averageSeverity ?? '--',
      color: '#00cfff'
    },
    {
      icon: <CalendarMonthRegular style={{ fontSize: 28, color: '#ffb300', marginBottom: 4 }} />,
      label: 'Last Treatment',
      value: insights.lastTreatmentDate ?? '--',
      color: '#ffb300'
    }
  ];

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
        borderRadius: '0 0 0 0', 
        borderBottom: '1px solid #e0e0e0', 
        padding: '20px 16px 12px 16px' 
      }}
    >
      {insightItems.map((item, index) => (
        <div 
          key={index}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            flex: 1, 
            minWidth: 0,
            opacity: loading ? 0.6 : 1,
            transition: 'opacity 0.3s ease'
          }}
        >
          {item.icon}
          <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>
            {item.label}
          </div>
          <div 
            style={{ 
              fontWeight: 600, 
              fontSize: 18, 
              color: loading ? '#999' : '#222', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              transition: 'color 0.3s ease'
            }}
          >
            {loading ? '...' : item.value}
          </div>
        </div>
      ))}
    </div>
  );
};
