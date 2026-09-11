import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColors } from '@/theme';
import { monthInputValue } from '@/utils/dates';

export default function MonthPicker({
  value,
  onChange,
}: {
  value: string; // YYYY-MM
  onChange: (v: string) => void;
}) {
  const colors = useThemeColors();
  const [year, month] = value.split('-').map(Number);

  const shift = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m > 12) {
      m = 1;
      y += 1;
    } else if (m < 1) {
      m = 12;
      y -= 1;
    }
    onChange(`${y}-${String(m).padStart(2, '0')}`);
  };

  const label = `${new Date(year, month - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })}`;

  return (
    <View style={[styles.row, { backgroundColor: colors.cardBg, borderColor: colors.cardLine }]}>
      <Pressable onPress={() => shift(-1)} style={[styles.arrow, { backgroundColor: colors.pressBg }]}>
        <Ionicons name="chevron-back" size={18} color={colors.slate300} />
      </Pressable>
      <Text style={[styles.label, { color: colors.white }]}>{label}</Text>
      <Pressable onPress={() => shift(1)} style={[styles.arrow, { backgroundColor: colors.pressBg }]}>
        <Ionicons name="chevron-forward" size={18} color={colors.slate300} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export function isCurrentMonth(v: string): boolean {
  return v === monthInputValue();
}