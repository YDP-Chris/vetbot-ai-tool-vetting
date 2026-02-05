# VetBot - AI Tool Vetting Framework

A comprehensive validation framework for AI tools that helps product managers systematically test AI agents before deployment, preventing production failures.

## 🎯 Problem Solved

Product managers struggle to properly validate AI tools before company adoption. Current ad-hoc testing fails when real users break tools within minutes of deployment. VetBot provides structured, systematic validation to catch 80%+ of issues before they reach production.

## ✨ Features

- **Structured Testing Framework**: Category-specific test scenarios for different AI tool types
- **Real-time Scoring**: Quantitative readiness scores (0-100) with category breakdown
- **Failure Pattern Detection**: Automatically identifies common AI failure modes
- **Professional Reports**: Generate assessment reports for stakeholder review
- **Test Persistence**: Save and resume evaluations across sessions

## 🚀 Quick Start

### Option 1: Use the Live Demo
Visit [vetbot-ai-tool-vetting.vercel.app](https://vetbot-ai-tool-vetting.vercel.app) to start vetting your AI tools immediately.

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/YDP-Chris/vetbot-ai-tool-vetting.git
cd vetbot-ai-tool-vetting

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📋 How It Works

1. **Select Tool Category**: Choose from Customer Support Bot, Data Entry Agent, Sales Assistant, or Configuration Agent
2. **Define Use Case**: Specify the specific application and context
3. **Run Tests**: Work through systematically generated test scenarios
4. **Get Results**: Receive quantitative scores and failure pattern analysis
5. **Generate Report**: Export professional assessment for stakeholders

## 🧪 Test Categories

### Accuracy (40% weight)
- Core functionality validation
- Basic information handling
- Expected response accuracy

### Edge Cases (30% weight)
- Ambiguous input handling
- Boundary condition testing
- Unexpected scenario management

### Security (10% weight)
- Data privacy compliance
- Social engineering resistance
- Access control validation

### User Experience (20% weight)
- Response clarity and helpfulness
- Multi-part request handling
- Language and accessibility support

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Icons**: Lucide React
- **Reports**: jsPDF (planned)

## 🏗️ Architecture

```
src/
├── components/
│   ├── ToolSelector.tsx      # Category and use case selection
│   └── TestRunner.tsx        # Main testing interface with scoring
├── hooks/
│   └── useVettingStore.ts    # Zustand store for state management
├── data/
│   ├── testCases.json        # Pre-built test scenarios by category
│   └── failurePatterns.json  # Common AI tool failure modes
├── types/
│   └── index.ts              # TypeScript interfaces
└── App.tsx                   # Main application component
```

## 📊 Scoring Algorithm

- **Overall Score**: Weighted average across all categories
- **Category Scores**: Normalized scores based on test weights
- **Pattern Detection**: Triggers when failure threshold is met
- **Confidence Levels**: Based on test completion percentage

## 🎛️ Customization

### Adding Custom Test Cases

Edit `src/data/testCases.json` to add new test scenarios:

```json
{
  "id": "custom-001",
  "category": "accuracy",
  "scenario": "Your custom test scenario",
  "input": "Test input to try",
  "expectedBehavior": "What the AI should do",
  "weight": 2,
  "tags": ["custom", "specific-use-case"],
  "difficulty": "intermediate"
}
```

### Adding Failure Patterns

Edit `src/data/failurePatterns.json` to define new failure detection:

```json
{
  "id": "custom-pattern",
  "name": "Custom Failure Pattern",
  "triggers": ["tag1", "tag2"],
  "description": "Description of the failure pattern",
  "impact": "high",
  "remediation": ["Step 1", "Step 2"],
  "detectionThreshold": 2
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

### Other Platforms
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🧪 Validation Results Interpretation

### Scores
- **90-100**: Production ready with confidence
- **70-89**: Minor issues, acceptable with monitoring
- **50-69**: Significant concerns, requires remediation
- **Below 50**: Not ready for production deployment

### Critical Patterns
- **Security Policy Violations**: Immediate blocker
- **Poor Escalation Handling**: High risk in customer-facing scenarios
- **Ambiguous Input Handling**: Common cause of user frustration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add test scenarios or failure patterns
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

Built for the product management community struggling with AI tool validation. Inspired by real pain points from Reddit discussions in r/ProductManagement.

---

**Need help validating your AI tools?** Visit the live demo or reach out via [ydp-portfolio.vercel.app](https://ydp-portfolio.vercel.app).