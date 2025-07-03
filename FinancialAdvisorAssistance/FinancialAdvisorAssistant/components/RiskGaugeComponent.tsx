import * as React from 'react';
import { GaugeChart, DataVizPalette, getColorFromToken } from '@fluentui/react-charts';

interface RiskGaugeComponentProps {
  riskScore: number;
  volatilityForecast: string;
  width: number;
  height: number;
  onContainerRef: (ref: HTMLDivElement | null) => void;
}

export const RiskGaugeComponent: React.FC<RiskGaugeComponentProps> = ({
  riskScore,
  volatilityForecast,
  width,
  height,
  onContainerRef
}) => {
  // Get risk level description for accessibility
  const getRiskLevelDescription = (score: number): string => {
    if (score <= 30) return 'Low risk level';
    if (score <= 60) return 'Medium risk level';
    return 'High risk level';
  };

  // Get detailed accessibility description
  const getAccessibilityDescription = (): string => {
    const riskLevel = getRiskLevelDescription(riskScore);
    return `Portfolio risk score is ${riskScore} out of 100, indicating ${riskLevel}. ${volatilityForecast || 'Risk assessment in progress'}`;
  };
  // Get risk segments for the gauge chart
  const getRiskSegments = (riskScore: number) => {
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
    <div 
      className="risk-gauge-section" 
      ref={onContainerRef}
      role="img"
      aria-label={`Portfolio Risk Assessment Chart: ${getAccessibilityDescription()}`}
      aria-describedby="risk-gauge-description"
    >
      {/* Hidden description for screen readers */}
      <div 
        id="risk-gauge-description" 
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {getAccessibilityDescription()}
      </div>
      
      <GaugeChart
        width={width}
        height={height}
        segments={getRiskSegments(riskScore)}
        chartValue={riskScore}
        maxValue={100}
        minValue={0}
        hideMinMax={false}
        variant="multiple-segments"
        enableGradient={false}
        roundCorners={true}
        chartTitle="Portfolio Risk Score"
        sublabel={volatilityForecast || 'Risk assessment in progress...'}
        legendProps={{
          canSelectMultipleLegends: false,
        }}
      />
    </div>
  );
};
