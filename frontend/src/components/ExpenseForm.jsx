import useApiForm from '../hooks/useApiForm';
import Modal from './Modal';
import { Field, Input, Select, ErrorText } from './Forms';
import { useApp } from '../context/AppContext';

export default function ExpenseForm({ show, onClose, expense, defaultMonth }) {
    const { categories } = useApp();
    const form = useApiForm(
        expense
            ? {
                  description: expense.description,
                  category_id: expense.category_id ?? '',
                  amount: expense.amount,
                  spent_on: expense.spent_on,
              }
            : {
                  description: '',
                  category_id: '',
                  amount: '',
                  spent_on: defaultMonth,
              },
    );

    const submit = (e) => {
        e.preventDefault();

        const options = { onSuccess: () => onClose() };

        if (expense) {
            form.patch(`/expenses/${expense.id}`, options);
        } else {
            form.post('/expenses', options);
        }
    };

    const expenseCategories = categories.filter((c) => c.type === 'expense');

    return (
        <Modal show={show} onClose={onClose} title={expense ? 'Edit expense' : 'Record expense'}>
            <form onSubmit={submit} className="space-y-4">
                <Field label="Description">
                    <Input
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder="e.g. Weekly groceries"
                    />
                    <ErrorText message={form.errors.description} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
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

                    <Field label="Spent on">
                        <Input
                            type="date"
                            value={form.data.spent_on}
                            onChange={(e) => form.setData('spent_on', e.target.value)}
                        />
                        <ErrorText message={form.errors.spent_on} />
                    </Field>
                </div>

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

                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} className="btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={form.processing}>
                        {form.processing ? 'Saving…' : expense ? 'Save changes' : 'Record expense'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
