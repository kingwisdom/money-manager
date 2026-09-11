import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme';

export default function Screen({
  children,
  style,
  edges = ['top'],
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
}) {
  const colors = useThemeColors();
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: colors.ink950 }, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});