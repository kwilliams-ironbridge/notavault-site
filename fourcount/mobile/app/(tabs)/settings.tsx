import { useRouter } from 'expo-router';
import { Alert, Linking, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Eyebrow, H1, Tiny } from '@/components/ui';
import { PRIVACY_URL, TERMS_URL } from '@/config/env';
import { restore } from '@/lib/purchases';
import { disableReminder, enableReminder } from '@/lib/reminders';
import { useApp } from '@/lib/store';
import { C } from '@/lib/theme';

export default function Settings() {
  const { state, update, reset } = useApp();
  const router = useRouter();

  const toggleReminder = async (on: boolean) => {
    if (on) {
      const ok = await enableReminder();
      update({ remind: ok });
      if (!ok) Alert.alert('Notifications are off', 'Allow notifications for FourCount in iOS Settings to use the daily reminder.');
    } else {
      await disableReminder();
      update({ remind: false });
    }
  };

  const doRestore = async () => {
    const r = await restore();
    if (r.ok) update({ pro: true });
    else Alert.alert('Nothing to restore', r.reason ?? '');
  };

  const Row = ({ title, sub, right }: { title: string; sub: string; right: React.ReactNode }) => (
    <View style={s.row}>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{title}</Text>
        <Tiny>{sub}</Tiny>
      </View>
      {right}
    </View>
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.body}>
        <Eyebrow>Settings</Eyebrow>
        <H1>Settings</H1>
        <Card>
          <Row title="Daily reminder" sub="8:00 pm, local time" right={<Switch value={state.remind} onValueChange={toggleReminder} trackColor={{ true: C.accentDim }} thumbColor={state.remind ? C.accent : C.muted} />} />
          <View style={s.sep} />
          <Row title="Haptic cues" sub="A tap on each phase change" right={<Switch value={state.haptics} onValueChange={(v) => update({ haptics: v })} trackColor={{ true: C.accentDim }} thumbColor={state.haptics ? C.accent : C.muted} />} />
        </Card>
        <Card>
          <Row title="FourCount Pro" sub={state.pro ? 'Pro. Weeks 2 to 4 and re-tests unlocked.' : 'Free plan. Week 1 and baseline included.'} right={!state.pro ? <Button title="Upgrade" kind="ghost" style={{ minHeight: 44 }} onPress={() => router.push('/paywall')} /> : null} />
          <View style={s.sep} />
          <Button title="Restore Purchases" kind="quiet" onPress={doRestore} />
        </Card>
        <Card>
          <Button title="Privacy Policy" kind="quiet" onPress={() => Linking.openURL(PRIVACY_URL)} />
          <Button title="Terms of Use" kind="quiet" onPress={() => Linking.openURL(TERMS_URL)} />
          <Button title="Reset all data" kind="quiet" style={{ marginTop: 4 }} onPress={() => Alert.alert('Reset all data?', 'Every drill and test on this device is deleted.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => void reset() }])} />
        </Card>
        <Tiny style={{ marginTop: 16 }}>FourCount 1.0. Data stays on this device. Not a medical device. Not affiliated with any agency or unit.</Tiny>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { padding: 22, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 2 },
  sep: { height: 1, backgroundColor: C.line, marginVertical: 12 },
});
