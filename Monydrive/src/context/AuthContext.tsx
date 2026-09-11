import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  api,
  clearAuth,
  extractError,
  getStoredUser,
  persistAuth,
} from '@/api/client';

export interface User {
  id: number;
  name: string;
  email: string;
  currency: string;
  email_verified_at?: string | null;
  initials?: string;
}

interface AuthContextValue {
  user: User | null;
  booting: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    getStoredUser()
      .then((u) => setUser(u))
      .finally(() => setBooting(false));
  }, []);

  const handleAuth = async (data: { token: string; user: User }) => {
    await persistAuth(data.token, data.user);
    setUser(data.user);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      await handleAuth(res.data);
    } catch (e) {
      throw new Error(extractError(e));
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, password_confirmation });
      await handleAuth(res.data);
    } catch (e) {
      throw new Error(extractError(e));
    }
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    await clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, booting, signIn, signUp, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}