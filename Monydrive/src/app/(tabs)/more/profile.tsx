import Ionicons from '@expo/vector-icons/Ionicons';
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

import { api } from '@/api/client';
import { ChoiceField } from '@/components/fields';
import { BottomModal } from '@/components/Modal';
import Screen from '@/components/Screen';
import { Button, Card, Field, ScreenHeader } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ThemePreference, useTheme, useThemeColors } from '@/theme';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY', 'INR', 'KES', 'GHS', 'ZAR', 'RUB'];

const AVATAR_COLORS = ['#8b5cf6', '#6366f1', '#38bdf8', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6'];

function ToneFor(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export default function Profile() {
  const colors = useThemeColors();
  const { preference, setPreference } = useTheme();
  const { user, setUser } = useAuth();
  const { show } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [editing, setEditing] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  const openEdit = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setCurrency(user?.currency || 'USD');
    setEditOpen(true);
  };

  const saveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      show('Name and email are required', 'error');
      return;
    }
    setEditing(true);
    try {
      const res = await api.patch('/profile', { name: name.trim(), email: email.trim(), currency });
      setUser({ ...user!, ...res.data.user, initials: user!.initials });
      setEditOpen(false);
      show('Profile updated');
    } catch (e: any) {
      show(e?.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setEditing(false);
    }
  };

  const savePassword = async () => {
    if (!currentPassword || !newPassword) {
      show('All fields are required', 'error');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      show('Passwords do not match', 'error');
      return;
    }
    setSavingPw(true);
    try {
      await api.put('/auth/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirm,
      });
      setPwOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      show('Password updated');
    } catch (e: any) {
      show(e?.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setSavingPw(false);
    }
  };

  const initials = user?.initials || user?.name?.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <Screen>
      <ScreenHeader title="Profile" subtitle="Your account settings" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <View style={[styles.avatar, { backgroundColor: ToneFor(user?.name || '') }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ color: colors.white, fontSize: 20, fontWeight: '700' }}>{user?.name}</Text>
            <Text style={{ color: colors.slate400, fontSize: 13, marginTop: 2 }}>{user?.email}</Text>
          </View>
        </View>

        <Card style={{ marginBottom: 16 }}>
          <Text style={[styles.cardTitle, { color: colors.slate500 }]}>Account</Text>
          <MenuItem icon="create-outline" label="Edit profile" onPress={openEdit} borderColor={colors.divider} />
          <MenuItem icon="lock-closed-outline" label="Change password" onPress={() => setPwOpen(true)} borderColor={colors.divider} />
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Text style={[styles.cardTitle, { color: colors.slate500 }]}>About</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
            <Ionicons name="wallet-outline" size={18} color={colors.slate400} />
            <Text style={{ color: colors.slate400, fontSize: 14, marginLeft: 12 }}>Currency</Text>
            <Text style={{ flex: 1, textAlign: 'right', color: colors.white, fontWeight: '600' }}>{user?.currency}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
            <Ionicons name="information-circle-outline" size={18} color={colors.slate400} />
            <Text style={{ color: colors.slate400, fontSize: 14, marginLeft: 12 }}>Version</Text>
            <Text style={{ flex: 1, textAlign: 'right', color: colors.white, fontWeight: '600' }}>1.0.0</Text>
          </View>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Text style={[styles.cardTitle, { color: colors.slate500 }]}>Appearance</Text>
          <ChoiceField
            label="Theme"
            value={preference}
            onChange={(v) => setPreference(v as ThemePreference)}
            options={[
              { label: 'System', value: 'system' },
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
            ]}
          />
        </Card>
      </ScrollView>

      <BottomModal visible={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Field label="Name" value={name} onChangeText={setName} placeholder="Your name" />
          <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" />
          <Text style={{ color: colors.slate400, fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>Currency</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {CURRENCIES.map((c) => {
              const selected = c === currency;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCurrency(c)}
                  style={[
                    styles.curChip,
                    { backgroundColor: 'rgba(11,17,32,0.6)', borderColor: 'rgba(255,255,255,0.10)' },
                    selected && { backgroundColor: 'rgba(139,92,246,0.22)', borderColor: colors.violet },
                  ]}
                >
                  <Text style={{ color: selected ? colors.white : colors.slate400, fontWeight: '600' }}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
          <Button title="Save changes" onPress={saveProfile} loading={editing} />
        </KeyboardAvoidingView>
      </BottomModal>

      <BottomModal visible={pwOpen} onClose={() => setPwOpen(false)} title="Change password">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Field label="Current password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry placeholder="••••••••" />
          <Field label="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="••••••••" />
          <Field label="Confirm new password" value={newPasswordConfirm} onChangeText={setNewPasswordConfirm} secureTextEntry placeholder="••••••••" />
          <Button title="Update password" onPress={savePassword} loading={savingPw} />
        </KeyboardAvoidingView>
      </BottomModal>
    </Screen>
  );
}

function MenuItem({ icon, label, onPress, borderColor }: { icon: string; label: string; onPress: () => void; borderColor: string }) {
  const colors = useThemeColors();
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: borderColor }}>
      <Ionicons name={icon as any} size={18} color={colors.slate400} />
      <Text style={{ flex: 1, color: colors.slate200, fontSize: 14, marginLeft: 12 }}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.slate500} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  cardTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
  curChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
});
