import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit2, X, Wallet } from 'lucide-react';
import api from '@/api/client';
import AppLayout from '@/layouts/AppLayout';
import PageHeader from '@/components/PageHeader';
import CategoryIcon from '@/components/CategoryIcon';
import EmptyState from '@/components/EmptyState';
import AnimatedNumber from '@/components/AnimatedNumber';
import useApiData from '@/hooks/useApiData';
import { useApp } from '@/context/AppContext';
import { pushToast } from '@/store/toastStore';
import { formatMoney } from '@/helpers/money';

function BudgetRow({ budget, index, currency, onSaved }) {
    const [editing, setEditing] = useState(false);
    const [budgetLimit, setBudgetLimit] = useState(budget.limit > 0 ? budget.limit : '');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const save = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            await api.patch(`/budgets/${budget.id}`, { budget_limit: budgetLimit });
            pushToast({ type: 'success', title: 'Budget updated', message: `Monthly budget for ${budget.name} updated.` });
            setEditing(false);
            onSaved();
        } catch (err) {
            setError(err.response?.data?.errors?.budget_limit?.[0] ?? 'Could not save budget.');
        } finally {
            setProcessing(false);
        }
    };

    const hasLimit = budget.limit > 0;
    const over = hasLimit && budget.percent >= 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="flex flex-wrap items-center gap-4 px-5 py-4"
        >
            <div className="flex items-center gap-4 sm:w-56 sm:shrink-0">
                <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${budget.color}1a`, color: budget.color }}
                >
                    <CategoryIcon icon={budget.icon} size={18} />
                </div>
                <div className="min-w-0">
                    <p className="font-medium text-white">{budget.name}</p>
                    {hasLimit ? (
                        <p className={`text-xs ${over ? 'text-rose-400' : 'text-slate-500'}`}>
                            {formatMoney(budget.remaining, currency)} left · {budget.percent}%
                        </p>
                    ) : (
                        <p className="text-xs text-slate-500">No budget set</p>
                    )}
                </div>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(budget.percent, 100)}%`, backgroundColor: over ? '#f43f5e' : budget.color }} />
                </div>
                <span className="w-24 text-right text-sm font-bold text-white tabular-nums">{formatMoney(budget.spent, currency)}</span>
            </div>

            <div className="flex items-center justify-end gap-2">
                {editing ? (
                    <div className="flex flex-col items-end gap-1">
                        <form onSubmit={save} className="flex items-center gap-2">
                            <input
                                autoFocus
                                type="number"
                                min="0"
                                step="0.01"
                                className="input w-28 !py-1.5 text-sm"
                                value={budgetLimit}
                                onChange={(e) => setBudgetLimit(e.target.value)}
                            />
                            <button type="submit" className="btn-primary !px-3 !py-1.5 text-sm" disabled={processing}>
                                Save
                            </button>
                            <button type="button" onClick={() => setEditing(false)} className="btn-ghost !px-2 !py-1.5">
                                <X size={14} />
                            </button>
                        </form>
                        {error ? <p className="text-xs text-rose-400">{error}</p> : null}
                    </div>
                ) : (
                    <button onClick={() => setEditing(true)} className="btn-ghost !px-2.5 !py-2">
                        <Edit2 size={15} />
                    </button>
                )}
            </div>
        </motion.div>
    );
}

export default function Budgets() {
    const { currency } = useApp();
    const { data, loading, error, run } = useApiData();

    useEffect(() => {
        run(() => api.get('/budgets'));
    }, [run]);

    const budgets = data?.budgets ?? [];
    const month = data?.month;
    const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const over = budgets.filter((b) => b.limit > 0 && b.spent > b.limit);

    const refetch = () => run(() => api.get('/budgets'));

    if (error && !data) {
        return (
            <AppLayout title="Budgets">
                <div className="card p-6 text-sm text-rose-400">Failed to load budgets.</div>
            </AppLayout>
        );
    }

    if (!data) {
        return (
            <AppLayout title="Budgets">
                <div className="flex items-center justify-center py-24">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Budgets">
            <PageHeader title="Budgets" subtitle={`Monthly limits for ${month}`} />

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
                <div className="card p-5">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Budgeted</p>
                    <p className="mt-1 text-2xl font-extrabold text-white tabular-nums"><AnimatedNumber value={totalLimit} format={(v) => formatMoney(v, currency)} /></p>
                </div>
                <div className="card p-5">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Spent</p>
                    <p className="mt-1 text-2xl font-extrabold text-rose-400 tabular-nums"><AnimatedNumber value={totalSpent} format={(v) => formatMoney(v, currency)} /></p>
                </div>
                <div className="card p-5">
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Over budget</p>
                    <p className={`mt-1 text-2xl font-extrabold tabular-nums ${over.length ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {over.length} categor{over.length === 1 ? 'y' : 'ies'}
                    </p>
                </div>
            </motion.div>

            {budgets.length === 0 ? (
                <EmptyState
                    icon="target"
                    title="No expense categories"
                    message="Create expense categories to set monthly budgets for them."
                    action={
                        <Link to="/categories" className="btn-primary"><Wallet size={16} /> Manage categories</Link>
                    }
                />
            ) : (
                <div className="card overflow-hidden">
                    <div className="divide-y divide-white/5">
                        {budgets.map((budget, index) => (
                            <BudgetRow key={budget.id} budget={budget} index={index} currency={currency} onSaved={refetch} />
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
