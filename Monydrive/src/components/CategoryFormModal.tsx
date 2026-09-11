import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '@/api/client';
import CategoryIcon from './CategoryIcon';
import { ChoiceField } from './fields';
import { BottomModal } from './Modal';
import { Button, Field } from './ui';
import { useToast } from '@/context/ToastContext';
import { useThemeColors } from '@/theme';

const ICON_OPTIONS = [
  'home', 'landmark', 'zap', 'flame', 'droplets', 'smartphone', 'wifi', 'shield-check',
  'heart-handshake', 'shopping-basket', 'shopping-cart', 'car', 'piggy-bank', 'tv',
  'tag', 'wallet', 'briefcase', 'store', 'trending-up', 'receipt', 'target', 'banknote',
];

const COLOR_OPTIONS = [
  '#8b5cf6', '#6366f1', '#38bdf8', '#22c55e', '#34d399', '#f59e0b',
  '#f97316', '#ef4444', '#ec4899', '#14b8a6', '#84cc16', '#a3e635',
];

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  budget_limit: number;
}

export default function CategoryFormModal({
  visible,
  onClose,
  editing,
  onSaved,
}: {
  visible: boolean;
  onClose: () => void;
  editing: Category | null;
  onSaved: (c: any, isNew: boolean) => void;
}) {
  const colors = useThemeColors();
  const { show } = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [icon, setIcon] = useState('tag');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [budgetLimit, setBudgetLimit] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editing) {
        setName(editing.name);
        setType(editing.type);
        setIcon(editing.icon);
        setColor(editing.color);
        setBudgetLimit(editing.budget_limit ? String(editing.budget_limit) : '');
      } else {
        setName('');
        setType('expense');
        setIcon('tag');
        setColor(COLOR_OPTIONS[0]);
        setBudgetLimit('');
      }
    }
  }, [visible, editing]);

  const submit = async () => {
    if (!name.trim()) {
      show('Name is required', 'error');
      return;
    }
    const payload: any = {
      name: name.trim(),
      type,
      icon,
      color,
    };
    if (budgetLimit.trim()) payload.budget_limit = parseFloat(budgetLimit);
    setSaving(true);
    try {
      if (editing) {
        const res = await api.patch(`/categories/${editing.id}`, payload);
        onSaved(res.data.category, false);
      } else {
        const res = await api.post('/categories', payload);
        onSaved(res.data.category, true);
      }
    } catch (e: any) {
      show(e?.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomModal visible={visible} onClose={onClose} title={editing ? 'Edit category' : 'New category'}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Field label="Name" value={name} onChangeText={setName} placeholder="e.g. Groceries" />
        <ChoiceField
          label="Type"
          value={type}
          onChange={(v) => setType(v as 'income' | 'expense')}
          options={[
            { label: 'Expense', value: 'expense' },
            { label: 'Income', value: 'income' },
          ]}
        />
        <Text style={[styles.label, { color: colors.slate400 }]}>Icon</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {ICON_OPTIONS.map((ic) => (
              <Pressable
                key={ic}
                onPress={() => setIcon(ic)}
                style={[iconBtn(colors), icon === ic && { borderColor: colors.violet, backgroundColor: 'rgba(139,92,246,0.18)' }]}
              >
                <CategoryIcon icon={ic} color={icon === ic ? colors.white : colors.slate400} size={18} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <Text style={[styles.label, { color: colors.slate400 }]}>Color</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          {COLOR_OPTIONS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotActive]}
            />
          ))}
        </View>
        <Field label="Budget limit (optional)" value={budgetLimit} onChangeText={setBudgetLimit} keyboardType="numeric" placeholder="0.00" />
        <Button title={editing ? 'Save changes' : 'Create category'} onPress={submit} loading={saving} />
      </KeyboardAvoidingView>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  colorDot: { width: 30, height: 30, borderRadius: 15 },
  colorDotActive: { borderWidth: 3, borderColor: '#fff' },
});

function iconBtn(colors: any) {
  return {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inputLine,
    backgroundColor: colors.inputBg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}