import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCheck, Pencil, Plus, Trash2, Undo2, Zap } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import PageHeader from '../components/PageHeader';
import BillForm from '../components/BillForm';
import StatusBadge from '../components/StatusBadge';
import Countdown from '../components/Countdown';
import CategoryIcon from '../components/CategoryIcon';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { formatMoney } from '../helpers/money';
import { formatDate } from '../helpers/dates';
import { useApp } from '../context/AppContext';
import { pushToast } from '../store/toastStore';
import useApiData from '../hooks/useApiData';
import api from '../api/client';

export default function Bills() {
    const { currency } = useApp();
    const { data, loading, error, run } = useApiData();
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [paying, setPaying] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const load = () => run(() => api.get('/bills'));

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (bill) => {
        setEditing(bill);
        setFormOpen(true);
    };

    const confirmPay = async () => {
        if (!paying) return;

        try {
            const { data: response } = await api.post(`/bills/${paying.id}/pay`, { bill_id: paying.id });

            pushToast({ type: 'success', title: response.message ?? 'Marked as paid' });
            setPaying(null);
            load();
        } catch (err) {
            pushToast({ type: 'error', title: 'Could not mark as paid', message: err.response?.data?.message });
        }
    };

    const undoPayment = async (bill) => {
        if (!bill.last_payment_id) return;

        if (window.confirm(`Undo the last payment for "${bill.name}"?`)) {
            try {
                await api.delete(`/payments/${bill.last_payment_id}`);

                pushToast({ type: 'success', title: 'Payment undone' });
                load();
            } catch (err) {
                pushToast({ type: 'error', title: 'Could not undo payment', message: err.response?.data?.message });
            }
        }
    };

    const confirmDelete = async () => {
        if (!deleting) return;

        try {
            await api.delete(`/bills/${deleting.id}`);

            pushToast({ type: 'success', title: 'Bill deleted' });
            setDeleting(null);
            load();
        } catch (err) {
            pushToast({ type: 'error', title: 'Could not delete bill', message: err.response?.data?.message });
        }
    };

    if (loading && !data) {
        return (
            <AppLayout title="Bills">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                </div>
            </AppLayout>
        );
    }

    if (error && !data) {
        return (
            <AppLayout title="Bills">
                <div className="card p-6 text-sm text-rose-400">
                    Something went wrong loading your bills.
                </div>
            </AppLayout>
        );
    }

    const bills = data.bills;
    const activeBills = bills.filter((bill) => bill.active);
    const inactiveBills = bills.filter((bill) => !bill.active);

    return (
        <AppLayout title="Bills">
            <PageHeader
                title="Bills & subscriptions"
                subtitle="Recurring payments with live countdowns to each due date"
                actions={
                    <button onClick={openCreate} className="btn-primary">
                        <Plus size={16} /> Add bill
                    </button>
                }
            />

            <div className="space-y-8">
                <div className="grid gap-4 lg:grid-cols-2">
                    {activeBills.map((bill, index) => {
                        const overdue = bill.due.days < 0;
                        const urgent = !overdue && bill.due.days <= (bill.reminder_days ?? 3);

                        return (
                            <motion.div
                                key={bill.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.35 }}
                                className={`card card-hover p-5 ${
                                    overdue
                                        ? 'border-rose-500/25'
                                        : urgent
                                          ? 'border-amber-500/20'
                                          : ''
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-xl"
                                            style={{
                                                backgroundColor: `${bill.category?.color ?? '#8b5cf6'}1a`,
                                                color: bill.category?.color ?? '#8b5cf6',
                                            }}
                                        >
                                            <CategoryIcon icon={bill.category?.icon ?? 'tag'} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{bill.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {bill.category?.name ?? 'Uncategorized'} ·{' '}
                                                {bill.frequency === 'yearly' ? 'Yearly' : 'Monthly'}
                                            </p>
                                        </div>
                                    </div>
                                    <StatusBadge status={bill.due} />
                                </div>

                                <div className="mt-4 flex items-end justify-between">
                                    <div>
                                        <p className="text-2xl font-extrabold text-white tabular-nums">
                                            {formatMoney(bill.amount, currency)}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                            {bill.auto_pay ? (
                                                <>
                                                    <Zap size={12} className="text-amber-400" /> Auto-pay
                                                </>
                                            ) : (
                                                <>Due on the {bill.due_day}
                                                    {bill.due_month ? `/${bill.due_month}` : ''}</>
                                            )}
                                            {bill.last_paid ? ` · Last paid ${formatDate(bill.last_paid)}` : ''}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        {overdue ? (
                                            <p className="text-sm font-bold text-rose-400">
                                                {Math.abs(bill.due.days)} day
                                                {Math.abs(bill.due.days) === 1 ? '' : 's'} overdue
                                            </p>
                                        ) : (
                                            <Countdown nextDue={bill.due.next_due} urgent={urgent} />
                                        )}
                                    </div>
                                </div>

                                {bill.notes ? (
                                    <p className="mt-3 rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
                                        {bill.notes}
                                    </p>
                                ) : null}

                                <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4">
                                    <button
                                        onClick={() => setPaying(bill)}
                                        className="btn-primary flex-1 !py-2 text-xs"
                                    >
                                        <CheckCheck size={15} /> Mark as paid
                                    </button>
                                    {bill.last_payment_id ? (
                                        <button
                                            onClick={() => undoPayment(bill)}
                                            title="Undo last payment"
                                            className="btn-secondary !px-3 !py-2"
                                        >
                                            <Undo2 size={15} />
                                        </button>
                                    ) : null}
                                    <button onClick={() => openEdit(bill)} className="btn-secondary !px-3 !py-2">
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={() => setDeleting(bill)}
                                        className="btn-danger !px-3 !py-2"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {activeBills.length === 0 ? (
                    <EmptyState
                        icon="receipt"
                        title="No active bills"
                        message="Add your rent, subscriptions, utilities and more — the app will count down to every due date and remind you."
                        action={
                            <button onClick={openCreate} className="btn-primary">
                                <Plus size={16} /> Add your first bill
                            </button>
                        }
                    />
                ) : null}

                {inactiveBills.length > 0 ? (
                    <div>
                        <h2 className="mb-3 text-sm font-bold tracking-wider text-slate-500 uppercase">
                            Paused bills
                        </h2>
                        <div className="grid gap-4 lg:grid-cols-2">
                            {inactiveBills.map((bill) => (
                                <div key={bill.id} className="card flex items-center gap-4 p-5 opacity-70">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                                        style={{
                                            backgroundColor: `${bill.category?.color ?? '#8b5cf6'}1a`,
                                            color: bill.category?.color ?? '#8b5cf6',
                                        }}
                                    >
                                        <CategoryIcon icon={bill.category?.icon ?? 'tag'} size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-white">{bill.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {formatMoney(bill.amount, currency)} · paused
                                        </p>
                                    </div>
                                    <button onClick={() => openEdit(bill)} className="btn-secondary !py-2">
                                        <Pencil size={15} /> Resume
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            <BillForm show={formOpen} onClose={() => { setFormOpen(false); load(); }} bill={editing} />

            <Modal show={Boolean(paying)} onClose={() => setPaying(null)} title="Mark as paid" maxWidth="max-w-sm">
                <p className="text-sm text-slate-300">
                    Mark <span className="font-semibold text-white">{paying?.name}</span> as paid today (
                    {formatDate(new Date())})? This records an expense and advances the countdown.
                </p>
                <div className="mt-5 flex justify-end gap-2">
                    <button onClick={() => setPaying(null)} className="btn-secondary">
                        Cancel
                    </button>
                    <button onClick={confirmPay} className="btn-primary">
                        Yes, mark paid
                    </button>
                </div>
            </Modal>

            <Modal show={Boolean(deleting)} onClose={() => setDeleting(null)} title="Delete bill" maxWidth="max-w-sm">
                <p className="text-sm text-slate-300">
                    Delete <span className="font-semibold text-white">{deleting?.name}</span>? This cannot be undone.
                </p>
                <div className="mt-5 flex justify-end gap-2">
                    <button onClick={() => setDeleting(null)} className="btn-secondary">
                        Cancel
                    </button>
                    <button onClick={confirmDelete} className="btn-danger">
                        <Trash2 size={15} /> Delete
                    </button>
                </div>
            </Modal>
        </AppLayout>
    );
}
