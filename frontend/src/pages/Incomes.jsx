import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Plus, Trash2, TrendingUp } from 'lucide-react';
import api from '@/api/client';
import AppLayout from '@/layouts/AppLayout';
import PageHeader from '@/components/PageHeader';
import MonthPicker from '@/components/MonthPicker';
import IncomeForm from '@/components/IncomeForm';
import CategoryIcon from '@/components/CategoryIcon';
import EmptyState from '@/components/EmptyState';
import AnimatedNumber from '@/components/AnimatedNumber';
import useApiData from '@/hooks/useApiData';
import { useApp } from '@/context/AppContext';
import { pushToast } from '@/store/toastStore';
import { formatMoney } from '@/helpers/money';
import { formatDate, monthInputValue } from '@/helpers/dates';

export default function Incomes() {
    const { currency } = useApp();
    const [month, setMonth] = useState(monthInputValue());
    const { data, loading, error, run } = useApiData();
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        run(() => api.get('/incomes', { params: { month } }));
    }, [month, run]);

    const incomes = data?.incomes ?? [];
    const total = data?.total ?? 0;

    const closeForm = () => {
        setFormOpen(false);
        setEditing(null);
        run(() => api.get('/incomes', { params: { month } }));
    };

    const remove = async (income) => {
        if (window.confirm(`Delete income "${income.source}"?`)) {
            try {
                await api.delete(`/incomes/${income.id}`);
                pushToast({ type: 'success', title: 'Income deleted', message: `Deleted "${income.source}".` });
                run(() => api.get('/incomes', { params: { month } }));
            } catch {}
        }
    };

    if (error && !data) {
        return (
            <AppLayout title="Income">
                <div className="card p-6 text-sm text-rose-400">Failed to load income.</div>
            </AppLayout>
        );
    }

    if (!data) {
        return (
            <AppLayout title="Income">
                <div className="flex items-center justify-center py-24">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Income">
            <PageHeader
                title="Income"
                subtitle="Everything you earn, month by month"
                actions={
                    <>
                        <MonthPicker month={month} onChange={setMonth} />
                        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary">
                            <Plus size={16} /> Record income
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/5 text-emerald-400">
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                            Total income · {new Date(`${month}-01`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-2xl font-extrabold text-white tabular-nums">
                            <AnimatedNumber value={total} format={(v) => formatMoney(v, currency)} />
                        </p>
                    </div>
                </div>
                <p className="text-sm text-slate-500">{incomes.length} income record{incomes.length === 1 ? '' : 's'}</p>
            </motion.div>

            {incomes.length === 0 ? (
                <EmptyState
                    icon="wallet"
                    title="No income recorded"
                    message="Add your salary, freelance payments or business income for this month."
                    action={
                        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary">
                            <Plus size={16} /> Record income
                        </button>
                    }
                />
            ) : (
                <div className="card overflow-hidden">
                    <div className="divide-y divide-white/5">
                        {incomes.map((income, index) => (
                            <motion.div
                                key={income.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="table-row flex items-center gap-4 px-5 py-4"
                            >
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                    style={{
                                        backgroundColor: `${income.category?.color ?? '#10b981'}1a`,
                                        color: income.category?.color ?? '#10b981',
                                    }}
                                >
                                    <CategoryIcon icon={income.category?.icon ?? 'wallet'} size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-white">{income.source}</p>
                                    <p className="text-xs text-slate-500">
                                        {income.category?.name ?? 'Uncategorized'} · {formatDate(income.received_on)}
                                    </p>
                                </div>
                                <span className="text-sm font-bold text-emerald-400 tabular-nums">
                                    +{formatMoney(income.amount, currency)}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => { setEditing(income); setFormOpen(true); }}
                                        className="btn-ghost !px-2.5 !py-2"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => remove(income)} className="btn-ghost !px-2.5 !py-2 text-rose-400">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <IncomeForm
                show={formOpen}
                onClose={closeForm}
                income={editing}
                defaultMonth={`${month}-${String(new Date().getDate()).padStart(2, '0')}`}
            />
        </AppLayout>
    );
}
