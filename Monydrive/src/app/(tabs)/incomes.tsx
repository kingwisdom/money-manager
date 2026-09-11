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
import IncomeFormModal from '@/components/IncomeFormModal';
import { ConfirmModal } from '@/components/Modal';
import MonthPicker from '@/components/MonthPicker';
import Screen from '@/components/Screen';
import { Button, Card, EmptyState, Loading, ScreenHeader } from '@/components/ui';
import { useCurrency } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { useThemeColors } from '@/theme';
import { formatDate, monthInputValue } from '@/utils/dates';
import { formatMoney } from '@/utils/money';

interface Income {
  id: number;
  source: string;
  category_id: number | null;
  amount: number;
  received_on: string;
  category?: { id: number; name: string; color: string; icon: string } | null;
}

export default function Incomes() {
  const colors = useThemeColors();
  const currency = useCurrency();
  const { show } = useToast();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [month, setMonth] = useState(monthInputValue());
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Income | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(
    async (refresh = false) => {
      try {
        const res = await api.get('/incomes', { params: { month } });
        setIncomes(res.data.incomes);
        setTotal(res.data.total);
      } catch {}
      setLoading(false);
      if (refresh) setRefreshing(false);
    },
    [month],
  );

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.categories)).catch(() => {});
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    load(true);
  };

  const handleSaved = (i: any, isNew: boolean) => {
    setFormOpen(false);
    show(isNew ? 'Income recorded' : 'Income updated');
    load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/incomes/${deleteTarget.id}`);
      show('Income deleted');
      setDeleteTarget(null);
      load();
    } catch (e: any) {
      show(e?.response?.data?.message || 'Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const groups: { date: string; items: Income[] }[] = [];
  incomes.forEach((i) => {
    const last = groups[groups.length - 1];
    if (last && last.date === i.received_on) last.items.push(i);
    else groups.push({ date: i.received_on, items: [i] });
  });

  return (
    <Screen>
      <ScreenHeader
        title="Incomes"
        subtitle={`Total · ${formatMoney(total, currency)}`}
        right={
          <Pressable
            style={[styles.addBtn, { backgroundColor: colors.violet }]}
            onPress={() => { setEditing(null); setFormOpen(true); }}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </Pressable>
        }
      />
      <View style={{ paddingHorizontal: 16 }}>
        <MonthPicker value={month} onChange={setMonth} />
      </View>

      {loading && incomes.length === 0 ? (
        <Loading message="Loading incomes..." />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(g) => g.date}
          renderItem={({ item: group }) => (
            <Card style={{ marginBottom: 12 }}>
              <Text style={[styles.groupDate, { color: colors.slate400 }]}>{formatDate(group.date)}</Text>
              {group.items.map((i) => {
                return (
                  <Pressable
                    key={i.id}
                    onPress={() => { setEditing(i); setFormOpen(true); }}
                    style={styles.row}
                  >
                    <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: 'rgba(52,211,153,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                      <CategoryIcon icon={i.category?.icon} color={colors.emerald} size={15} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ color: colors.white, fontWeight: '500', fontSize: 14 }}>{i.source}</Text>
                      <Text style={{ color: colors.slate500, fontSize: 12 }}>{i.category?.name ?? 'Uncategorized'}</Text>
                    </View>
                    <Text style={{ color: colors.emerald, fontWeight: '700', fontSize: 14 }}>+{formatMoney(i.amount, currency)}</Text>
                    <Pressable onPress={() => setDeleteTarget(i)} style={{ marginLeft: 12 }}>
                      <Ionicons name="trash-outline" size={16} color={colors.slate500} />
                    </Pressable>
                  </Pressable>
                );
              })}
            </Card>
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.violet} />}
          ListEmptyComponent={
            <EmptyState
              icon={<Ionicons name="arrow-up-circle-outline" size={30} color={colors.slate500} />}
              title="No income"
              message="Record your income to see how much you bring in each month."
              action={<Button title="Add income" onPress={() => { setEditing(null); setFormOpen(true); }} />}
            />
          }
        />
      )}

      <IncomeFormModal
        visible={formOpen}
        onClose={() => setFormOpen(false)}
        editing={editing}
        categories={categories.filter((c) => c.type === 'income')}
        onSaved={handleSaved}
      />
      <ConfirmModal
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete income?"
        message={`"${deleteTarget?.source}" will be removed.`}
        loading={deleting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  groupDate: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
});
