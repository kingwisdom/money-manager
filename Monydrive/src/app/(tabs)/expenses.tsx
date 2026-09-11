import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { api, Category } from '@/api/client';
import CategoryIcon from '@/components/CategoryIcon';
import ExpenseFormModal from '@/components/ExpenseFormModal';
import { ConfirmModal } from '@/components/Modal';
import MonthPicker from '@/components/MonthPicker';
import Screen from '@/components/Screen';
import { Button, Card, EmptyState, Loading, ScreenHeader } from '@/components/ui';
import { useCurrency } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { useThemeColors } from '@/theme';
import { formatDate, monthInputValue } from '@/utils/dates';
import { formatMoney } from '@/utils/money';

interface Expense {
  id: number;
  description: string;
  category_id: number | null;
  amount: number;
  spent_on: string;
  category?: { id: number; name: string; color: string; icon: string } | null;
}

export default function Expenses() {
  const colors = useThemeColors();
  const currency = useCurrency();
  const { show } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [month, setMonth] = useState(monthInputValue());
  const [catFilter, setCatFilter] = useState('all');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(
    async (refresh = false) => {
      try {
        const params: any = { month };
        if (catFilter !== 'all') params.category = catFilter;
        const res = await api.get('/expenses', { params });
        setExpenses(res.data.expenses);
        setTotal(res.data.total);
      } catch {}
      setLoading(false);
      if (refresh) setRefreshing(false);
    },
    [month, catFilter],
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

  const handleSaved = (e: any, isNew: boolean) => {
    setFormOpen(false);
    show(isNew ? 'Expense recorded' : 'Expense updated');
    load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/expenses/${deleteTarget.id}`);
      show('Expense deleted');
      setDeleteTarget(null);
      load();
    } catch (e: any) {
      show(e?.response?.data?.message || 'Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const groups: { date: string; items: Expense[] }[] = [];
  expenses.forEach((e) => {
    const last = groups[groups.length - 1];
    if (last && last.date === e.spent_on) last.items.push(e);
    else groups.push({ date: e.spent_on, items: [e] });
  });

  return (
    <Screen>
      <ScreenHeader
        title="Expenses"
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

      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Pressable
            style={[styles.filterChip, catFilter === 'all' && { backgroundColor: 'rgba(139,92,246,0.22)', borderColor: colors.violet }]}
            onPress={() => setCatFilter('all')}
          >
            <Text style={[styles.filterText, { color: colors.slate400 }, catFilter === 'all' && { color: '#fff' }]}>All</Text>
          </Pressable>
          {categories.filter((c) => c.type === 'expense').map((c) => {
            const active = catFilter === String(c.id);
            return (
              <Pressable
                key={c.id}
                style={[styles.filterChip, active && { backgroundColor: 'rgba(139,92,246,0.22)', borderColor: colors.violet }]}
                onPress={() => setCatFilter(active ? 'all' : String(c.id))}
              >
                <CategoryIcon icon={c.icon} color={active ? '#fff' : c.color} size={13} />
                <Text style={[styles.filterText, { color: colors.slate400 }, active && { color: '#fff' }]}>{c.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {loading && expenses.length === 0 ? (
        <Loading message="Loading expenses..." />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(g) => g.date}
          renderItem={({ item: group }) => (
            <Card style={{ marginBottom: 12 }}>
              <Text style={[styles.groupDate, { color: colors.slate400 }]}>{formatDate(group.date)}</Text>
              {group.items.map((e) => {
                const c = e.category?.color || colors.slate500;
                return (
                  <Pressable
                    key={e.id}
                    onPress={() => { setEditing(e); setFormOpen(true); }}
                    style={styles.row}
                  >
                    <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: `${c}1a`, alignItems: 'center', justifyContent: 'center' }}>
                      <CategoryIcon icon={e.category?.icon} color={c} size={15} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ color: colors.white, fontWeight: '500', fontSize: 14 }}>{e.description}</Text>
                      <Text style={{ color: colors.slate500, fontSize: 12 }}>{e.category?.name ?? 'Uncategorized'}</Text>
                    </View>
                    <Text style={{ color: colors.rose400, fontWeight: '700', fontSize: 14 }}>−{formatMoney(e.amount, currency)}</Text>
                    <Pressable onPress={() => setDeleteTarget(e)} style={{ marginLeft: 12 }}>
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
              icon={<Ionicons name="arrow-down-circle-outline" size={30} color={colors.slate500} />}
              title="No expenses"
              message="Track your spending to stay on top of your budget."
              action={<Button title="Add expense" onPress={() => { setEditing(null); setFormOpen(true); }} />}
            />
          }
        />
      )}

      <ExpenseFormModal
        visible={formOpen}
        onClose={() => setFormOpen(false)}
        editing={editing}
        categories={categories.filter((c) => c.type === 'expense')}
        onSaved={handleSaved}
      />
      <ConfirmModal
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete expense?"
        message={`"${deleteTarget?.description}" will be removed.`}
        loading={deleting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  filterText: { fontSize: 12, fontWeight: '600' },
  groupDate: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
});
