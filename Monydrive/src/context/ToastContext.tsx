import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useThemeColors } from '@/theme';

type ToastType = 'success' | 'error' | 'info';

const ToastContext = createContext<{ show: (msg: string, type?: ToastType) => void } | undefined>(
  undefined,
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const colors = useThemeColors();
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const timer = useRef<any>(null);

  const show = useCallback(
    (msg: string, type: ToastType = 'success') => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ msg, type });
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }).start(() =>
          setToast(null),
        );
      }, 2600);
    },
    [opacity],
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            { opacity, backgroundColor: colors.violet },
            toast.type === 'error' && { backgroundColor: colors.rose },
            toast.type === 'info' && { backgroundColor: colors.ink700 },
          ]}
        >
          <Text style={styles.text}>{toast.msg}</Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});