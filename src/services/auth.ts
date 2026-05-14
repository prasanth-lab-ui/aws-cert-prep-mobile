import {api} from './api';

export type User = {
  id: number;
  email: string;
  name: string;
  is_premium?: boolean;
  premium_expiry?: string | null;
};

export type AuthResponse = {
  token: string;
  user: User;
  message?: string;
};

export const authService = {
  register: (payload: {email: string; password: string; name: string}) =>
    api.post<{message: string; email: string}>('/auth/register', payload).then(r => r.data),

  login: (payload: {email: string; password: string}) =>
    api.post<AuthResponse>('/auth/login', payload).then(r => r.data),

  google: (idToken: string) =>
    api.post<AuthResponse>('/auth/google', {idToken}).then(r => r.data),

  verifyEmail: (payload: {email: string; code: string}) =>
    api.post<AuthResponse>('/auth/verify-email', payload).then(r => r.data),

  resendOtp: (email: string) =>
    api.post<{message: string}>('/auth/resend-otp', {email}).then(r => r.data),

  forgotPassword: (email: string) =>
    api.post<{message: string}>('/auth/forgot-password', {email}).then(r => r.data),

  resetPassword: (payload: {email: string; otp: string; newPassword: string}) =>
    api.post<{message: string}>('/auth/reset-password', payload).then(r => r.data),

  me: () => api.get<User>('/auth/me').then(r => r.data),
};
