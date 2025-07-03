import * as React from 'react';
import { CardFooter } from '@fluentui/react-components';

interface OptimizationButtonProps {
  onApplyOptimization: () => void;
  isLoading: boolean;
  isOptimizing: boolean;
  applied: boolean;
  hasRecommendation: boolean;
}

export const OptimizationButton: React.FC<OptimizationButtonProps> = ({
  onApplyOptimization,
  isLoading,
  isOptimizing,
  applied,
  hasRecommendation
}) => {
  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isLoading && hasRecommendation && !applied && !isOptimizing) {
        onApplyOptimization();
      }
    }
  };

  // Get accessibility description
  const getAriaDescription = (): string => {
    if (isOptimizing) return 'Portfolio optimization is currently in progress';
    if (applied) return 'Portfolio optimization has been successfully applied';
    if (!hasRecommendation) return 'No recommendations available to apply';
    if (isLoading) return 'Loading financial analysis';
    return 'Apply AI-generated portfolio optimization recommendations';
  };

  const buttonText = isOptimizing ? 'Optimizing Portfolio...' : 
                    applied ? 'Optimization Applied ✓' : 
                    'Apply Optimization';
  return (
    <CardFooter>
      <button
        onClick={onApplyOptimization}
        onKeyDown={handleKeyDown}
        disabled={isLoading || !hasRecommendation || applied || isOptimizing}
        className="financial-apply-btn"
        type="button"
        aria-label={`${buttonText}. ${getAriaDescription()}`}
        aria-describedby="optimization-button-description"
        aria-pressed={applied}
        tabIndex={0}
      >
        {/* Hidden description for screen readers */}
        <span 
          id="optimization-button-description" 
          className="sr-only"
          aria-live="polite"
        >
          {getAriaDescription()}
        </span>
        
        <span 
          style={{ 
            fontSize: 20, 
            marginRight: 8, 
            verticalAlign: 'middle', 
            color: '#10B981', 
            display: 'inline-flex', 
            alignItems: 'center' 
          }}
          aria-hidden="true"
        >
          {isOptimizing ? '⏳' : '⚡'}
        </span>
        <span style={{ fontWeight: 600 }}>
          {buttonText}
        </span>
      </button>
    </CardFooter>
  );
};
