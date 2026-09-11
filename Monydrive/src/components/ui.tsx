import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { useThemeColors } from '@/theme';

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  const colors = useThemeColors();
  return (
    <View style={[{
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardLine,
      borderRadius: 16,
    }, styles.card, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
});

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
}) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  const bg: ViewStyle =
    variant === 'primary'
      ? { backgroundColor: colors.violet }
      : variant === 'danger'
      ? { backgroundColor: 'rgba(244,63,94,0.12)', borderWidth: 1, borderColor: 'rgba(244,63,94,0.35)' }
      : variant === 'secondary'
      ? { backgroundColor: colors.toggleOff, borderWidth: 1, borderColor: colors.chipLine }
      : { backgroundColor: 'transparent' };

  const textColor =
    variant === 'danger' ? colors.rose400 : variant === 'secondary' ? colors.slate300 : variant === 'ghost' ? colors.slate400 : '#ffffff';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        btnStyle.btn,
        bg,
        pressed && !isDisabled && btnStyle.pressed,
        isDisabled && btnStyle.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.slate300} />
      ) : (
        <Text style={[btnStyle.btnText, { color: textColor }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const btnBase = {
  borderRadius: 12,
  paddingVertical: 13,
  paddingHorizontal: 16,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const btnStyle = StyleSheet.create({
  btn: {
    ...btnBase,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  const colors = useThemeColors();
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{
        color: colors.slate400,
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.slate500}
        style={[{
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor: colors.inputLine,
          borderRadius: 12,
          color: colors.slate200,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 15,
        }, error ? { borderColor: colors.rose } : null]}
        {...props}
      />
      {error ? (
        <Text style={{ color: colors.rose400, fontSize: 12, marginTop: 4 }}>{error}</Text>
      ) : null}
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  const colors = useThemeColors();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 32, paddingHorizontal: 20 }}>
      {icon ? <View style={{ marginBottom: 12 }}>{icon}</View> : null}
      <Text style={{ color: colors.white, fontSize: 16, fontWeight: '600' }}>{title}</Text>
      <Text
        style={{
          color: colors.slate500,
          fontSize: 13,
          textAlign: 'center',
          marginTop: 6,
          lineHeight: 19,
        }}
      >
        {message}
      </Text>
      {action ? <View style={{ marginTop: 16 }}>{action}</View> : null}
    </View>
  );
}

export function ProgressBar({ value, color }: { value: number; color: string }) {
  const colors = useThemeColors();
  const pct = Math.min(Math.max(Number(value) || 0, 0), 100);
  return (
    <View
      style={{
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.chipBg,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: 3,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export function Loading({ message = 'Loading...' }: { message?: string }) {
  const colors = useThemeColors();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
      <ActivityIndicator size="large" color={colors.violet} />
      <Text style={{ color: colors.slate500, marginTop: 12, fontSize: 13 }}>{message}</Text>
    </View>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.white, fontSize: 22, fontWeight: '700' }}>{title}</Text>
        {subtitle ? (
          <Text style={{ color: colors.slate500, fontSize: 13, marginTop: 2 }}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}