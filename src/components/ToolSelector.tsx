import { useState } from 'react';
import { Bot, Database, MessageCircle, Settings } from 'lucide-react';
import { ToolConfig } from '../types';

const toolCategories = [
  {
    id: 'customerSupport',
    name: 'Customer Support Bot',
    description: 'Chatbots handling customer inquiries, complaints, and general support',
    icon: MessageCircle,
    useCases: [
      'General customer support',
      'Technical troubleshooting',
      'Billing inquiries',
      'Product information',
      'Account management'
    ]
  },
  {
    id: 'dataEntry',
    name: 'Data Entry Agent',
    description: 'AI tools for processing, parsing, and entering structured data',
    icon: Database,
    useCases: [
      'Contact information processing',
      'Document digitization',
      'Form data extraction',
      'CRM data entry',
      'Invoice processing'
    ]
  },
  {
    id: 'salesAssistant',
    name: 'Sales Assistant',
    description: 'AI agents supporting sales processes and lead qualification',
    icon: Bot,
    useCases: [
      'Lead qualification',
      'Product recommendations',
      'Price inquiries',
      'Demo scheduling',
      'Follow-up automation'
    ]
  },
  {
    id: 'configuration',
    name: 'Configuration Agent',
    description: 'AI tools for system setup, configuration, and optimization',
    icon: Settings,
    useCases: [
      'System configuration',
      'Parameter optimization',
      'Workflow setup',
      'Integration assistance',
      'Environment setup'
    ]
  }
];

interface ToolSelectorProps {
  onConfigSelected: (config: ToolConfig) => void;
}

export default function ToolSelector({ onConfigSelected }: ToolSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [useCase, setUseCase] = useState<string>('');
  const [toolName, setToolName] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory || !useCase || !toolName) return;

    const selectedCat = toolCategories.find(cat => cat.id === selectedCategory);
    if (!selectedCat) return;

    const config: ToolConfig = {
      id: Date.now().toString(),
      name: toolName.trim(),
      category: selectedCategory,
      useCase: useCase,
    };

    onConfigSelected(config);
  };

  const selectedCategoryData = toolCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Tool Vetting Framework
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Systematic validation to stop AI deployments from breaking in production.
          Get comprehensive testing in under 2 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tool Category Selection */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Select your AI tool category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toolCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setUseCase(''); // Reset use case when category changes
                  }}
                  className={`p-6 rounded-lg border-2 text-left transition-all ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <Icon className={`w-6 h-6 mt-1 ${
                      selectedCategory === category.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Use Case Selection */}
        {selectedCategoryData && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Specify the use case
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedCategoryData.useCases.map((useCaseOption) => (
                <button
                  key={useCaseOption}
                  type="button"
                  onClick={() => setUseCase(useCaseOption)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    useCase === useCaseOption
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {useCaseOption}
                </button>
              ))}
            </div>

            {/* Custom use case input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or describe your custom use case:
              </label>
              <input
                type="text"
                value={useCase.startsWith('Custom: ') ? useCase.slice(8) : ''}
                onChange={(e) => setUseCase(e.target.value ? `Custom: ${e.target.value}` : '')}
                placeholder="e.g., Medical appointment scheduling with insurance verification"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Tool Name */}
        {useCase && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Name your tool
            </h2>
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="e.g., ZenDesk AI Assistant, Custom Support Bot"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}

        {/* Submit Button */}
        {toolName && useCase && selectedCategory && (
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Generate Testing Framework
            </button>
          </div>
        )}
      </form>
    </div>
  );
}