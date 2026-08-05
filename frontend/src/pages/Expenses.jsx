import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Plus, TrendingDown, Trash2 } from 'lucide-react';
import api from '@/api/client';
import AppLayout from '@/layouts/AppLayout';
import PageHeader from '@/components/PageHeader';
import MonthPicker from '@/components/MonthPicker';
import ExpenseForm from '@/components/ExpenseForm';
import CategoryIcon from '@/components/CategoryIcon';
import EmptyState from '@/components/EmptyState';
import AnimatedNumber from '@/components/AnimatedNumber';
import useApiData from '@/hooks/useApiData';
import { useApp } from '@/context/AppContext';
import { pushToast } from '@/store/toastStore';
import { formatMoney } from '@/helpers/money';
import { formatDate, monthInputValue } from '@/helpers/dates';

export default function Expenses() {
    const { categories, currency } = useApp();
    const [month, setMonth] = useState(monthInputValue());
    const [categoryFilter, setCategoryFilter] = useState('');
    const { data, loading, error, run } = useApiData();
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        run(() => api.get('/expenses', { params: { month, category: categoryFilter } }));
    }, [month, categoryFilter, run]);

    const expenses = data?.expenses ?? [];
    const total = data?.total ?? 0;

    const changeFilter = (value) => {
        setCategoryFilter(value);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditing(null);
        run(() => api.get('/expenses', { params: { month, category: categoryFilter } }));
    };

    const remove = async (expense) => {
        if (window.confirm(`Delete expense "${expense.description}"?`)) {
            try {
                await api.delete(`/expenses/${expense.id}`);
                pushToast({ type: 'success', title: 'Expense deleted', message: `Deleted "${expense.description}".` });
                run(() => api.get('/expenses', { params: { month, category: categoryFilter } }));
            } catch {}
        }
    };

    const expenseCategories = categories.filter((c) => c.type === 'expense');

    if (error && !data) {
        return (
            <AppLayout title="Expenses">
                <div className="card p-6 text-sm text-rose-400">Failed to load expenses.</div>
            </AppLayout>
        );
    }

    if (!data) {
        return (
            <AppLayout title="Expenses">
                <div className="flex items-center justify-center py-24">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Expenses">
            <PageHeader
                title="Expenses"
                subtitle="Track where your money goes"
                actions={
                    <>
                        <select value={categoryFilter} onChange={(e) => changeFilter(e.target.value)} className="input !py-2">
                            <option value="">All categories</option>
                            {expenseCategories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <MonthPicker month={month} onChange={setMonth} />
                        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary">
                            <Plus size={16} /> Record expense
                        </button>
                    </>
                }
            />

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="card mb-6 flex flex-wrap items-center justify-between gap-4 p-6"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/5 text-rose-400">
                        <TrendingDown size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                            Total spent · {new Date(`${month}-01`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-2xl font-extrabold text-white tabular-nums">
                            <AnimatedNumber value={total} format={(v) => formatMoney(v, currency)} />
                        </p>
                    </div>
                </div>
                <p className="text-sm text-slate-500">{expenses.length} expense{expenses.length === 1 ? '' : 's'}</p>
            </motion.div>

            {expenses.length === 0 ? (
                <EmptyState
                    icon="receipt"
                    title="No expenses recorded"
                    message="Track a purchase or payment to start building your spending picture."
                    action={
                        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary">
                            <Plus size={16} /> Record expense
                        </button>
                    }
                />
            ) : (
                <div className="card overflow-hidden">
                    <div className="divide-y divide-white/5">
                        {expenses.map((expense, index) => (
                            <motion.div
                                key={expense.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="table-row flex items-center gap-4 px-5 py-4"
                            >
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                    style={{
                                        backgroundColor: `${expense.category?.color ?? '#f43f5e'}1a`,
                                        color: expense.category?.color ?? '#f43f5e',
                                    }}
                                >
                                    <CategoryIcon icon={expense.category?.icon ?? 'receipt'} size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-white">{expense.description}</p>
                                    <p className="text-xs text-slate-500">
                                        {expense.category?.name ?? 'Uncategorized'} · {formatDate(expense.spent_on)}
                                    </p>
                                </div>
                                <span className="text-sm font-bold text-rose-400 tabular-nums">
                                    −{formatMoney(expense.amount, currency)}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => { setEditing(expense); setFormOpen(true); }}
                                        className="btn-ghost !px-2.5 !py-2"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => remove(expense)} className="btn-ghost !px-2.5 !py-2 text-rose-400">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <ExpenseForm
                show={formOpen}
                onClose={closeForm}
                expense={editing}
                defaultMonth={`${month}-${String(new Date().getDate()).padStart(2, '0')}`}
            />
        </AppLayout>
    );
}
