import * as React from 'react';
import { Card, FluentProvider, webLightTheme } from '@fluentui/react-components';
import { 
  InfoSparkleFilled,
  ShieldTaskRegular
} from '@fluentui/react-icons';
import { IInputs } from './generated/ManifestTypes';
import { useFinancialAnalysis } from './hooks/useFinancialAnalysis';
import { useGaugeDimensions } from './hooks/useGaugeDimensions';
import { RiskGaugeComponent } from './components/RiskGaugeComponent';
import { InsightsMetrics } from './components/InsightsMetrics';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { OptimizationButton } from './components/OptimizationButton';
import { financialCardStyles } from './styles/FinancialCardStyles';

export interface IFinancialAdvisorAssistantProps {
  clientId: string;
  marketData: string;
  portfolioComposition: string;
  riskAdjustment: string;
  context: ComponentFramework.Context<IInputs>;
  setRiskAdjustment: (adjustment: string) => void;
}

export const FinancialAdvisorAssistantComponent: React.FC<IFinancialAdvisorAssistantProps> = ({
  clientId,
  marketData,
  portfolioComposition,
  context,
  setRiskAdjustment
}) => {
  const {
    recommendation,
    loadingAnalysis,
    insights,
    applied,
    isOptimizing,
    handleApplyOptimization
  } = useFinancialAnalysis({
    context,
    clientId,
    marketData,
    portfolioComposition,
    setRiskAdjustment
  });

  const { gaugeContainerRef, gaugeDimensions } = useGaugeDimensions();

  return (
    <FluentProvider theme={webLightTheme}>
      <Card 
        style={{ 
          width: 600, 
          minHeight: 500, 
          margin: '0 auto', 
          background: '#f8fafd', 
          border: 'none', 
          boxShadow: '0 2px 12px #e0e7ef', 
          position: 'relative' 
        }} 
        className={!loadingAnalysis && recommendation ? 'financial-card-success-flair' : ''}
        role="main"
        aria-label="Financial Advisor Assistant Dashboard"
        aria-describedby="financial-dashboard-description"
      >
        {/* Hidden description for screen readers */}
        <div 
          id="financial-dashboard-description" 
          className="sr-only"
        >
          Interactive dashboard showing portfolio risk assessment, key metrics, and AI-generated optimization recommendations
        </div>

        {loadingAnalysis && (
          <div 
            className="financial-progress-bar"
            role="progressbar"
            aria-label="Loading financial analysis"
            aria-describedby="loading-description"
          >
            <div className="financial-progress-fill"></div>
            <div id="loading-description" className="sr-only">
              Please wait while we analyze your portfolio data
            </div>
          </div>
        )}
        
        <style>{financialCardStyles}</style>
        
        <header className="insights-header" role="banner">
          <ShieldTaskRegular 
            style={{ fontSize: 16, marginRight: 8, verticalAlign: 'middle' }} 
            aria-hidden="true"
          />
          <span>Portfolio Risk Assessment</span>
        </header>
        
        <InsightsMetrics
          expectedReturn={insights.expectedReturn}
          probabilityOfGoal={insights.probabilityOfGoal}
          currentRiskLevel={insights.currentRiskLevel}
        />

        <RiskGaugeComponent
          riskScore={insights.riskScore ?? 0}
          volatilityForecast={insights.volatilityForecast ?? ''}
          width={gaugeDimensions.width}
          height={gaugeDimensions.height}
          onContainerRef={gaugeContainerRef}
        />
        
        <header className="insights-header" style={{ marginTop: 0 }} role="banner">
          <InfoSparkleFilled 
            style={{ fontSize: 16, marginRight: 8, verticalAlign: 'middle' }} 
            aria-hidden="true"
          />
          <span>AI Optimization Recommendations</span>
        </header>
        
        <RecommendationsPanel
          recommendation={recommendation}
          immediateActions={insights.immediateActions}
          hedgingStrategies={insights.hedgingStrategies}
          behavioralManagement={insights.behavioralManagement}
          isLoading={loadingAnalysis}
        />
        
        <OptimizationButton
          onApplyOptimization={handleApplyOptimization}
          isLoading={loadingAnalysis}
          isOptimizing={isOptimizing}
          applied={applied}
          hasRecommendation={!!recommendation}
        />
        
        {/* AI disclaimer at bottom of card */}
        <div className="ai-disclaimer">
          AI-generated content may be incorrect.
        </div>
      </Card>
    </FluentProvider>
  );
};
