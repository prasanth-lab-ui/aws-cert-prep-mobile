import {api} from './api';

export type SessionRecord = {
  id: number;
  user_id: number;
  config: any;
  started_at: string;
  completed_at?: string | null;
  score?: number | null;
  total_questions?: number | null;
  correct_count?: number | null;
};

export const sessionsService = {
  create: (config: any) => api.post<SessionRecord>('/sessions', {config}).then(r => r.data),

  update: (id: number, body: {score: number; correctCount: number; totalQuestions: number; answers: any}) =>
    api.put<SessionRecord>(`/sessions/${id}`, body).then(r => r.data),

  mine: () => api.get<SessionRecord[]>('/sessions/user').then(r => r.data),

  byId: (id: number) => api.get<SessionRecord>(`/sessions/${id}`).then(r => r.data),
};
