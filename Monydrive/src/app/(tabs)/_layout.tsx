import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { useThemeColors } from '@/theme';

const tabIcons: Record<string, [string, string]> = {
  index: ['home-outline', 'home'],
  bills: ['receipt-outline', 'receipt'],
  expenses: ['card-outline', 'card'],
  incomes: ['trending-up-outline', 'trending-up'],
  more: ['ellipsis-horizontal-outline', 'ellipsis-horizontal'],
};

export default function TabsLayout() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.violet,
        tabBarInactiveTintColor: colors.slate500,
        tabBarStyle: {
          backgroundColor: colors.ink900,
          borderTopColor: colors.cardLine,
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10),
        },
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color, size, focused }) => {
          const [outline, filled] = tabIcons[route.name];
          return <Ionicons name={(focused ? filled : outline) as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="bills" options={{ title: 'Bills' }} />
      <Tabs.Screen name="expenses" options={{ title: 'Expenses' }} />
      <Tabs.Screen name="incomes" options={{ title: 'Incomes' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, fontWeight: '600' },
});