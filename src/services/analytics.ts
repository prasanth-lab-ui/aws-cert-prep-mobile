import {api} from './api';

export type PerformanceStats = {
  total_sessions: number;
  avg_score: number;
  best_score: number;
  total_questions_attempted: number;
  total_correct: number;
  accuracy: number;
  recent_trend: Array<{date: string; score: number}>;
  category_performance: Array<{category: string; accuracy: number; attempted: number}>;
};

export const analyticsService = {
  performance: () =>
    api.get<PerformanceStats>('/analytics/performance').then(r => r.data),
};
