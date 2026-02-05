import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TestCase, TestResult, ToolConfig, EvaluationSession, ScoreBreakdown, FailurePattern } from '../types';
import testCasesData from '../data/testCases.json';
import failurePatternsData from '../data/failurePatterns.json';

interface VettingStore {
  // Current session state
  currentSession: EvaluationSession | null;
  toolConfig: ToolConfig | null;
  testCases: TestCase[];
  results: TestResult[];

  // Computed values
  scoreBreakdown: ScoreBreakdown | null;
  detectedPatterns: FailurePattern[];

  // Actions
  setToolConfig: (config: ToolConfig) => void;
  generateTestCases: (category: string) => void;
  updateTestResult: (testId: string, result: 'pass' | 'fail' | 'partial', notes?: string) => void;
  calculateScore: () => void;
  detectFailurePatterns: () => void;
  startNewSession: () => void;
  saveSession: () => void;
  loadSession: (sessionId: string) => void;

  // Computed getters
  getProgress: () => number;
  getCompletedTests: () => TestResult[];
  getPendingTests: () => TestCase[];
}

export const useVettingStore = create<VettingStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      toolConfig: null,
      testCases: [],
      results: [],
      scoreBreakdown: null,
      detectedPatterns: [],

      setToolConfig: (config: ToolConfig) => {
        set({ toolConfig: config });
        get().generateTestCases(config.category);
      },

      generateTestCases: (category: string) => {
        const categoryKey = category.toLowerCase().replace(/\s+/g, '');
        const cases = (testCasesData as any)[categoryKey] || [];
        set({ testCases: cases });

        // Initialize results with pending status
        const initialResults = cases.map((testCase: TestCase) => ({
          testId: testCase.id,
          result: 'pending' as const,
          notes: '',
          timestamp: new Date(),
        }));
        set({ results: initialResults });
      },

      updateTestResult: (testId: string, result: 'pass' | 'fail' | 'partial', notes = '') => {
        const { results } = get();
        const updatedResults = results.map(r =>
          r.testId === testId
            ? { ...r, result, notes, timestamp: new Date() }
            : r
        );
        set({ results: updatedResults });

        // Recalculate score and patterns
        get().calculateScore();
        get().detectFailurePatterns();
      },

      calculateScore: () => {
        const { testCases, results } = get();

        if (testCases.length === 0) {
          set({ scoreBreakdown: null });
          return;
        }

        const categories = {
          accuracy: { weight: 0.4, tests: [] as TestCase[], results: [] as TestResult[] },
          edge_cases: { weight: 0.3, tests: [] as TestCase[], results: [] as TestResult[] },
          security: { weight: 0.1, tests: [] as TestCase[], results: [] as TestResult[] },
          ux: { weight: 0.2, tests: [] as TestCase[], results: [] as TestResult[] },
        };

        // Group tests by category
        testCases.forEach(test => {
          if (categories[test.category]) {
            categories[test.category].tests.push(test);
            const result = results.find(r => r.testId === test.id);
            if (result) {
              categories[test.category].results.push(result);
            }
          }
        });

        const categoryScores: any = {};
        let weightedSum = 0;
        let totalWeight = 0;

        Object.entries(categories).forEach(([category, data]) => {
          if (data.tests.length === 0) return;

          let categoryScore = 0;
          let maxCategoryScore = 0;
          let passed = 0;

          data.tests.forEach(test => {
            const result = data.results.find(r => r.testId === test.id);
            if (!result || result.result === 'pending') return;

            const testScore = result.result === 'pass' ? test.weight :
                             result.result === 'partial' ? test.weight * 0.5 : 0;
            categoryScore += testScore;
            maxCategoryScore += test.weight;

            if (result.result === 'pass') passed++;
          });

          const normalizedScore = maxCategoryScore > 0 ? (categoryScore / maxCategoryScore) * 100 : 0;

          categoryScores[category] = {
            score: Math.round(normalizedScore),
            passed,
            total: data.tests.length,
            weight: data.weight,
          };

          weightedSum += normalizedScore * data.weight;
          totalWeight += data.weight;
        });

        const overallScore = totalWeight > 0 ? Math.round(weightedSum) : 0;

        set({
          scoreBreakdown: {
            overall: overallScore,
            accuracy: categoryScores.accuracy?.score || 0,
            edgeCases: categoryScores.edge_cases?.score || 0,
            security: categoryScores.security?.score || 0,
            ux: categoryScores.ux?.score || 0,
            categories: categoryScores,
          }
        });
      },

      detectFailurePatterns: () => {
        const { testCases, results } = get();
        const patterns = failurePatternsData.patterns;
        const detectedPatterns: FailurePattern[] = [];

        patterns.forEach((pattern: any) => {
          let failureCount = 0;

          testCases.forEach(test => {
            const result = results.find(r => r.testId === test.id);
            if (result && result.result === 'fail') {
              const hasMatchingTag = pattern.triggers.some((trigger: string) =>
                test.tags.includes(trigger)
              );
              if (hasMatchingTag) {
                failureCount++;
              }
            }
          });

          if (failureCount >= pattern.detectionThreshold) {
            detectedPatterns.push(pattern);
          }
        });

        set({ detectedPatterns });
      },

      startNewSession: () => {
        const { toolConfig } = get();
        if (!toolConfig) return;

        const newSession: EvaluationSession = {
          id: Date.now().toString(),
          toolConfig,
          testCases: get().testCases,
          results: [],
          startTime: new Date(),
        };

        set({ currentSession: newSession, results: [], scoreBreakdown: null, detectedPatterns: [] });
      },

      saveSession: () => {
        // In a real app, this would save to a backend
        // For now, persistence is handled by zustand middleware
      },

      loadSession: (_sessionId: string) => {
        // In a real app, this would load from a backend
        // For now, we rely on the persisted state
      },

      getProgress: () => {
        const { results } = get();
        const completedTests = results.filter(r => r.result !== 'pending').length;
        return results.length > 0 ? (completedTests / results.length) * 100 : 0;
      },

      getCompletedTests: () => {
        const { results } = get();
        return results.filter(r => r.result !== 'pending');
      },

      getPendingTests: () => {
        const { testCases, results } = get();
        return testCases.filter(test => {
          const result = results.find(r => r.testId === test.id);
          return !result || result.result === 'pending';
        });
      },
    }),
    {
      name: 'vetting-storage',
    }
  )
);