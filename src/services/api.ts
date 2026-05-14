import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Config} from '../config';

export const TOKEN_KEY = '@auth_token';

const baseURL = Config.API_BASE_URL || 'http://10.0.2.2:5000/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {'Content-Type': 'application/json'},
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export const extractErrorMessage = (err: any, fallback = 'Something went wrong'): string => {
  return err?.response?.data?.message || err?.message || fallback;
};
