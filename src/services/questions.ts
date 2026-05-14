import {api} from './api';

export type Question = {
  id: string;
  question_text: string;
  options: Record<string, string> | string[];
  correct_answer: string;
  category: string;
  test: string;
  cloud_provider?: string;
  certification?: string;
};

export const questionsService = {
  list: (params?: {category?: string; test?: string; limit?: number}) =>
    api.get<Question[]>('/questions', {params}).then(r => r.data),

  categories: () => api.get<string[]>('/questions/categories').then(r => r.data),

  tests: () => api.get<string[]>('/questions/tests').then(r => r.data),

  byId: (id: string) => api.get<Question>(`/questions/${id}`).then(r => r.data),

  countMeta: () =>
    api
      .get<{total: number; categories: Record<string, number>; tests: Record<string, number>}>('/questions/count-meta')
      .then(r => r.data),
};
