import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { api } from '@/api/client';
import Screen from '@/components/Screen';
import { Button, Card, EmptyState, Loading, ScreenHeader } from '@/components/ui';
import { useToast } from '@/context/ToastContext';
import { useThemeColors } from '@/theme';

interface AppNotification {
  id: number;
  title: string;
  body: string;
  type: string;
  url: string | null;
  meta: any;
  read_at: string | null;
  created_at: string;
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function Notifications() {
  const colors = useThemeColors();
  const { show } = useToast();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
    } catch {}
    setLoading(false);
    if (refresh) setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load(true);
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      show('All marked as read');
    } catch {}
  };

  const open = async (n: AppNotification) => {
    if (!n.read_at) {
      try {
        await api.post(`/notifications/${n.id}/read`);
        setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)));
      } catch {}
    }
    if (n.url && n.url.startsWith('/bills')) {
      router.push('/bills');
    }
  };

  return (
    <Screen>
      <ScreenHeader
        title="Notifications"
        subtitle="Bill due reminders"
        right={
          notifications.length > 0 ? (
            <Button title="Read all" variant="ghost" onPress={markAllRead} />
          ) : undefined
        }
      />
      {loading && notifications.length === 0 ? (
        <Loading message="Loading notifications..." />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(n) => String(n.id)}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 10, opacity: item.read_at ? 0.75 : 1 }}>
              <Pressable onPress={() => open(item)} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name={item.type === 'bill_due' ? 'receipt-outline' : 'notifications-outline'}
                    size={18}
                    color={item.read_at ? colors.slate500 : colors.violet}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: colors.white, fontWeight: '600', fontSize: 14 }}>{item.title}</Text>
                  <Text style={{ color: colors.slate400, fontSize: 13, marginTop: 3, lineHeight: 18 }}>{item.body}</Text>
                  <Text style={{ color: colors.slate500, fontSize: 11, marginTop: 6 }}>{timeAgo(item.created_at)}</Text>
                </View>
                {!item.read_at ? <View style={[styles.unreadDot, { backgroundColor: colors.violet }]} /> : null}
              </Pressable>
            </Card>
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.violet} />}
          ListEmptyComponent={
            <EmptyState
              icon={<Ionicons name="notifications-off-outline" size={30} color={colors.slate500} />}
              title="No notifications"
              message="You're all caught up. Bill reminders will appear here."
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(139,92,246,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8, marginTop: 4 },
});
