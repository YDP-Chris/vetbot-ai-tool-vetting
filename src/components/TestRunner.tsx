import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, ArrowRight, FileText } from 'lucide-react';
import { useVettingStore } from '../hooks/useVettingStore';

export default function TestRunner() {
  const {
    testCases,
    results,
    toolConfig,
    updateTestResult,
    getProgress,
    scoreBreakdown,
    detectedPatterns
  } = useVettingStore();

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testNotes, setTestNotes] = useState('');

  const currentTest = testCases[currentTestIndex];

  const handleTestResult = (result: 'pass' | 'fail' | 'partial') => {
    if (!currentTest) return;

    updateTestResult(currentTest.id, result, testNotes);
    setTestNotes('');

    // Auto-advance to next test
    if (currentTestIndex < testCases.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      accuracy: 'bg-primary-100 text-primary-800',
      edge_cases: 'bg-secondary-100 text-secondary-700',
      security: 'bg-red-100 text-red-800',
      ux: 'bg-green-100 text-green-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (showResults || currentTestIndex >= testCases.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Validation Complete
          </h1>
          <p className="text-gray-600">
            Assessment for {toolConfig?.name}
          </p>
        </div>

        {/* Overall Score */}
        {scoreBreakdown && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold ${getScoreColor(scoreBreakdown.overall)} mb-2`}>
                {scoreBreakdown.overall}
              </div>
              <div className="text-gray-600">Overall Readiness Score</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(scoreBreakdown.accuracy)}`}>
                  {scoreBreakdown.accuracy}
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(scoreBreakdown.edgeCases)}`}>
                  {scoreBreakdown.edgeCases}
                </div>
                <div className="text-sm text-gray-600">Edge Cases</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(scoreBreakdown.security)}`}>
                  {scoreBreakdown.security}
                </div>
                <div className="text-sm text-gray-600">Security</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(scoreBreakdown.ux)}`}>
                  {scoreBreakdown.ux}
                </div>
                <div className="text-sm text-gray-600">User Experience</div>
              </div>
            </div>
          </div>
        )}

        {/* Detected Patterns */}
        {detectedPatterns.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              Critical Issues Detected
            </h2>
            {detectedPatterns.map((pattern) => (
              <div key={pattern.id} className="border-l-4 border-red-400 bg-red-50 p-4 mb-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800 mb-1">
                      {pattern.name}
                    </h3>
                    <p className="text-red-700 text-sm mb-3">
                      {pattern.description}
                    </p>
                    <div>
                      <h4 className="font-medium text-red-800 text-sm mb-1">
                        Remediation Steps:
                      </h4>
                      <ul className="text-red-700 text-sm space-y-1">
                        {pattern.remediation.map((step, index) => (
                          <li key={index}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Test Results Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Test Results Summary
          </h2>
          <div className="space-y-3">
            {testCases.map((test) => {
              const result = results.find(r => r.testId === test.id);
              return (
                <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {getResultIcon(result?.result || 'pending')}
                      <span className="font-medium">{test.scenario}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(test.category)}`}>
                        {test.category.replace('_', ' ')}
                      </span>
                    </div>
                    {result?.notes && (
                      <p className="text-sm text-gray-600 mt-1 ml-8">{result.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center space-x-4">
          <button
            onClick={() => {
              setShowResults(false);
              setCurrentTestIndex(0);
            }}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Review Tests
          </button>
          <button
            onClick={() => {
              // In a real app, this would generate and download a PDF report
              alert('PDF report generation would be implemented here');
            }}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentTest) {
    return <div>No tests available</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Testing: {toolConfig?.name}
          </h1>
          <div className="text-sm text-gray-500">
            Test {currentTestIndex + 1} of {testCases.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {Math.round(getProgress())}% Complete
        </div>
      </div>

      {/* Current Test */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(currentTest.category)}`}>
              {currentTest.category.replace('_', ' ')}
            </span>
            <span className="text-sm text-gray-500">
              Weight: {currentTest.weight} | {currentTest.difficulty}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {currentTest.scenario}
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Test Input:</h3>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
              {currentTest.input}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Expected Behavior:</h3>
            <div className="bg-green-50 p-4 rounded-lg text-sm text-green-800">
              {currentTest.expectedBehavior}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Test Notes (Optional):</h3>
            <textarea
              value={testNotes}
              onChange={(e) => setTestNotes(e.target.value)}
              placeholder="Add any observations about the AI's response..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Result Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => handleTestResult('pass')}
          className="flex items-center justify-center space-x-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-colors"
        >
          <CheckCircle className="w-6 h-6 text-green-600" />
          <span className="font-semibold text-green-800">Pass</span>
        </button>

        <button
          onClick={() => handleTestResult('partial')}
          className="flex items-center justify-center space-x-3 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 hover:border-yellow-300 transition-colors"
        >
          <AlertCircle className="w-6 h-6 text-yellow-600" />
          <span className="font-semibold text-yellow-800">Partial</span>
        </button>

        <button
          onClick={() => handleTestResult('fail')}
          className="flex items-center justify-center space-x-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors"
        >
          <XCircle className="w-6 h-6 text-red-600" />
          <span className="font-semibold text-red-800">Fail</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentTestIndex(Math.max(0, currentTestIndex - 1))}
          disabled={currentTestIndex === 0}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          onClick={() => setShowResults(true)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          View Results
        </button>

        <button
          onClick={() => setCurrentTestIndex(Math.min(testCases.length - 1, currentTestIndex + 1))}
          disabled={currentTestIndex === testCases.length - 1}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}