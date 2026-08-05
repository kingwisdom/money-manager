import useApiForm from '../hooks/useApiForm';
import Modal from './Modal';
import { Field, Input, Select, ErrorText } from './Forms';
import { useApp } from '../context/AppContext';

export default function IncomeForm({ show, onClose, income, defaultMonth }) {
    const { categories } = useApp();
    const form = useApiForm(
        income
            ? {
                  source: income.source,
                  category_id: income.category_id ?? '',
                  amount: income.amount,
                  received_on: income.received_on,
              }
            : {
                  source: '',
                  category_id: '',
                  amount: '',
                  received_on: defaultMonth,
              },
    );

    const submit = (e) => {
        e.preventDefault();

        const options = { onSuccess: () => onClose() };

        if (income) {
            form.patch(`/incomes/${income.id}`, options);
        } else {
            form.post('/incomes', options);
        }
    };

    const incomeCategories = categories.filter((c) => c.type === 'income');

    return (
        <Modal show={show} onClose={onClose} title={income ? 'Edit income' : 'Record income'}>
            <form onSubmit={submit} className="space-y-4">
                <Field label="Source">
                    <Input
                        value={form.data.source}
                        onChange={(e) => form.setData('source', e.target.value)}
                        placeholder="e.g. Salary, Freelance, Business"
                    />
                    <ErrorText message={form.errors.source} />
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

                    <Field label="Received on">
                        <Input
                            type="date"
                            value={form.data.received_on}
                            onChange={(e) => form.setData('received_on', e.target.value)}
                        />
                        <ErrorText message={form.errors.received_on} />
                    </Field>
                </div>

                <Field label="Category">
                    <Select
                        value={form.data.category_id}
                        onChange={(e) => form.setData('category_id', e.target.value)}
                    >
                        <option value="">Uncategorized</option>
                        {incomeCategories.map((category) => (
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
                        {form.processing ? 'Saving…' : income ? 'Save changes' : 'Record income'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
