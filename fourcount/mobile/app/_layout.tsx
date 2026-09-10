import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AppProvider, useApp } from '@/lib/store';
import { C } from '@/lib/theme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return (
    <AppProvider>
      <Gate />
    </AppProvider>
  );
}

function Gate() {
  const { ready, state } = useApp();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync();
    const inOnboarding = segments[0] === 'onboarding';
    if (!state.onboarded && !inOnboarding) router.replace('/onboarding');
  }, [ready, state.onboarded, segments, router]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="session" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
