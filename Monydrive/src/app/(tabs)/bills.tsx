import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { api, Category } from '@/api/client';
import CategoryIcon from '@/components/CategoryIcon';
import BillFormModal from '@/components/BillFormModal';
import { ConfirmModal } from '@/components/Modal';
import Screen from '@/components/Screen';
import { Button, Card, EmptyState, Loading, ScreenHeader } from '@/components/ui';
import { useCurrency } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { useThemeColors } from '@/theme';
import { formatDate, dueLabel } from '@/utils/dates';
import { formatMoney } from '@/utils/money';

interface Bill {
  id: number;
  name: string;
  category_id: number | null;
  amount: number;
  due_day: number;
  due_month: number | null;
  frequency: 'monthly' | 'yearly';
  auto_pay: boolean;
  active: boolean;
  reminder_days: number;
  notes: string | null;
  category?: { id: number; name: string; color: string; icon: string } | null;
  due?: { days: number; next_due: string; next_due_display: string; key: string; label: string };
  last_paid?: string | null;
  last_payment_id?: number | null;
  payment_count?: number;
}

export default function Bills() {
  const colors = useThemeColors();
  const currency = useCurrency();
  const { show } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Bill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Bill | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [payingId, setPayingId] = useState<number | null>(null);

  const load = useCallback(async (refresh = false) => {
    try {
      const res = await api.get('/bills');
      setBills(res.data.bills);
    } catch {}
    setLoading(false);
    if (refresh) setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
    api.get('/categories').then((r) => setCategories(r.data.categories)).catch(() => {});
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load(true);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (b: Bill) => {
    setEditing(b);
    setFormOpen(true);
  };

  const handleSaved = (bill: Bill, isNew: boolean) => {
    setFormOpen(false);
    show(isNew ? 'Bill created' : 'Bill updated');
    load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/bills/${deleteTarget.id}`);
      show('Bill deleted');
      setDeleteTarget(null);
      load();
    } catch (e: any) {
      show(e?.response?.data?.message || 'Failed to delete bill', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const payBill = async (bill: Bill) => {
    setPayingId(bill.id);
    try {
      await api.post(`/bills/${bill.id}/pay`, { bill_id: bill.id });
      show(`${bill.name} marked as paid`);
      load();
    } catch (e: any) {
      show(e?.response?.data?.message || 'Failed to mark as paid', 'error');
    } finally {
      setPayingId(null);
    }
  };

  const renderBill = ({ item }: { item: Bill }) => {
    const c = item.category?.color || colors.violet;
    const days = item.due?.days;
    const overdue = days !== undefined && days < 0;
    const urgent = days !== undefined && !overdue && days <= (item.reminder_days ?? 3);
    const ring = overdue
      ? { borderColor: 'rgba(244,63,94,0.35)', backgroundColor: 'rgba(244,63,94,0.05)' }
      : urgent
      ? { borderColor: 'rgba(245,158,11,0.3)', backgroundColor: 'rgba(245,158,11,0.05)' }
      : { borderColor: colors.cardLine, backgroundColor: colors.chipBg };

    return (
      <Card style={{ marginBottom: 10, opacity: item.active ? 1 : 0.5 }}>
        <Pressable onPress={() => openEdit(item)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: `${c}1a`, alignItems: 'center', justifyContent: 'center' }}>
              <CategoryIcon icon={item.category?.icon} color={c} size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: colors.white, fontWeight: '600', fontSize: 15 }}>{item.name}</Text>
              <Text style={{ color: colors.slate500, fontSize: 12, marginTop: 2 }}>
                {formatMoney(item.amount, currency)} · {item.frequency === 'yearly' ? 'yearly' : 'monthly'} · due the {item.due_day}
                {item.due_month ? `/${item.due_month}` : ''}
              </Text>
              {item.last_paid ? (
                <Text style={{ color: colors.slate500, fontSize: 11, marginTop: 1 }}>Last paid {formatDate(item.last_paid)}</Text>
              ) : null}
            </View>
          </View>
        </Pressable>
        {item.due ? (
          <View style={[styles.statusRow, ring]}>
            <Text style={{ color: overdue ? colors.rose400 : urgent ? colors.amber400 : colors.slate300, fontSize: 12, fontWeight: '600' }}>
              {days !== undefined ? dueLabel(days).text : ''}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable onPress={() => payBill(item)} style={styles.payBtn}>
                {payingId === item.id ? <Ionicons name="hourglass" size={14} color={colors.emerald} /> : <Ionicons name="checkmark" size={14} color={colors.emerald} />}
                <Text style={{ color: colors.emerald, fontSize: 12, fontWeight: '700' }}>Mark paid</Text>
              </Pressable>
              <Pressable onPress={() => setDeleteTarget(item)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={14} color={colors.rose400} />
              </Pressable>
            </View>
          </View>
        ) : null}
        {!item.active ? <Text style={{ color: colors.slate500, fontSize: 11, marginTop: 6 }}>Inactive</Text> : null}
      </Card>
    );
  };

  if (loading && bills.length === 0) return <Loading message="Loading bills..." />;

  return (
    <Screen>
      <ScreenHeader
        title="Bills"
        subtitle="Recurring bills & subscriptions"
        right={
          <Pressable onPress={openCreate} style={[styles.addBtn, { backgroundColor: colors.violet }]}>
            <Ionicons name="add" size={22} color="#fff" />
          </Pressable>
        }
      />
      <FlatList
        data={bills}
        keyExtractor={(b) => String(b.id)}
        renderItem={renderBill}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.violet} />}
        ListEmptyComponent={
          <EmptyState
            icon={<Ionicons name="receipt-outline" size={30} color={colors.slate500} />}
            title="No bills yet"
            message="Add a subscription or bill and track when each payment is due."
            action={<Button title="Add your first bill" onPress={openCreate} />}
          />
        }
      />

      <BillFormModal
        visible={formOpen}
        onClose={() => setFormOpen(false)}
        editing={editing}
        categories={categories.filter((c) => c.type === 'expense')}
        currency={currency}
        onSaved={handleSaved}
      />
      <ConfirmModal
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete bill?"
        message={`"${deleteTarget?.name}" will be permanently removed.`}
        loading={deleting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statusRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 10, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8,
  },
  payBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deleteBtn: { width: 26, height: 26, borderRadius: 8, backgroundColor: 'rgba(244,63,94,0.12)', alignItems: 'center', justifyContent: 'center' },
});