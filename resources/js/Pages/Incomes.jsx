import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Pencil, Plus, Trash2, TrendingUp } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import MonthPicker from '@/Components/MonthPicker';
import IncomeForm from '@/Components/IncomeForm';
import CategoryIcon from '@/Components/CategoryIcon';
import EmptyState from '@/Components/EmptyState';
import AnimatedNumber from '@/Components/AnimatedNumber';
import { formatMoney } from '@/helpers/money';
import { formatDate } from '@/helpers/dates';

export default function Incomes({ incomes, month, total }) {
    const { currency } = usePage().props;
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const remove = (income) => {
        if (window.confirm(`Delete income "${income.source}"?`)) {
            router.delete(`/incomes/${income.id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout title="Income">
            <PageHeader
                title="Income"
                subtitle="Everything you earn, month by month"
                actions={
                    <>
                        <MonthPicker month={month} route="/incomes" />
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
                onClose={() => setFormOpen(false)}
                income={editing}
                defaultMonth={`${month}-${String(new Date().getDate()).padStart(2, '0')}`}
            />
        </AppLayout>
    );
}
