import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AppProvider } from '@/context/AppContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider as AppThemeProvider, useTheme, useThemeColors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <RootNavigator />
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}

function RootNavigator() {
  const { effectiveScheme } = useTheme();
  const { booting } = useAuth();
  const colors = useThemeColors();
  const isDark = effectiveScheme === 'dark';

  useEffect(() => {
    if (!booting) SplashScreen.hideAsync();
  }, [booting]);

  if (booting) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.ink950, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.violet} />
      </View>
    );
  }

  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    dark: isDark,
    colors: {
      ...base.colors,
      primary: colors.violet,
      background: colors.ink950,
      card: colors.ink900,
      text: colors.slate200,
      border: colors.cardLine,
      notification: colors.rose,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}