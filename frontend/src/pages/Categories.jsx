import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import api from '@/api/client';
import AppLayout from '@/layouts/AppLayout';
import PageHeader from '@/components/PageHeader';
import CategoryForm from '@/components/CategoryForm';
import CategoryIcon from '@/components/CategoryIcon';
import EmptyState from '@/components/EmptyState';
import useApiData from '@/hooks/useApiData';
import { useApp } from '@/context/AppContext';
import { pushToast } from '@/store/toastStore';
import { formatMoney } from '@/helpers/money';

function CategoryRow({ category, index, onEdit, onDelete, currency }) {
    const remove = () => {
        const inUse = category.bills_count > 0;
        const confirmMessage = inUse
            ? `Delete "${category.name}"? It has ${category.bills_count} linked bill${category.bills_count === 1 ? '' : 's'}.`
            : `Delete category "${category.name}"?`;
        if (window.confirm(confirmMessage)) {
            onDelete(category);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="flex items-center gap-4 px-5 py-4"
        >
            <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${category.color}1a`, color: category.color }}
            >
                <CategoryIcon icon={category.icon} size={18} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{category.name}</p>
                <p className="text-xs text-slate-500">
                    {category.type === 'expense'
                        ? `${category.bills_count} bill${category.bills_count === 1 ? '' : 's'} linked`
                        : 'Income category'}
                </p>
            </div>
            {category.type === 'expense' && (
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-white tabular-nums">{formatMoney(category.spent_this_month, currency)}</p>
                    <p className="text-xs text-slate-500">
                        {category.budget_limit > 0 ? `budget ${formatMoney(category.budget_limit, currency)}` : 'spent this month'}
                    </p>
                </div>
            )}
            <div className="flex items-center gap-1">
                <button onClick={() => onEdit(category)} className="btn-ghost !px-2.5 !py-2">
                    <Pencil size={15} />
                </button>
                <button onClick={remove} className="btn-ghost !px-2.5 !py-2 text-rose-400">
                    <Trash2 size={15} />
                </button>
            </div>
        </motion.div>
    );
}

export default function Categories() {
    const { currency, refreshBootstrap } = useApp();
    const { data, loading, error, run } = useApiData();
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        run(() => api.get('/categories'));
    }, [run]);

    const categories = data?.categories ?? [];
    const expense = categories.filter((c) => c.type === 'expense');
    const income = categories.filter((c) => c.type === 'income');

    const closeForm = () => {
        setFormOpen(false);
        setEditing(null);
        refreshBootstrap();
        run(() => api.get('/categories'));
    };

    const deleteCategory = async (category) => {
        try {
            await api.delete(`/categories/${category.id}`);
            pushToast({ type: 'success', title: 'Category deleted', message: `Deleted "${category.name}".` });
            refreshBootstrap();
            run(() => api.get('/categories'));
        } catch {}
    };

    const section = (title, items) =>
        items.length === 0 ? null : (
            <div className="card overflow-hidden">
                <h3 className="px-5 pt-5 pb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</h3>
                <div className="divide-y divide-white/5 pb-2">
                    {items.map((category, index) => (
                        <CategoryRow key={category.id} category={category} index={index} currency={currency} onEdit={(c) => { setEditing(c); setFormOpen(true); }} onDelete={deleteCategory} />
                    ))}
                </div>
            </div>
        );

    if (error && !data) {
        return (
            <AppLayout title="Categories">
                <div className="card p-6 text-sm text-rose-400">Failed to load categories.</div>
            </AppLayout>
        );
    }

    if (!data) {
        return (
            <AppLayout title="Categories">
                <div className="flex items-center justify-center py-24">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Categories">
            <PageHeader
                title="Categories"
                subtitle="Organize your money into buckets"
                actions={
                    <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary">
                        <Plus size={16} /> New category
                    </button>
                }
            />

            {categories.length === 0 ? (
                <EmptyState
                    icon="tag"
                    title="No categories yet"
                    message="Create expense and income categories to organize your transactions."
                    action={
                        <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary">
                            <Plus size={16} /> New category
                        </button>
                    }
                />
            ) : (
                <div className="space-y-6">
                    {section('Expenses', expense)}
                    {section('Income', income)}
                </div>
            )}

            <CategoryForm
                show={formOpen}
                onClose={closeForm}
                category={editing}
            />
        </AppLayout>
    );
}
