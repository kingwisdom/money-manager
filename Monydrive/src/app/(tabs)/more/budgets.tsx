import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { api } from '@/api/client';
import CategoryIcon from '@/components/CategoryIcon';
import { BottomModal } from '@/components/Modal';
import Screen from '@/components/Screen';
import { Button, Card, EmptyState, Field, Loading, ProgressBar, ScreenHeader } from '@/components/ui';
import { useCurrency } from '@/context/AppContext';
import { useToast } from '@/context/ToastContext';
import { useThemeColors } from '@/theme';
import { formatMoneyShort } from '@/utils/money';

interface Budget {
  id: number;
  name: string;
  color: string;
  icon: string;
  limit: number;
  spent: number;
  remaining: number;
  percent: number;
}

export default function Budgets() {
  const colors = useThemeColors();
  const currency = useCurrency();
  const { show } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editTarget, setEditTarget] = useState<Budget | null>(null);
  const [limitInput, setLimitInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (refresh = false) => {
    try {
      const res = await api.get('/budgets');
      setBudgets(res.data.budgets);
      setMonth(res.data.month);
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

  const openEdit = (b: Budget) => {
    setEditTarget(b);
    setLimitInput(b.limit ? String(b.limit) : '');
  };

  const saveBudget = async () => {
    if (!editTarget) return;
    const value = limitInput.trim() === '' ? null : parseFloat(limitInput);
    if (value !== null && (Number.isNaN(value) || value < 0)) {
      show('Enter a valid limit', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/budgets/${editTarget.id}`, { budget_limit: value });
      show('Budget updated');
      setEditTarget(null);
      load();
    } catch (e: any) {
      show(e?.response?.data?.message || 'Failed to update budget', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Budgets" subtitle={month} />
      {loading && budgets.length === 0 ? (
        <Loading message="Loading budgets..." />
      ) : (
        <FlatList
          data={budgets}
          keyExtractor={(b) => String(b.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.violet} />}
          renderItem={({ item: b }) => {
            const over = b.percent >= 100;
            const hasLimit = b.limit > 0;
            return (
              <Card style={{ marginBottom: 10 }}>
                <Pressable onPress={() => openEdit(b)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: `${b.color}1a`, alignItems: 'center', justifyContent: 'center' }}>
                      <CategoryIcon icon={b.icon} color={b.color} size={18} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ color: colors.white, fontWeight: '600', fontSize: 15 }}>{b.name}</Text>
                      <Text style={{ color: over ? colors.rose400 : colors.slate400, fontSize: 12, marginTop: 2 }}>
                        {formatMoneyShort(b.spent, currency)} of {hasLimit ? formatMoneyShort(b.limit, currency) : 'no limit'}
                        {hasLimit ? ` · ${over ? 'over budget!' : `${b.percent}% used`}` : ''}
                      </Text>
                    </View>
                    <Ionicons name="create-outline" size={18} color={colors.slate500} />
                  </View>
                  {hasLimit ? (
                    <View style={{ marginTop: 10 }}>
                      <ProgressBar value={b.percent} color={over ? colors.rose : b.color} />
                    </View>
                  ) : null}
                </Pressable>
              </Card>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon={<CategoryIcon icon="target" size={30} color={colors.slate500} />}
              title="No budgets yet"
              message="Set a monthly budget limit on any expense category to track your spending."
            />
          }
        />
      )}

      <BottomModal
        visible={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Budget for ${editTarget?.name ?? ''}`}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Field
            label={`Monthly limit (${currency})`}
            value={limitInput}
            onChangeText={setLimitInput}
            keyboardType="numeric"
            placeholder="0.00"
          />
          <Text style={{ color: colors.slate500, fontSize: 12, marginBottom: 14 }}>
            Leave empty to remove the limit.
          </Text>
          <Button title="Save budget" onPress={saveBudget} loading={saving} />
        </KeyboardAvoidingView>
      </BottomModal>
    </Screen>
  );
}
