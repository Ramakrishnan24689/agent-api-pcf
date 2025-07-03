# Financial Advisor Assistant PCF Control

This is a reference implementation showing how to consume the Agent API in a PowerApps Component Framework (PCF) control.

## Project Structure

```
FinancialAdvisorAssistant/
├── ControlManifest.Input.xml          # PCF manifest defining control properties
├── index.ts                           # Main PCF control entry point
├── FinancialAdvisorAssistantComponent.tsx  # Main React component
├── FinancialCopilotService.ts         # Service for calling the Agent API
├── components/                        # Individual UI components
│   ├── InsightsMetrics.tsx           # Displays key financial metrics
│   ├── OptimizationButton.tsx        # Button for applying recommendations
│   ├── RecommendationsPanel.tsx      # Panel showing AI recommendations
│   └── RiskGaugeComponent.tsx        # Risk assessment gauge chart
├── hooks/                            # Custom React hooks
│   ├── useFinancialAnalysis.ts       # Hook for managing financial data and API calls
│   └── useGaugeDimensions.ts         # Hook for responsive gauge sizing
├── styles/                           # CSS styling
│   └── FinancialCardStyles.ts        # Styled components and CSS
└── generated/                        # Auto-generated TypeScript types
    └── ManifestTypes.d.ts
```

## Key Learning Points

### 1. Agent API Integration
- **File**: `FinancialCopilotService.ts`
- **Purpose**: Shows how to call the Agent API using `context.copilot.executeEvent()`
- **Key Method**: `getFinancialRiskAssessment()`

### 2. PCF Control Structure
- **File**: `index.ts`
- **Purpose**: Main PCF control class implementing `ComponentFramework.ReactControl`
- **Key Methods**: `init()`, `updateView()`, `getOutputs()`, `destroy()`

### 3. Component Architecture
- **Main Component**: `FinancialAdvisorAssistantComponent.tsx`
- **Sub-components**: Split into focused, reusable components
- **Custom Hooks**: Logic separated from UI for better maintainability

### 4. Data Flow
1. User inputs → PCF properties → Main component
2. Main component → Custom hook → Agent API service
3. Agent API response → Hook processes data → UI components render

## Agent API Usage

The control demonstrates how to:
- Call the Agent API with financial data
- Handle structured and unstructured responses
- Process AI recommendations
- Display results in a user-friendly format

## Building and Running

```bash
npm install
npm run build
npm start
```

## Key Features

- **Risk Assessment**: Real-time portfolio risk analysis
- **AI Recommendations**: Actionable optimization suggestions
- **Responsive Design**: Adapts to different screen sizes
- **Error Handling**: Graceful handling of API failures
- **Loading States**: User feedback during API calls

This implementation serves as a template for building PCF controls that integrate with AI agents.
