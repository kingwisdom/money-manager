import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://jobtumb.site/monidrive/api';

export const TOKEN_KEY = 'monidrive_token';
export const USER_KEY = 'monidrive_user';

// eslint-disable-next-line import/no-named-as-default-member -- axios.create is the intended usage
export const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getStoredUser(): Promise<any | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function persistAuth(token: string, user: any): Promise<void> {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function clearAuth(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export function extractError(err: any): string {
  if (err?.response?.data?.message) return String(err.response.data.message);
  if (err?.response?.data?.errors) {
    const errors = err.response.data.errors;
    const first = Object.keys(errors)[0];
    if (first && errors[first]?.length) return String(errors[first][0]);
  }
  if (err?.message) return String(err.message);
  return 'Something went wrong. Please try again.';
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  budget_limit: number;
  bills_count?: number;
  spent_this_month?: number;
  limit?: number;
  spent?: number;
  remaining?: number;
  percent?: number;
}