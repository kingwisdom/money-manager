import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import Screen from '@/components/Screen';
import { Button, Card, ScreenHeader } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useThemeColors } from '@/theme';

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  last?: boolean;
}

function MenuItem({ icon, label, onPress, last }: MenuItemProps) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.divider,
      }}
    >
      <Ionicons name={icon as any} size={19} color={colors.slate400} />
      <Text style={{ flex: 1, color: colors.slate200, fontSize: 15, marginLeft: 14 }}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.slate500} />
    </Pressable>
  );
}

export default function More() {
  const colors = useThemeColors();
  const { signOut } = useAuth();

  return (
    <Screen>
      <ScreenHeader title="More" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}>
        <Card style={{ marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { color: colors.slate500 }]}>Manage</Text>
          <MenuItem icon="pie-chart-outline" label="Budgets" onPress={() => router.push('/more/budgets')} />
          <MenuItem icon="folder-outline" label="Categories" onPress={() => router.push('/more/categories')} />
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => router.push('/more/notifications')} last />
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { color: colors.slate500 }]}>Account</Text>
          <MenuItem icon="person-outline" label="Profile" onPress={() => router.push('/more/profile')} last />
        </Card>

        <Button title="Log out" variant="danger" onPress={signOut} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 },
});
