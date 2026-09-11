import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColors } from '@/theme';
import { toISODate } from '@/utils/dates';

export function ChoiceField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  const colors = useThemeColors();
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label(colors)}>{label}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <Pressable
              key={o.value}
              onPress={() => onChange(o.value)}
              style={[
                styles.choice(colors),
                selected && { borderColor: colors.violet, backgroundColor: 'rgba(139,92,246,0.18)' },
              ]}
            >
              <Text style={{ color: selected ? colors.white : colors.slate400, fontWeight: '600', fontSize: 14 }}>
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}
    >
      <Text style={{ color: colors.slate300, fontSize: 14 }}>{label}</Text>
      <View
        style={[
          styles.toggleTrack,
          value ? { backgroundColor: colors.violet } : { backgroundColor: colors.toggleOff },
        ]}
      >
        <View style={[styles.toggleThumb, value && { transform: [{ translateX: 18 }] }]} />
      </View>
    </Pressable>
  );
}

export function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const colors = useThemeColors();
  const [show, setShow] = useState(false);

  const current = value ? new Date(value + 'T00:00:00') : new Date();

  const onAndroidChange = (e: any, sel?: Date) => {
    setShow(false);
    if (sel) onChange(toISODate(sel));
  };

  const onIOSChange = (e: any, sel?: Date) => {
    if (sel) onChange(toISODate(sel));
  };

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label(colors)}>{label}</Text>
      <Pressable onPress={() => setShow(true)} style={styles.dateWrap(colors)}>
        <Ionicons name="calendar-outline" size={17} color={colors.slate400} />
        <Text style={{ color: colors.slate200, fontSize: 15, marginLeft: 10, flex: 1 }}>{value}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.slate500} />
      </Pressable>
      {show ? (
        <DateTimePicker
          value={current}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={Platform.OS === 'ios' ? onIOSChange : onAndroidChange}
          maximumDate={new Date()}
        />
      ) : null}
    </View>
  );
}

const styles = {
  label: (colors: any) => ({
    color: colors.slate400,
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    marginBottom: 6,
  }),
  choice: (colors: any) => ({
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputLine,
    backgroundColor: colors.inputBg,
  }),
  toggleTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center' as const,
    paddingHorizontal: 3,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  dateWrap: (colors: any) => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputLine,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  }),
};