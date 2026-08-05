import { useEffect } from 'react';
import useApiForm from '../hooks/useApiForm';
import Modal from './Modal';
import { Field, Input, Select, Textarea, Toggle, ErrorText } from './Forms';
import { useApp } from '../context/AppContext';

const emptyForm = {
    name: '',
    category_id: '',
    amount: '',
    due_day: 1,
    frequency: 'monthly',
    due_month: 1,
    reminder_days: 3,
    auto_pay: false,
    active: true,
    notes: '',
};

export default function BillForm({ show, onClose, bill }) {
    const { categories } = useApp();

    const form = useApiForm(bill ? {
        name: bill.name,
        category_id: bill.category_id ?? '',
        amount: bill.amount,
        due_day: bill.due_day,
        frequency: bill.frequency,
        due_month: bill.due_month ?? 1,
        reminder_days: bill.reminder_days,
        auto_pay: Boolean(bill.auto_pay),
        active: Boolean(bill.active),
        notes: bill.notes ?? '',
    } : emptyForm);

    useEffect(() => {
        if (show && !bill) {
            form.reset();
            form.clearErrors();
        }
    }, [show, bill]);

    const expenseCategories = categories.filter((c) => c.type === 'expense');

    const submit = (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                onClose();
            },
        };

        if (bill) {
            form.patch(`/bills/${bill.id}`, options);
        } else {
            form.post('/bills', options);
        }
    };

    return (
        <Modal show={show} onClose={onClose} title={bill ? `Edit ${bill.name}` : 'Add a bill or subscription'}>
            <form onSubmit={submit} className="space-y-4">
                <Field label="Name">
                    <Input
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="e.g. House rent, Netflix, Electricity"
                    />
                    <ErrorText message={form.errors.name} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Category">
                        <Select
                            value={form.data.category_id}
                            onChange={(e) => form.setData('category_id', e.target.value)}
                        >
                            <option value="">Uncategorized</option>
                            {expenseCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label="Amount">
                        <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={form.data.amount}
                            onChange={(e) => form.setData('amount', e.target.value)}
                            placeholder="0.00"
                        />
                        <ErrorText message={form.errors.amount} />
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <Field label="Day due">
                        <Select
                            value={form.data.due_day}
                            onChange={(e) => form.setData('due_day', Number(e.target.value))}
                        >
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label="Frequency">
                        <Select
                            value={form.data.frequency}
                            onChange={(e) => form.setData('frequency', e.target.value)}
                        >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </Select>
                    </Field>

                    {form.data.frequency === 'yearly' ? (
                        <Field label="Month due">
                            <Select
                                value={form.data.due_month}
                                onChange={(e) => form.setData('due_month', Number(e.target.value))}
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                    <option key={month} value={month}>
                                        {new Date(2000, month - 1, 1).toLocaleDateString(undefined, { month: 'long' })}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                    ) : (
                        <Field label="Remind before">
                            <Select
                                value={form.data.reminder_days}
                                onChange={(e) => form.setData('reminder_days', Number(e.target.value))}
                            >
                                {[0, 1, 2, 3, 5, 7, 14].map((days) => (
                                    <option key={days} value={days}>
                                        {days === 0 ? 'On the day' : `${days} day${days === 1 ? '' : 's'}`}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                    )}
                </div>

                <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <Toggle
                        checked={form.data.auto_pay}
                        onChange={(v) => form.setData('auto_pay', v)}
                        label="Auto-pay"
                    />
                    <Toggle
                        checked={form.data.active}
                        onChange={(v) => form.setData('active', v)}
                        label="Active (keep tracking this bill)"
                    />
                </div>

                <Field label="Notes (optional)">
                    <Textarea
                        rows={2}
                        value={form.data.notes}
                        onChange={(e) => form.setData('notes', e.target.value)}
                        placeholder="Anything to remember about this bill"
                    />
                </Field>

                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} className="btn-secondary">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={form.processing}
                    >
                        {form.processing ? 'Saving…' : bill ? 'Save changes' : 'Add bill'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
