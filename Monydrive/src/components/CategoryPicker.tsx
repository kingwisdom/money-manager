import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Category } from '@/api/client';
import { BottomModal } from './Modal';
import CategoryIcon from './CategoryIcon';
import { useThemeColors } from '@/theme';

export default function CategoryPicker({
  visible,
  onClose,
  categories,
  value,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  value: number | null;
  onSelect: (id: number, name: string, color: string, icon: string) => void;
}) {
  const colors = useThemeColors();
  return (
    <BottomModal visible={visible} onClose={onClose} title="Select category">
      <View>
        {categories.map((item: any) => {
          const selected = value === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                onSelect(item.id, item.name, item.color, item.icon);
                onClose();
              }}
              style={[styles.row, selected && { backgroundColor: 'rgba(139,92,246,0.15)' }]}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${item.color}1a`, alignItems: 'center', justifyContent: 'center' }}>
                <CategoryIcon icon={item.icon} color={item.color} size={17} />
              </View>
              <Text style={{ flex: 1, marginLeft: 12, color: selected ? colors.white : colors.slate300, fontWeight: selected ? '600' : '400', fontSize: 14 }}>
                {item.name}
              </Text>
              {selected ? <Ionicons name="checkmark" size={18} color={colors.violet} /> : null}
            </Pressable>
          );
        })}
      </View>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 2,
  },
});