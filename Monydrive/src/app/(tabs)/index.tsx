import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { api } from '@/api/client';
import CategoryIcon from '@/components/CategoryIcon';
import Screen from '@/components/Screen';
import { Button, Card, EmptyState, Loading, ProgressBar, ScreenHeader } from '@/components/ui';
import { useCurrency } from '@/context/AppContext';
import { useThemeColors } from '@/theme';
import { formatDate } from '@/utils/dates';
import { formatMoney, formatMoneyShort } from '@/utils/money';

interface DashboardData {
  month: {
    label: string;
    income: number;
    expense: number;
    surplus: number;
    bills_total: number;
    bills_paid: number;
  };
  upcomingBills: any[];
  dueCounts: { overdue: number; due_today: number; due_soon: number };
  incomeVsExpense: { label: string; income: number; expense: number }[];
  expenseByCategory: { name: string; color: string; icon: string; total: number }[];
  activityByCategory: { name: string; color: string; icon: string; type: string; total: number }[];
  budgets: any[];
  recentTransactions: any[];
}

function StatRow({
  label,
  sub,
  value,
  icon,
  iconColor,
}: {
  label: string;
  sub: string;
  value: string;
  icon: string;
  iconColor: string;
}) {
  const colors = useThemeColors();
  return (
    <Card style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={icon as any} size={16} color={iconColor} />
        <Text style={[styles.statLabel, { color: colors.slate500 }]}>{label}</Text>
      </View>
      <Text style={[styles.statValue, { color: colors.white }]}>{value}</Text>
      <Text style={[styles.statSub, { color: colors.slate500 }]}>{sub}</Text>
    </Card>
  );
}

