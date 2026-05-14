import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ UPDATE THIS to your backend URL
// Emulator: http://10.0.2.2:5000/api
// Physical device: http://<YOUR_LOCAL_IP>:5000/api
// Production: https://your-domain.com/api
const BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type': 'application/json'},
  timeout: 15000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor — handle 401
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  },
);

export default api;
