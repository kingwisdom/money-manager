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

export default function Register() {
  const colors = useThemeColors();
  const { signUp } = useAuth();
  const { show } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!name) e.name = 'Name is required';
    if (!email) e.email = 'Email is required';
    if (!password) e.password = 'Password is required';
    if (password !== passwordConfirmation) e.passwordConfirmation = 'Passwords do not match';
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password, passwordConfirmation);
      show('Account created — welcome!');
    } catch (err: any) {
      show(err.message, 'error');
      if (err.message.toLowerCase().includes('password')) setErrors({ password: err.message });
      else if (err.message.toLowerCase().includes('email')) setErrors({ email: err.message });
      else setErrors({ general: err.message });
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
            <Ionicons name="wallet" size={30} color={colors.white} />
            <Text style={[styles.brand, { color: colors.white }]}>Create account</Text>
          </View>

          <View style={[styles.form, { backgroundColor: colors.cardBg, borderColor: colors.cardLine }]}>
            <Field label="Full name" value={name} onChangeText={setName} placeholder="Jane Doe" error={errors.name} />
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@example.com"
              error={errors.email}
            />
            <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" error={errors.password} />
            <Field
              label="Confirm password"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              secureTextEntry
              placeholder="••••••••"
              error={errors.passwordConfirmation}
            />

            <Button title="Create account" onPress={submit} loading={loading} style={{ marginTop: 6 }} />

            <Pressable style={styles.footer} onPress={() => router.back()}>
              <Text style={[styles.footerText, { color: colors.slate400 }]}>
                Already have an account? <Text style={[styles.footerLink, { color: colors.violet400 }]}>Sign in</Text>
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
  logo: { alignItems: 'center', marginBottom: 28 },
  brand: { fontSize: 26, fontWeight: '800', marginTop: 8 },
  form: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  footer: { marginTop: 18, alignItems: 'center' },
  footerText: { fontSize: 14 },
  footerLink: { fontWeight: '600' },
});