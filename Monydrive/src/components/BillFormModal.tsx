import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text } from 'react-native';
import { api, Category } from '@/api/client';
import CategoryPicker from './CategoryPicker';
import { ChoiceField, Toggle } from './fields';
import { BottomModal } from './Modal';
import { Button, Field } from './ui';
import { useToast } from '@/context/ToastContext';
import { useThemeColors } from '@/theme';

interface Bill {
  id: number;
  name: string;
  category_id: number | null;
  amount: number;
  due_day: number;
  due_month: number | null;
  frequency: 'monthly' | 'yearly';
  auto_pay: boolean;
  active: boolean;
  reminder_days: number;
  notes: string | null;
}

export default function BillFormModal({
  visible,
  onClose,
  editing,
  categories,
  currency,
  onSaved,
}: {
  visible: boolean;
  onClose: () => void;
  editing: Bill | null;
  categories: Category[];
  currency: string;
  onSaved: (bill: Bill, isNew: boolean) => void;
}) {
  const colors = useThemeColors();
  const { show } = useToast();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryLabel, setCategoryLabel] = useState('Select category');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [dueMonth, setDueMonth] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [autoPay, setAutoPay] = useState(false);
  const [active, setActive] = useState(true);
  const [reminderDays, setReminderDays] = useState('3');
  const [notes, setNotes] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editing) {
        setName(editing.name);
        setCategoryId(editing.category_id);
        const cat = categories.find((c) => c.id === editing.category_id);
        setCategoryLabel(cat?.name ?? 'Uncategorized');
        setAmount(String(editing.amount));
        setDueDay(String(editing.due_day));
        setDueMonth(editing.due_month ? String(editing.due_month) : '');
        setFrequency(editing.frequency);
        setAutoPay(editing.auto_pay);
        setActive(editing.active);
        setReminderDays(String(editing.reminder_days));
        setNotes(editing.notes ?? '');
      } else {
        setName('');
        setCategoryId(null);
        setCategoryLabel('Select category');
        setAmount('');
        setDueDay('');
        setDueMonth('');
        setFrequency('monthly');
        setAutoPay(false);
        setActive(true);
        setReminderDays('3');
        setNotes('');
      }
    }
  }, [visible, editing, categories]);

  const submit = async () => {
    if (!name.trim()) {
      show('Name is required', 'error');
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      show('Enter a valid amount', 'error');
      return;
    }
    const day = parseInt(dueDay, 10);
    if (!day || day < 1 || day > 31) {
      show('Due day must be 1-31', 'error');
      return;
    }
    const payload: any = {
      name: name.trim(),
      category_id: categoryId,
      amount: amt,
      due_day: day,
      frequency,
      auto_pay: autoPay,
      active: active,
      reminder_days: parseInt(reminderDays, 10) || 0,
      notes: notes.trim() || null,
    };
    if (dueMonth) payload.due_month = parseInt(dueMonth, 10);
    if (editing) payload.id = editing.id;

    setSaving(true);
    try {
      if (editing) {
        const res = await api.patch(`/bills/${editing.id}`, payload);
        onSaved(res.data.bill, false);
      } else {
        const res = await api.post('/bills', payload);
        onSaved(res.data.bill, true);
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
    <BottomModal visible={visible} onClose={onClose} title={editing ? 'Edit bill' : 'Add bill'}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Field label="Name" value={name} onChangeText={setName} placeholder="Netflix" />
        <Field
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
        />
        <>
          <Text style={{ color: colors.slate400, fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>Category</Text>
          <Button variant="secondary" title={categoryLabel} onPress={() => setPickerOpen(true)} style={{ marginBottom: 14 }} />
        </>
        <ChoiceField
          label="Frequency"
          value={frequency}
          onChange={(v) => setFrequency(v as 'monthly' | 'yearly')}
          options={[
            { label: 'Monthly', value: 'monthly' },
            { label: 'Yearly', value: 'yearly' },
          ]}
        />
        <Field label="Due day (1-31)" value={dueDay} onChangeText={setDueDay} keyboardType="numeric" placeholder="15" />
        {frequency === 'yearly' ? <Field label="Due month (1-12)" value={dueMonth} onChangeText={setDueMonth} keyboardType="numeric" placeholder="7" /> : null}
        <Field label="Reminder days before" value={reminderDays} onChangeText={setReminderDays} keyboardType="numeric" placeholder="3" />
        <Toggle label="Auto-pay" value={autoPay} onChange={setAutoPay} />
        <Toggle label="Active" value={active} onChange={setActive} />
        <Field label="Notes (optional)" value={notes} onChangeText={setNotes} multiline placeholder="Any notes" />
        <Button title={editing ? 'Save changes' : 'Create bill'} onPress={submit} loading={saving} />
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