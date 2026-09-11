import { Stack } from 'expo-router';
import { useThemeColors } from '@/theme';

export default function MoreLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.ink950 },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="budgets" options={{ title: 'Budgets' }} />
      <Stack.Screen name="categories" options={{ title: 'Categories' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
    </Stack>
  );
}
