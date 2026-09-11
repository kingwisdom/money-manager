import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export const isDarkScheme = (scheme: string | null | undefined) => scheme === 'dark';

type Palette = typeof dark;

const dark = {
  ink950: '#070b14',
  ink900: '#0b1120',
  ink850: '#0e1526',
  ink800: '#131c31',
  ink700: '#1c2742',
  ink600: '#2a3a5f',
  violet: '#8b5cf6',
  indigo: '#6366f1',
  violet400: '#a78bfa',
  emerald: '#34d399',
  rose: '#f43f5e',
  rose400: '#fb7185',
  amber: '#f59e0b',
  amber400: '#fbbf24',
  sky: '#38bdf8',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  white: '#ffffff',
  transparent: 'transparent',
  inputBg: 'rgba(11,17,32,0.7)',
  inputLine: 'rgba(255,255,255,0.10)',
  cardBg: 'rgba(19,28,49,0.8)',
  cardLine: 'rgba(255,255,255,0.06)',
  chipBg: 'rgba(255,255,255,0.04)',
  chipLine: 'rgba(255,255,255,0.08)',
  pressBg: 'rgba(255,255,255,0.05)',
  divider: 'rgba(255,255,255,0.05)',
  toggleOff: 'rgba(28,39,66,0.6)',
};

const light: Palette = {
  ink950: '#f4f6fa',
  ink900: '#ffffff',
  ink850: '#ffffff',
  ink800: '#ffffff',
  ink700: '#eef1f6',
  ink600: '#dbe1ea',
  violet: '#7c3aed',
  indigo: '#4f46e5',
  violet400: '#7c3aed',
  emerald: '#059669',
  rose: '#e11d48',
  rose400: '#e11d48',
  amber: '#d97706',
  amber400: '#b45309',
  sky: '#0284c7',
  slate200: '#0f172a',
  slate300: '#1e293b',
  slate400: '#475569',
  slate500: '#64748b',
  white: '#0f172a',
  transparent: 'transparent',
  inputBg: 'rgba(15,23,42,0.04)',
  inputLine: 'rgba(15,23,42,0.14)',
  cardBg: '#ffffff',
  cardLine: 'rgba(15,23,42,0.08)',
  chipBg: 'rgba(15,23,42,0.05)',
  chipLine: 'rgba(15,23,42,0.08)',
  pressBg: 'rgba(15,23,42,0.05)',
  divider: 'rgba(15,23,42,0.06)',
  toggleOff: 'rgba(15,23,42,0.18)',
};

export type ThemePreference = 'system' | 'light' | 'dark';

const THEME_KEY = 'monydrive_theme';

interface ThemeContextValue {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  effectiveScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((v) => {
        if (v === 'light' || v === 'dark' || v === 'system') setPreference(v);
      })
      .catch(() => {});
  }, []);

  const update = (p: ThemePreference) => {
    setPreference(p);
    AsyncStorage.setItem(THEME_KEY, p).catch(() => {});
  };

  const effectiveScheme: 'light' | 'dark' =
    preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  return (
    <ThemeContext.Provider value={{ preference, setPreference: update, effectiveScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function useThemeColors(): Palette {
  const { effectiveScheme } = useTheme();
  return isDarkScheme(effectiveScheme) ? dark : light;
}

export const colorsDark = dark;