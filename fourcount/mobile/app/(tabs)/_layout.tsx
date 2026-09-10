import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { C } from '@/lib/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: { backgroundColor: C.bg, borderTopColor: C.line },
        tabBarLabelStyle: { fontSize: 11 },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="test" options={{ title: 'Test', tabBarIcon: ({ color }) => <Ionicons name="stopwatch-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color }) => <Ionicons name="trending-up-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} /> }} />
    </Tabs>
  );
}
