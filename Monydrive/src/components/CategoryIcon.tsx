import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ionMap: Record<string, string> = {
  home: 'home-outline',
  landmark: 'business-outline',
  zap: 'flash-outline',
  flame: 'flame-outline',
  droplets: 'water-outline',
  smartphone: 'phone-portrait-outline',
  wifi: 'wifi-outline',
  'shield-check': 'shield-checkmark-outline',
  'heart-handshake': 'heart-circle-outline',
  'shopping-basket': 'basket-outline',
  'shopping-cart': 'cart-outline',
  car: 'car-outline',
  'piggy-bank': 'piggy-bank-outline',
  tv: 'tv-outline',
  tag: 'pricetag-outline',
  wallet: 'wallet-outline',
  briefcase: 'briefcase-outline',
  store: 'storefront-outline',
  'trending-up': 'trending-up-outline',
  'plus-circle': 'add-circle-outline',
  'check-circle': 'checkmark-circle-outline',
  alert: 'alert-circle-outline',
  banknote: 'cash-outline',
  receipt: 'receipt-outline',
  target: 'locate-outline',
  bell: 'notifications-outline',
};

const materialMap: Record<string, string> = {
  bank: 'bank',
};

export function iconFor(icon: string): string {
  return ionMap[icon] || 'pricetag-outline';
}

export function isMaterial(icon: string): boolean {
  return !!materialMap[icon];
}

export default function CategoryIcon({
  icon,
  size = 18,
  color,
}: {
  icon?: string;
  size?: number;
  color?: string;
}) {
  const key = icon || 'tag';
  const inner = isMaterial(key) ? (
    <MaterialCommunityIcons name={materialMap[key] as any} size={size} color={color} />
  ) : (
    <Ionicons name={iconFor(key) as any} size={size} color={color} />
  );
  return <View style={styles.container}>{inner}</View>;
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
});