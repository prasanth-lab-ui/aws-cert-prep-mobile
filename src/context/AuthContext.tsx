import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authService, User} from '../services/auth';
import {TOKEN_KEY, setUnauthorizedHandler} from '../services/api';
import {getGoogleIdToken, signOutGoogle} from '../services/google';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{email: string}>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback(async (token: string, nextUser: User) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await signOutGoogle();
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
    });
    const bootstrap = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (!token) return;
        const me = await authService.me();
        setUser(me);
      } catch {
        await AsyncStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login: AuthContextValue['login'] = async (email, password) => {
    const res = await authService.login({email, password});
    await persistSession(res.token, res.user);
  };

  const register: AuthContextValue['register'] = async (name, email, password) => {
    const res = await authService.register({name, email, password});
    return {email: res.email};
  };

  const verifyEmail: AuthContextValue['verifyEmail'] = async (email, code) => {
    const res = await authService.verifyEmail({email, code});
    if (res.token && res.user) {
      await persistSession(res.token, res.user);
    }
  };

  const resendOtp: AuthContextValue['resendOtp'] = async email => {
    await authService.resendOtp(email);
  };

  const forgotPassword: AuthContextValue['forgotPassword'] = async email => {
    await authService.forgotPassword(email);
  };

  const resetPassword: AuthContextValue['resetPassword'] = async (email, otp, newPassword) => {
    await authService.resetPassword({email, otp, newPassword});
  };

  const googleSignIn: AuthContextValue['googleSignIn'] = async () => {
    const idToken = await getGoogleIdToken();
    const res = await authService.google(idToken);
    await persistSession(res.token, res.user);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      register,
      verifyEmail,
      resendOtp,
      forgotPassword,
      resetPassword,
      googleSignIn,
      logout,
    }),
    [user, loading, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
