import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import ToolSelector from './components/ToolSelector';
import TestRunner from './components/TestRunner';
import { useVettingStore } from './hooks/useVettingStore';
import { ToolConfig } from './types';

function App() {
  const { toolConfig, setToolConfig, startNewSession } = useVettingStore();
  const [showTestRunner, setShowTestRunner] = useState(false);

  useEffect(() => {
    if (toolConfig) {
      setShowTestRunner(true);
    }
  }, [toolConfig]);

  const handleConfigSelected = (config: ToolConfig) => {
    setToolConfig(config);
    startNewSession();
  };

  const handleReset = () => {
    setShowTestRunner(false);
    setToolConfig(null as any);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!showTestRunner ? (
        <ToolSelector onConfigSelected={handleConfigSelected} />
      ) : (
        <>
          {/* Header with reset button */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold text-primary-700">VetBot 🤖</h1>
                <p className="text-sm text-gray-600">Systematic AI validation to prevent production failures</p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Assessment</span>
              </button>
            </div>
          </div>

          <TestRunner />
        </>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Built by <a href="https://ydp-portfolio.vercel.app" className="text-primary-600 hover:text-primary-700 hover:underline transition-colors font-medium">Yadkin Data Partners</a>
            </p>
            <p className="text-sm">
              Stop AI tools from breaking in production with systematic validation
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <a href="https://github.com/YDP-Chris/vetbot-ai-tool-vetting" className="text-gray-500 hover:text-primary-600 transition-colors">GitHub</a>
              <a href="https://vetbot-ai-tool-vetting.vercel.app" className="text-gray-500 hover:text-primary-600 transition-colors">Documentation</a>
              <a href="mailto:contact@ydp.dev" className="text-gray-500 hover:text-primary-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;