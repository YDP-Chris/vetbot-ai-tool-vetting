export interface TestCase {
  id: string;
  category: 'accuracy' | 'edge_cases' | 'security' | 'ux';
  scenario: string;
  input: string;
  expectedBehavior: string;
  weight: number;
  tags: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface TestResult {
  testId: string;
  result: 'pass' | 'fail' | 'partial' | 'pending';
  notes: string;
  timestamp: Date;
  executionTime?: number;
}

export interface FailurePattern {
  id: string;
  name: string;
  triggers: string[];
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  remediation: string[];
  detectionThreshold: number;
}

export interface ToolConfig {
  id: string;
  name: string;
  category: string;
  useCase: string;
  industry?: string;
  expectedUsers?: number;
}

export interface EvaluationSession {
  id: string;
  toolConfig: ToolConfig;
  testCases: TestCase[];
  results: TestResult[];
  startTime: Date;
  endTime?: Date;
  score?: number;
  patterns?: FailurePattern[];
}

export interface ScoreBreakdown {
  overall: number;
  accuracy: number;
  edgeCases: number;
  security: number;
  ux: number;
  categories: {
    [key: string]: {
      score: number;
      passed: number;
      total: number;
      weight: number;
    };
  };
}