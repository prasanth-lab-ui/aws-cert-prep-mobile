import {api} from './api';

export type LeaderboardEntry = {
  rank: number;
  user_id: number;
  name: string;
  total_score: number;
  sessions_count: number;
};

export const leaderboardService = {
  global: () => api.get<LeaderboardEntry[]>('/leaderboard/global').then(r => r.data),

  weekly: () => api.get<LeaderboardEntry[]>('/leaderboard/weekly').then(r => r.data),

  me: () => api.get<LeaderboardEntry>('/leaderboard/me').then(r => r.data),
};
