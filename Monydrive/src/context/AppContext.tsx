import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext<{ currency: string }>({ currency: '$' });

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const currency = user?.currency || '$';
  return <AppContext.Provider value={{ currency }}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

export function useCurrency(): string {
  return useContext(AppContext).currency;
}