function CashFlowChart({ data }: { data: { label: string; income: number; expense: number }[] }) {
  const colors = useThemeColors();
  const max = Math.max(1, ...data.map((d) => Math.max(d.income, d.expense)));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, paddingTop: 8 }}>
      {data.map((d, i) => (
        <View key={i} style={{ alignItems: 'center', flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 3 }}>
            <View style={{ width: 10, height: Math.max(3, (d.income / max) * 110), backgroundColor: colors.emerald, borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
            <View style={{ width: 10, height: Math.max(3, (d.expense / max) * 110), backgroundColor: colors.rose, borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
          </View>
          <Text style={{ color: colors.slate500, fontSize: 11, marginTop: 6 }}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

function DonutChart({ data, currency }: { data: any[]; currency: string }) {
  const colors = useThemeColors();
  const total = data.reduce((s: number, c) => s + c.total, 0);
  if (!total) {
    return <Text style={{ color: colors.slate500, fontSize: 13, textAlign: 'center' }}>No expenses yet this month.</Text>;
  }
  return (
    <View>
      {data.map((c, i) => {
        const pct = (c.total / total) * 100;
        return (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
            <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: c.color, marginRight: 10 }} />
            <Text style={{ flex: 1, color: colors.slate300, fontSize: 13 }}>{c.name}</Text>
            <Text style={{ color: colors.slate400, fontSize: 12 }}>{formatMoneyShort(c.total, currency)} · {Math.round(pct)}%</Text>
          </View>
        );
      })}
    </View>
  );
}

function ActivityBreakdown({ data, currency }: { data: any[]; currency: string }) {
  const colors = useThemeColors();
  const total = data.reduce((s: number, c) => s + Number(c.total), 0);
  if (!total) return null;
  return (
    <View style={{ gap: 12, marginTop: 10 }}>
      {data.map((c, i) => {
        const pct = (Number(c.total) / total) * 100;
        return (
          <View key={`${c.type}-${c.name}-${i}`}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: c.color, marginRight: 10 }} />
              <Text style={{ flex: 1, color: colors.slate300, fontSize: 13 }}>{c.name}</Text>
              <Text style={{ color: c.type === 'income' ? colors.emerald : colors.rose400, fontSize: 12, fontWeight: '600', marginLeft: 8 }}>
                {c.type === 'income' ? '+' : '−'}{formatMoneyShort(c.total, currency)}
              </Text>
              <Text style={{ color: colors.slate500, fontSize: 12, width: 44, textAlign: 'right' }}>{Math.round(pct)}%</Text>
            </View>
            <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.chipBg, marginTop: 6, overflow: 'hidden' }}>
              <View style={{ width: `${pct}%`, height: '100%', borderRadius: 2, backgroundColor: c.color }} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

function BillRow({ bill, currency }: any) {
  const colors = useThemeColors();
  const c = bill.category?.color || colors.violet;
  const days = bill.due?.days;
  const overdue = days < 0;
  const urgent = !overdue && days <= (bill.reminder_days ?? 3);
  const bg = overdue ? 'rgba(244,63,94,0.06)' : urgent ? 'rgba(245,158,11,0.05)' : colors.chipBg;
  const border = overdue ? 'rgba(244,63,94,0.3)' : urgent ? 'rgba(245,158,11,0.2)' : colors.cardLine;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: border, backgroundColor: bg, borderRadius: 12, padding: 12, marginBottom: 8 }}>
      <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${c}1a`, alignItems: 'center', justifyContent: 'center' }}>
        <CategoryIcon icon={bill.category?.icon} color={c} size={18} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: colors.white, fontWeight: '600', fontSize: 14 }}>{bill.name}</Text>
        <Text style={{ color: colors.slate500, fontSize: 11, marginTop: 2 }}>
          {formatMoney(bill.amount, currency)} · every {bill.frequency === 'yearly' ? 'year' : 'month'} · due the {bill.due_day}
          {bill.due_month ? `/${bill.due_month}` : ''}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color: overdue ? colors.rose400 : urgent ? colors.amber400 : colors.slate300, fontWeight: '700', fontSize: 13 }}>
          {overdue ? `${Math.abs(days)}d overdue` : `${days}d`}
        </Text>
        <Text style={{ color: colors.slate500, fontSize: 10, marginTop: 2 }}>{formatDate(bill.due?.next_due)}</Text>
      </View>
    </View>
  );
}

function DueCard({ label, value, icon, iconColor, bg, border }: any) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: border, backgroundColor: bg, borderRadius: 12, padding: 14, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={icon} size={18} color={iconColor} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ color: colors.white, fontWeight: '600', fontSize: 13 }}>{label}</Text>
          <Text style={{ color: colors.slate400, fontSize: 11 }}>{' '}</Text>
        </View>
      </View>
      <Text style={{ color: iconColor, fontSize: 20, fontWeight: '800' }}>{value}</Text>
    </View>
  );
}

export default function Dashboard() {
  const colors = useThemeColors();
  const router = useRouter();
  const currency = useCurrency();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (asRefresh = false) => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch {}
    setLoading(false);
    if (asRefresh) setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load(true);
  };

  if (loading && !data) return <Loading message="Loading dashboard..." />;

  if (!data) {
    return (
      <Screen style={{ padding: 20, justifyContent: 'center' }}>
        <EmptyState
          icon={<Ionicons name="cloud-offline-outline" size={30} color={colors.slate500} />}
          title="Couldn't load dashboard"
          message="Check your connection and try again."
          action={<Button title="Retry" onPress={() => { setLoading(true); load(); }} />}
        />
      </Screen>
    );
  }

  const { month, upcomingBills, dueCounts, incomeVsExpense, expenseByCategory, activityByCategory, budgets, recentTransactions } = data;
  const surplus = Number(month.surplus);

  return (
    <Screen>
      <FlatList
        data={[1]}
        renderItem={() => (
          <View style={{ gap: 20 }}>
            <ScreenHeader title="Dashboard" subtitle={month.label} />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <StatRow label="Income" sub={month.label} value={formatMoneyShort(month.income, currency)} icon="arrow-up" iconColor={colors.emerald} />
              <StatRow label="Expenses" sub={month.label} value={formatMoneyShort(month.expense, currency)} icon="arrow-down" iconColor={colors.rose} />
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <StatRow label={surplus >= 0 ? 'Surplus' : 'Deficit'} sub={surplus >= 0 ? 'Money left to save' : 'Over budget this month'} value={formatMoneyShort(Math.abs(surplus), currency)} icon="wallet" iconColor={surplus >= 0 ? colors.violet : colors.amber} />
              <StatRow label="Bills due" sub={`${month.bills_paid ? formatMoneyShort(month.bills_paid, currency) : '—'} paid`} value={formatMoneyShort(month.bills_total, currency)} icon="receipt" iconColor={colors.sky} />
            </View>

            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.white }]}>Upcoming bills</Text>
                  <Text style={[styles.cardSub, { color: colors.slate400 }]}>Live countdown to each due date</Text>
                </View>
                <Button title="Manage" variant="secondary" onPress={() => router.push('/bills')} />
              </View>
              {upcomingBills.length === 0 ? (
                <EmptyState icon={<Ionicons name="receipt-outline" size={26} color={colors.slate500} />} title="No active bills" message="Add a subscription or bill and it will appear here." action={<Button title="Add your first bill" onPress={() => router.push('/bills')} />} />
              ) : (
                upcomingBills.map((bill) => <BillRow key={bill.id} bill={bill} currency={currency} />)
              )}
            </Card>

            <Card>
              <Text style={[styles.cardTitle, { color: colors.white }]}>Due soon</Text>
              <View style={{ marginTop: 12 }}>
                <DueCard label="Overdue" value={dueCounts.overdue} icon="alert-circle" iconColor={colors.rose400} bg="rgba(244,63,94,0.05)" border="rgba(244,63,94,0.2)" />
                <DueCard label="Due soon" value={dueCounts.due_soon} icon="calendar" iconColor={colors.amber400} bg="rgba(245,158,11,0.05)" border="rgba(245,158,11,0.2)" />
                <DueCard label="Handled this month" value={month.bills_paid ? formatMoneyShort(month.bills_paid, currency) : '—'} icon="checkmark-circle" iconColor={colors.emerald} bg="rgba(52,211,153,0.05)" border="rgba(52,211,153,0.2)" />
              </View>
            </Card>

            <Card>
              <Text style={[styles.cardTitle, { color: colors.white }]}>Cash flow</Text>
              <Text style={[styles.cardSub, { color: colors.slate400 }]}>Income vs expenses · last 6 months</Text>
              <View style={{ marginTop: 4 }}>
                <CashFlowChart data={incomeVsExpense} />
              </View>
            </Card>

            <Card>
              <Text style={[styles.cardTitle, { color: colors.white }]}>Spending by category</Text>
              <Text style={[styles.cardSub, { color: colors.slate400 }]}>This month</Text>
              <View style={{ marginTop: 10 }}>
                <DonutChart data={expenseByCategory} currency={currency} />
              </View>
            </Card>

            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.cardTitle, { color: colors.white }]}>Budgets</Text>
                <Button title="View all" variant="ghost" onPress={() => router.push('/more/budgets')} />
              </View>
              {budgets.length === 0 ? (
                <Text style={{ color: colors.slate500, fontSize: 13, textAlign: 'center', paddingVertical: 16 }}>Set a budget limit on any category to see progress here.</Text>
              ) : (
                <View style={{ gap: 12, marginTop: 8 }}>
                  {budgets.slice(0, 4).map((b: any) => (
                    <View key={b.id}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                        <Text style={{ color: colors.slate300, fontSize: 13, fontWeight: '500' }}>{b.name}</Text>
                        <Text style={{ color: b.percent >= 100 ? colors.rose400 : colors.slate400, fontSize: 12, fontWeight: '600' }}>
                          {formatMoneyShort(b.spent, currency)} / {formatMoneyShort(b.limit, currency)}
                        </Text>
                      </View>
                      <ProgressBar value={b.percent} color={b.percent >= 100 ? colors.rose : b.color} />
                    </View>
                  ))}
                </View>
              )}
            </Card>

            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.cardTitle, { color: colors.white }]}>Recent activity</Text>
                <Text style={{ color: colors.slate500, fontSize: 12 }}>{month.label}</Text>
              </View>
              {activityByCategory && activityByCategory.length > 0 ? (
                <View style={{ marginTop: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.cardLine, backgroundColor: colors.chipBg }}>
                  <Text style={{ color: colors.white, fontSize: 13, fontWeight: '600' }}>Activity by category</Text>
                  <ActivityBreakdown data={activityByCategory} currency={currency} />
                </View>
              ) : null}
              {recentTransactions.length === 0 ? (
                <EmptyState icon={<Ionicons name="pricetag-outline" size={26} color={colors.slate500} />} title="No activity yet" message="Record income or expenses to start building your history." />
              ) : (
                recentTransactions.map((tx: any) => (
                  <View key={tx.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
                    <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: `${tx.color}1a`, alignItems: 'center', justifyContent: 'center' }}>
                      <CategoryIcon icon={tx.icon} color={tx.color} size={15} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ color: colors.white, fontWeight: '500', fontSize: 13 }}>{tx.label}</Text>
                      <Text style={{ color: colors.slate500, fontSize: 11, marginTop: 1 }}>{tx.category ?? 'Uncategorized'} · {formatDate(tx.date)}</Text>
                    </View>
                    <Text style={{ color: tx.type === 'income' ? colors.emerald : colors.rose400, fontWeight: '700', fontSize: 13 }}>
                      {tx.type === 'income' ? '+' : '−'}{formatMoney(tx.amount, currency)}
                    </Text>
                  </View>
                ))
              )}
            </Card>
          </View>
        )}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.violet} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  statLabel: { fontSize: 11, marginLeft: 6, fontWeight: '600' },
  statValue: { fontSize: 20, fontWeight: '800', marginTop: 10 },
  statSub: { fontSize: 11, marginTop: 2 },
  cardTitle: { fontSize: 17, fontWeight: '700' },
  cardSub: { fontSize: 12, marginTop: 2 },
});