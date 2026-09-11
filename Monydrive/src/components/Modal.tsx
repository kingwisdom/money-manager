import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/theme';

export function BottomModal({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.ink850, paddingBottom: insets.bottom + 24 }]}
          onPress={() => {}}
        >
          <View style={styles.handle} />
          {title ? (
            <Text style={[styles.title, { color: colors.white }]}>{title}</Text>
          ) : null}
          <ScrollView keyboardShouldPersistTaps="handled" style={{ flexGrow: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.centerBackdrop}>
        <View style={[styles.dialog, { backgroundColor: colors.ink850 }]}>
          <Text style={[styles.title, { color: colors.white }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.slate400 }]}>{message}</Text>
          <View style={{ flexDirection: 'row', marginTop: 18 }}>
            <Pressable style={[styles.dialogBtn, { flex: 1 }]} onPress={onClose}>
              <Text style={{ color: colors.slate300, fontWeight: '600' }}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.dialogBtn, { flex: 1, backgroundColor: 'rgba(244,63,94,0.15)' }]}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.rose400} size="small" />
              ) : (
                <Text style={{ color: colors.rose400, fontWeight: '600' }}>{confirmLabel}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: '88%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(120,120,128,0.35)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  centerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  dialogBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
});