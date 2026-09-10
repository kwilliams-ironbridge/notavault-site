import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { C } from '@/lib/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={s.container}>
        <Text style={s.title}>This screen does not exist.</Text>
        <Link href="/" style={s.link}>Back to Today</Link>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: C.bg },
  title: { fontSize: 20, fontWeight: '700', color: C.text },
  link: { marginTop: 15, paddingVertical: 15, color: C.accent },
});
