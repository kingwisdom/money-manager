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

interface Income {
  id: number;
  source: string;
  category_id: number | null;
  amount: number;
  received_on: string;
  category?: { id: number; name: string; color: string; icon: string } | null;
}

export default function IncomeFormModal({
  visible,
  onClose,
  editing,
  categories,
  onSaved,
}: {
  visible: boolean;
  onClose: () => void;
  editing: Income | null;
  categories: Category[];
  onSaved: (income: any, isNew: boolean) => void;
}) {
  const colors = useThemeColors();
  const { show } = useToast();
  const [source, setSource] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryLabel, setCategoryLabel] = useState('Select category');
  const [amount, setAmount] = useState('');
  const [receivedOn, setReceivedOn] = useState(todayISO());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editing) {
        setSource(editing.source);
        setCategoryId(editing.category_id);
        const cat = categories.find((c) => c.id === editing.category_id);
        setCategoryLabel(cat?.name ?? 'Uncategorized');
        setAmount(String(editing.amount));
        setReceivedOn(editing.received_on);
      } else {
        setSource('');
        setCategoryId(null);
        setCategoryLabel('Select category');
        setAmount('');
        setReceivedOn(todayISO());
      }
    }
  }, [visible, editing, categories]);

  const submit = async () => {
    if (!source.trim()) {
      show('Source is required', 'error');
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      show('Enter a valid amount', 'error');
      return;
    }
    const payload = {
      source: source.trim(),
      category_id: categoryId,
      amount: amt,
      received_on: receivedOn,
    };
    setSaving(true);
    try {
      if (editing) {
        const res = await api.patch(`/incomes/${editing.id}`, payload);
        onSaved(res.data.income, false);
      } else {
        const res = await api.post('/incomes', payload);
        onSaved(res.data.income, true);
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
    <BottomModal visible={visible} onClose={onClose} title={editing ? 'Edit income' : 'Add income'}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Field label="Source" value={source} onChangeText={setSource} placeholder="Salary" />
        <>
          <Text style={{ color: colors.slate400, fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>Category</Text>
          <Button variant="secondary" title={categoryLabel} onPress={() => setPickerOpen(true)} style={{ marginBottom: 14 }} />
        </>
        <Field label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0.00" />
        <DateField label="Date received" value={receivedOn} onChange={setReceivedOn} />
        <Button title={editing ? 'Save changes' : 'Record income'} onPress={submit} loading={saving} />
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