import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    CalendarClock,
    CheckCircle2,
    ReceiptText,
    Wallet,
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import StatCard from '../components/StatCard';
import Countdown from '../components/Countdown';
import ProgressBar from '../components/ProgressBar';
import CategoryIcon from '../components/CategoryIcon';
import EmptyState from '../components/EmptyState';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import DonutChart from '../components/charts/DonutChart';
import { formatMoney, formatMoneyShort } from '../helpers/money';
import { formatDate } from '../helpers/dates';
import { useApp } from '../context/AppContext';
import useApiData from '../hooks/useApiData';
import api from '../api/client';

const fade = (index) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.07, duration: 0.4, ease: 'easeOut' },
});

export default function Dashboard() {
    const { currency } = useApp();
    const { data, loading, error, run } = useApiData();

    useEffect(() => {
        run(() => api.get('/dashboard'));
    }, []);

    if (loading && !data) {
        return (
            <AppLayout title="Dashboard">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                </div>
            </AppLayout>
        );
    }

    if (error && !data) {
        return (
            <AppLayout title="Dashboard">
                <div className="card p-6 text-sm text-rose-400">
                    Something went wrong loading your dashboard.
                </div>
            </AppLayout>
        );
    }

    const { month, upcomingBills, dueCounts, incomeVsExpense, expenseByCategory, budgets, recentTransactions } = data;

    const surplus = Number(month.surplus);
    const billsTotal = Number(month.bills_total);
    const billsPaid = Number(month.bills_paid);

    return (
        <AppLayout title="Dashboard">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        index={0}
                        label="Income · This month"
                        value={month.income}
                        format={(v) => formatMoney(v, currency)}
                        accent="emerald"
                        icon={<ArrowUpRight size={20} />}
                        sub={month.label}
                    />
                    <StatCard
                        index={1}
                        label="Expenses · This month"
                        value={month.expense}
                        format={(v) => formatMoney(v, currency)}
                        accent="rose"
                        icon={<ArrowDownRight size={20} />}
                        sub={month.label}
                    />
                    <StatCard
                        index={2}
                        label={surplus >= 0 ? 'Surplus' : 'Deficit'}
                        value={Math.abs(surplus)}
                        format={(v) => formatMoney(v, currency)}
                        accent={surplus >= 0 ? 'violet' : 'amber'}
                        icon={<Wallet size={20} />}
                        sub={surplus >= 0 ? 'Money left to save' : 'Over budget this month'}
                    />
                    <StatCard
                        index={3}
                        label="Bills due this month"
                        value={billsTotal}
                        format={(v) => formatMoney(v, currency)}
                        accent="sky"
                        icon={<ReceiptText size={20} />}
                        sub={`${billsPaid ? formatMoney(billsPaid, currency) : '—'} already paid`}
                    />
                </div>

                {/* Upcoming bills + due summary */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div {...fade(1)} className="card p-6 lg:col-span-2">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white">Upcoming bills</h2>
                                <p className="text-sm text-slate-400">Live countdown to each due date</p>
                            </div>
                            <Link to="/bills" className="btn-secondary !py-2">
                                Manage bills
                            </Link>
                        </div>

                        {upcomingBills.length === 0 ? (
                            <EmptyState
                                icon="receipt"
                                title="No active bills"
                                message="Add a subscription or bill and it will appear here with a live countdown."
                                action={
                                    <Link to="/bills" className="btn-primary">
                                        Add your first bill
                                    </Link>
                                }
                            />
                        ) : (
                            <div className="space-y-3">
                                {upcomingBills.map((bill) => {
                                    const overdue = bill.due.days < 0;
                                    const urgent = !overdue && bill.due.days <= (bill.reminder_days ?? 3);

                                    return (
                                        <motion.div
                                            key={bill.id}
                                            whileHover={{ y: -2 }}
                                            className={`flex flex-wrap items-center gap-4 rounded-xl border p-4 transition-colors ${
                                                overdue
                                                    ? 'border-rose-500/30 bg-rose-500/[0.05]'
                                                    : urgent
                                                      ? 'border-amber-500/20 bg-amber-500/[0.04]'
                                                      : 'border-white/[0.06] bg-white/[0.02]'
                                            }`}
                                        >
                                            <div
                                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                                                style={{
                                                    backgroundColor: `${bill.category?.color ?? '#8b5cf6'}1a`,
                                                    color: bill.category?.color ?? '#8b5cf6',
                                                }}
                                            >
                                                <CategoryIcon icon={bill.category?.icon ?? 'tag'} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-white">{bill.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {formatMoney(bill.amount, currency)} · every{' '}
                                                    {bill.frequency === 'yearly' ? 'year' : 'month'} · due the{' '}
                                                    {bill.due_day}
                                                    {bill.due_month ? `/${bill.due_month}` : ''}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {overdue ? (
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-rose-400">
                                                            {Math.abs(bill.due.days)} day
                                                            {Math.abs(bill.due.days) === 1 ? '' : 's'} overdue
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {formatDate(bill.due.next_due)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <Countdown nextDue={bill.due.next_due} urgent={urgent} />
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* Due summary */}
                    <motion.div {...fade(2)} className="card p-6">
                        <h2 className="mb-5 text-lg font-bold text-white">Due soon</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/[0.05] p-4">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle size={20} className="text-rose-400" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Overdue</p>
                                        <p className="text-xs text-slate-400">Bills past their due date</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-rose-400">{dueCounts.overdue}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
                                <div className="flex items-center gap-3">
                                    <CalendarClock size={20} className="text-amber-400" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Due soon</p>
                                        <p className="text-xs text-slate-400">Today, tomorrow & beyond</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-amber-400">{dueCounts.due_soon}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={20} className="text-emerald-400" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Handled</p>
                                        <p className="text-xs text-slate-400">Bills paid this month</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-emerald-400">
                                    {month.bills_paid ? formatMoneyShort(month.bills_paid, currency) : '—'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                            <p className="text-sm font-semibold text-white">Monthly rhythm</p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-400">
                                Track bills, stay ahead of your due dates, and keep your budget in check — all in
                                one place.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div {...fade(3)} className="card p-6 lg:col-span-2">
                        <h2 className="mb-1 text-lg font-bold text-white">Cash flow</h2>
                        <p className="mb-5 text-sm text-slate-400">Income vs expenses · last 6 months</p>
                        <IncomeExpenseChart data={incomeVsExpense} />
                    </motion.div>

                    <motion.div {...fade(4)} className="card p-6">
                        <h2 className="mb-1 text-lg font-bold text-white">Spending</h2>
                        <p className="mb-2 text-sm text-slate-400">By category · this month</p>
                        {expenseByCategory.length === 0 ? (
                            <div className="flex h-[260px] items-center justify-center">
                                <p className="text-sm text-slate-500">No expenses yet this month.</p>
                            </div>
                        ) : (
                            <DonutChart
                                data={expenseByCategory}
                                centerLabel="Total spent"
                                centerValue={formatMoneyShort(
                                    expenseByCategory.reduce((sum, c) => sum + c.total, 0),
                                    currency,
                                )}
                            />
                        )}
                    </motion.div>
                </div>

                {/* Budgets + recent transactions */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div {...fade(5)} className="card p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Budgets</h2>
                            <Link to="/budgets" className="text-xs font-semibold text-violet-400 hover:text-violet-300">
                                View all
                            </Link>
                        </div>

                        {budgets.length === 0 ? (
                            <p className="py-8 text-center text-sm text-slate-500">
                                Set a budget limit on any category to see progress here.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {budgets.slice(0, 4).map((budget) => (
                                    <div key={budget.id}>
                                        <div className="mb-1.5 flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 font-medium text-slate-300">
                                                <span
                                                    className="h-2.5 w-2.5 rounded-full"
                                                    style={{ backgroundColor: budget.color }}
                                                />
                                                {budget.name}
                                            </span>
                                            <span
                                                className={`font-semibold tabular-nums ${
                                                    budget.percent >= 100 ? 'text-rose-400' : 'text-slate-400'
                                                }`}
                                            >
                                                {formatMoneyShort(budget.spent, currency)} /{' '}
                                                {formatMoneyShort(budget.limit, currency)}
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={budget.percent}
                                            color={budget.percent >= 100 ? '#f43f5e' : budget.color}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <motion.div {...fade(6)} className="card p-6 lg:col-span-2">
                        <h2 className="mb-5 text-lg font-bold text-white">Recent activity</h2>
                        {recentTransactions.length === 0 ? (
                            <EmptyState
                                icon="tag"
                                title="No activity yet"
                                message="Record income or expenses to start building your history."
                            />
                        ) : (
                            <div className="divide-y divide-white/5">
                                {recentTransactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center gap-4 py-3 transition-colors hover:bg-white/[0.02]"
                                    >
                                        <div
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                                            style={{
                                                backgroundColor: `${tx.color}1a`,
                                                color: tx.color,
                                            }}
                                        >
                                            <CategoryIcon icon={tx.icon} size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-white">{tx.label}</p>
                                            <p className="text-xs text-slate-500">
                                                {tx.category ?? 'Uncategorized'} · {formatDate(tx.date)}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-sm font-bold tabular-nums ${
                                                tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                                            }`}
                                        >
                                            {tx.type === 'income' ? '+' : '−'}
                                            {formatMoney(tx.amount, currency)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
