import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { api, Category } from '@/api/client';
import CategoryFormModal from '@/components/CategoryFormModal';
import CategoryIcon from '@/components/CategoryIcon';
import { ConfirmModal } from '@/components/Modal';
import Screen from '@/components/Screen';
import { Button, Card, EmptyState, Loading, ScreenHeader } from '@/components/ui';
import { useCurrency } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { useThemeColors } from '@/theme';
import { formatMoneyShort } from '@/utils/money';

export default function Categories() {
  const colors = useThemeColors();
  const currency = useCurrency();
  const { show } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (refresh = false) => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories);
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

  const handleSaved = (c: any, isNew: boolean) => {
    setFormOpen(false);
    show(isNew ? 'Category created' : 'Category updated');
    load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      show('Category deleted');
      setDeleteTarget(null);
      load();
    } catch (e: any) {
      show(e?.response?.data?.message || 'Failed to delete category', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const renderGroup = (title: string, list: Category[]) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={[styles.groupTitle, { color: colors.slate400 }]}>{title}</Text>
      {list.length === 0 ? (
        <Text style={{ color: colors.slate500, fontSize: 13, paddingVertical: 8 }}>No {title.toLowerCase()} categories yet.</Text>
      ) : (
        list.map((c) => (
          <Card key={c.id} style={{ marginBottom: 10 }}>
            <Pressable onPress={() => { setEditing(c); setFormOpen(true); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: `${c.color}1a`, alignItems: 'center', justifyContent: 'center' }}>
                <CategoryIcon icon={c.icon} color={c.color} size={19} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: colors.white, fontWeight: '600', fontSize: 15 }}>{c.name}</Text>
                <Text style={{ color: colors.slate500, fontSize: 12, marginTop: 2 }}>
                  {c.type === 'expense'
                    ? `${formatMoneyShort(c.spent_this_month ?? 0, currency)} spent ${c.budget_limit ? `· limit ${formatMoneyShort(c.budget_limit, currency)}` : '· no limit'}`
                    : `${c.bills_count ? `${c.bills_count} bill${c.bills_count > 1 ? 's' : ''} · ` : ''}income category`}
                </Text>
              </View>
              <Pressable onPress={() => setDeleteTarget(c)} style={{ marginLeft: 8 }}>
                <Ionicons name="trash-outline" size={17} color={colors.slate500} />
              </Pressable>
            </Pressable>
          </Card>
        ))
      )}
    </View>
  );

  const expenseCats = categories.filter((c) => c.type === 'expense');
  const incomeCats = categories.filter((c) => c.type === 'income');

  return (
    <Screen>
      <ScreenHeader
        title="Categories"
        subtitle={`${expenseCats.length} expense · ${incomeCats.length} income`}
        right={
          <Pressable
            style={[styles.addBtn, { backgroundColor: colors.violet }]}
            onPress={() => { setEditing(null); setFormOpen(true); }}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </Pressable>
        }
      />
      {loading && categories.length === 0 ? (
        <Loading message="Loading categories..." />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.violet} />}
        >
          {renderGroup('Expenses', expenseCats)}
          {renderGroup('Income', incomeCats)}
          {categories.length === 0 ? (
            <EmptyState
              icon={<CategoryIcon icon="pricetag" size={30} color={colors.slate500} />}
              title="No categories"
              message="Create categories to organize your income and expenses."
              action={<Button title="Create category" onPress={() => { setEditing(null); setFormOpen(true); }} />}
            />
          ) : null}
        </ScrollView>
      )}

      <CategoryFormModal visible={formOpen} onClose={() => setFormOpen(false)} editing={editing} onSaved={handleSaved} />
      <ConfirmModal
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete category?"
        message={`"${deleteTarget?.name}" will be removed.`}
        loading={deleting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  groupTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
});
