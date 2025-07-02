import * as React from 'react';
import { UI_STRINGS } from '../config';

export const CopilotFlair: React.FC = () => (
  <span className="copilot-flair">
    <span className="sparkle sparkle1" />
    <span className="sparkle sparkle2" />
    <span className="sparkle sparkle3" />
    <span style={{ marginLeft: 8, fontWeight: 500, color: '#7f56d9' }}>
      {UI_STRINGS.LOADING_MESSAGE}
    </span>
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

export const CopilotShimmer: React.FC = () => (
  <div style={{ minHeight: 60, display: 'flex', alignItems: 'center' }}>
    <div 
      className="copilot-shimmer" 
      style={{ 
        width: '100%', 
        height: 32, 
        borderRadius: 4, 
        background: 'linear-gradient(90deg, #f3f2f1 25%, #e0e0e0 50%, #f3f2f1 75%)', 
        backgroundSize: '200% 100%', 
        animation: 'shimmer 1.2s infinite linear' 
      }} 
    />
    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
  </div>
);
