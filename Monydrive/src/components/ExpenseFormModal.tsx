import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text } from 'react-native';
import { api, Category } from '@/api/client';
import CategoryPicker from './CategoryPicker';
import { DateField } from './fields';
import { BottomModal } from './Modal';
import { Button, Field } from './ui';
import { useToast } from '@/context/ToastContext';
import { useThemeColors } from '@/theme';
import { todayISO } from '@/utils/dates';

interface Expense {
  id: number;
  description: string;
  category_id: number | null;
  amount: number;
  spent_on: string;
  category?: { id: number; name: string; color: string; icon: string } | null;
}

export default function ExpenseFormModal({
  visible,
  onClose,
  editing,
  categories,
  onSaved,
}: {
  visible: boolean;
  onClose: () => void;
  editing: Expense | null;
  categories: Category[];
  onSaved: (expense: any, isNew: boolean) => void;
}) {
  const colors = useThemeColors();
  const { show } = useToast();
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryLabel, setCategoryLabel] = useState('Select category');
  const [amount, setAmount] = useState('');
  const [spentOn, setSpentOn] = useState(todayISO());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editing) {
        setDescription(editing.description);
        setCategoryId(editing.category_id);
        const cat = categories.find((c) => c.id === editing.category_id);
        setCategoryLabel(cat?.name ?? 'Uncategorized');
        setAmount(String(editing.amount));
        setSpentOn(editing.spent_on);
      } else {
        setDescription('');
        setCategoryId(null);
        setCategoryLabel('Select category');
        setAmount('');
        setSpentOn(todayISO());
      }
    }
  }, [visible, editing, categories]);

  const submit = async () => {
    if (!description.trim()) {
      show('Description is required', 'error');
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      show('Enter a valid amount', 'error');
      return;
    }
    const payload = {
      description: description.trim(),
      category_id: categoryId,
      amount: amt,
      spent_on: spentOn,
    };
    setSaving(true);
    try {
      if (editing) {
        const res = await api.patch(`/expenses/${editing.id}`, payload);
        onSaved(res.data.expense, false);
      } else {
        const res = await api.post('/expenses', payload);
        onSaved(res.data.expense, true);
      }
    } catch (e: any) {
      show(e?.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const onPickCategory = (id: number, name: string) => {
    setCategoryId(id);
    setCategoryLabel(name);
  };

  return (
    <BottomModal visible={visible} onClose={onClose} title={editing ? 'Edit expense' : 'Add expense'}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Field label="Description" value={description} onChangeText={setDescription} placeholder="Groceries" />
        <>
          <Text style={{ color: colors.slate400, fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>Category</Text>
          <Button variant="secondary" title={categoryLabel} onPress={() => setPickerOpen(true)} style={{ marginBottom: 14 }} />
        </>
        <Field label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0.00" />
        <DateField label="Date" value={spentOn} onChange={setSpentOn} />
        <Button title={editing ? 'Save changes' : 'Record expense'} onPress={submit} loading={saving} />
      </KeyboardAvoidingView>
      <CategoryPicker
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        categories={categories}
        value={categoryId}
        onSelect={onPickCategory}
      />
    </BottomModal>
  );
}