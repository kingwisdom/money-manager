import useApiForm from '../hooks/useApiForm';
import Modal from './Modal';
import CategoryIcon from './CategoryIcon';
import { Field, Input, Select, ErrorText } from './Forms';

const ICONS = [
    'home', 'landmark', 'zap', 'flame', 'droplets', 'smartphone', 'wifi',
    'shield-check', 'heart-handshake', 'shopping-basket', 'shopping-cart',
    'car', 'piggy-bank', 'tv', 'tag', 'wallet', 'briefcase', 'store',
    'trending-up', 'plus-circle', 'check-circle', 'alert', 'banknote',
];

const COLORS = [
    '#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#22c55e',
    '#f59e0b', '#f97316', '#ef4444', '#ec4899', '#a855f7', '#64748b',
];

export default function CategoryForm({ show, onClose, category }) {
    const form = useApiForm(
        category
            ? {
                  name: category.name,
                  type: category.type,
                  icon: category.icon,
                  color: category.color,
                  budget_limit: category.budget_limit > 0 ? category.budget_limit : '',
              }
            : {
                  name: '',
                  type: 'expense',
                  icon: 'tag',
                  color: '#8b5cf6',
                  budget_limit: '',
              },
    );

    const submit = (e) => {
        e.preventDefault();

        const options = { onSuccess: () => onClose() };

        if (category) {
            form.patch(`/categories/${category.id}`, options);
        } else {
            form.post('/categories', options);
        }
    };

    const isExpense = form.data.type === 'expense';

    return (
        <Modal show={show} onClose={onClose} title={category ? 'Edit category' : 'New category'}>
            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Name">
                        <Input
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="e.g. Groceries"
                        />
                        <ErrorText message={form.errors.name} />
                    </Field>

                    <Field label="Type">
                        <Select value={form.data.type} onChange={(e) => form.setData('type', e.target.value)}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </Select>
                        <ErrorText message={form.errors.type} />
                    </Field>
                </div>

                <Field label="Icon">
                    <div className="grid grid-cols-6 gap-2">
                        {ICONS.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => form.setData('icon', icon)}
                                className={`flex h-10 items-center justify-center rounded-lg border transition-colors ${
                                    form.data.icon === icon
                                        ? 'border-violet-500 bg-violet-500/15 text-violet-300'
                                        : 'border-white/5 bg-white/5 text-slate-400 hover:text-white'
                                }`}
                            >
                                <CategoryIcon icon={icon} size={17} />
                            </button>
                        ))}
                    </div>
                    <ErrorText message={form.errors.icon} />
                </Field>

                <Field label="Color">
                    <div className="flex flex-wrap gap-2">
                        {COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => form.setData('color', color)}
                                className={`h-7 w-7 rounded-full transition-transform ${form.data.color === color ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <ErrorText message={form.errors.color} />
                </Field>

                {isExpense && (
                    <Field label="Monthly budget limit (optional)">
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.data.budget_limit}
                            onChange={(e) => form.setData('budget_limit', e.target.value)}
                            placeholder="e.g. 500"
                        />
                        <ErrorText message={form.errors.budget_limit} />
                    </Field>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} className="btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={form.processing}>
                        {form.processing ? 'Saving…' : category ? 'Save changes' : 'Create category'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
