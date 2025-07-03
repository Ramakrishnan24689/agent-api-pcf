export const financialCardStyles = `
  /* Screen reader only styles for accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Focus styles for better keyboard navigation */
  .financial-apply-btn:focus-visible {
    outline: 3px solid #4285f4;
    outline-offset: 2px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .insights-header {
      background: #000;
      color: #fff;
      border: 2px solid #fff;
    }
    
    .financial-apply-btn {
      border: 2px solid #000;
      background: #fff;
      color: #000;
    }
    
    .financial-apply-btn:hover:not(:disabled),
    .financial-apply-btn:focus-visible:not(:disabled) {
      background: #000;
      color: #fff;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .financial-progress-fill,
    .financial-card-success-flair,
    .financial-card-success-flair::before {
      animation: none;
    }
  }

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
    padding: 8px 16px;
    text-align: right;
    background: #f8fafd;
    border-radius: 0 0 8px 8px;
    margin: 0;
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
`;
