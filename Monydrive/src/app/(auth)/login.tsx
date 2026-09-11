import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Field } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useThemeColors } from '@/theme';

export default function Login() {
  const colors = useThemeColors();
  const { signIn } = useAuth();
  const { show } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>(
    {},
  );

  const submit = async () => {
    const e: any = {};
    if (!email) e.email = 'Email is required';
    if (!password) e.password = 'Password is required';
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      show('Welcome back!');
    } catch (err: any) {
      show(err.message, 'error');
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.ink950 }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logo}>
            <Ionicons name="wallet" size={34} color={colors.white} />
            <Text style={[styles.brand, { color: colors.white }]}>Monydrive</Text>
            <Text style={[styles.tagline, { color: colors.slate500 }]}>Stay ahead of your bills &amp; budget</Text>
          </View>

          <View style={[styles.form, { backgroundColor: colors.cardBg, borderColor: colors.cardLine }]}>
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email}
            />
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              error={errors.password}
            />

            <Button title="Sign in" onPress={submit} loading={loading} style={{ marginTop: 6 }} />

            <Pressable style={styles.footer} onPress={() => router.push('/register')}>
              <Text style={[styles.footerText, { color: colors.slate400 }]}>
                Don&apos;t have an account? <Text style={[styles.footerLink, { color: colors.violet400 }]}>Create one</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    alignItems: 'center',
    marginBottom: 36,
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  form: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  footer: { marginTop: 20, alignItems: 'center' },
  footerText: { fontSize: 14 },
  footerLink: { fontWeight: '600' },
});