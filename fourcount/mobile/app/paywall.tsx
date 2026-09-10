import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Eyebrow, H1, P, Tiny } from '@/components/ui';
import { PRIVACY_URL, TERMS_URL } from '@/config/env';
import { PRICES, purchase, restore, type Plan } from '@/lib/purchases';
import { useApp } from '@/lib/store';
import { C, MONO } from '@/lib/theme';

// Every element App Review checks lives on this screen (Lessons Learned 3.4):
// name, what it unlocks, period, price, per-unit price, renewal disclosure,
// Terms, Privacy, Restore. Reachable in 2 taps: Settings > Upgrade.
export default function Paywall() {
  const { update } = useApp();
  const router = useRouter();
  const [plan, setPlan] = useState<Plan>('annual');

  const buy = async () => {
    const r = await purchase(plan);
    if (r.ok) {
      update({ pro: true });
      router.back();
    } else Alert.alert('Purchase unavailable', r.reason ?? '');
  };
  const doRestore = async () => {
    const r = await restore();
    if (r.ok) {
      update({ pro: true });
      router.back();
    } else Alert.alert('Nothing to restore', r.reason ?? '');
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.body}>
        <Eyebrow>FourCount Pro</Eyebrow>
        <H1>Weeks 2 to 4, and every re-test.</H1>
        <P>The autonomic base, the box ladder to a 6-count, the down-shift program, and weekly measurements that keep the graph moving.</P>
        {(['annual', 'monthly'] as Plan[]).map((k) => (
          <Pressable key={k} onPress={() => setPlan(k)} accessibilityRole="radio" accessibilityState={{ selected: plan === k }} style={[s.plan, plan === k && { borderColor: C.accent }]}>
            <View style={{ flex: 1 }}>
              <Text style={s.planTitle}>{PRICES[k].label}</Text>
              <Tiny>{PRICES[k].sub}</Tiny>
            </View>
            <Text style={s.price}>{PRICES[k].price}</Text>
          </Pressable>
        ))}
        <Button title={plan === 'annual' ? 'Start free trial' : 'Continue'} style={{ marginTop: 18 }} onPress={buy} />
        <Tiny style={{ marginTop: 14 }}>
          Payment is charged to your Apple ID at confirmation. The subscription renews automatically unless cancelled at least 24 hours before the end of the current period. Manage or cancel in Settings on your device.
        </Tiny>
        <View style={s.links}>
          <Pressable onPress={() => Linking.openURL(PRIVACY_URL)}><Text style={s.link}>Privacy Policy</Text></Pressable>
          <Pressable onPress={() => Linking.openURL(TERMS_URL)}><Text style={s.link}>Terms of Use</Text></Pressable>
          <Pressable onPress={doRestore}><Text style={s.link}>Restore Purchases</Text></Pressable>
        </View>
        <Button title="Not now" kind="quiet" style={{ marginTop: 8 }} onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { padding: 22, paddingBottom: 40 },
  plan: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 18, marginTop: 12 },
  planTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 3 },
  price: { fontFamily: MONO, fontSize: 20, color: C.text },
  links: { flexDirection: 'row', gap: 18, marginTop: 14 },
  link: { color: C.accent, fontSize: 12, paddingVertical: 8 },
});
