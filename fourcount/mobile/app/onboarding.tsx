import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Eyebrow, H1, P, Tiny } from '@/components/ui';
import { useApp } from '@/lib/store';
import { C, MONO } from '@/lib/theme';

export default function Onboarding() {
  const { update } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [breaths, setBreaths] = useState(0);

  const finish = (toTest: boolean) => {
    update((s) => ({ onboarded: true, start: s.start ?? new Date().toISOString() }));
    router.replace(toTest ? '/test' : '/');
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.body}>
        {step === 0 && (
          <>
            <Eyebrow>FourCount</Eyebrow>
            <H1 style={{ fontSize: 40, lineHeight: 44 }}>Regulate under load. Any load.</H1>
            <P>The 4-count used in military and first-responder training, built for anyone. Five minutes a day, measured every week, no hardware. Four weeks to a lower resting rate and a longer hold. No experience needed.</P>
            <Card>
              <Tiny>Built on controlled trials: tactical breathing under simulated ambush (Bouchard 2012), cyclic sighing (Stanford 2023), resonance breathing (HRV biofeedback research), and the control pause. Not a medical device. Not a treatment. Not affiliated with any agency or unit.</Tiny>
            </Card>
            <View style={{ flex: 1 }} />
            <Button title="Start with the diaphragm lesson" onPress={() => setStep(1)} />
            <Button title="I have done this before" kind="quiet" style={{ marginTop: 8 }} onPress={() => setStep(2)} />
          </>
        )}
        {step === 1 && (
          <>
            <Eyebrow>Lesson 1 of 1</Eyebrow>
            <H1>Breathe into the belly, not the chest.</H1>
            <P>One hand on your chest, one on your stomach. In through the nose for four seconds. The lower hand rises first. The upper hand stays almost still.</P>
            <P>Do that five times. This is the mechanic every drill in the program is built on.</P>
            <Card prime>
              <View style={s.row}>
                <Text style={s.label}>Belly breaths</Text>
                <Text style={s.big}>{breaths}</Text>
              </View>
              <Button title="I did one" kind="ghost" style={{ marginTop: 14 }} onPress={() => setBreaths((b) => b + 1)} />
            </Card>
            <View style={{ flex: 1 }} />
            <Button title="Next: your baseline" disabled={breaths < 5} onPress={() => setStep(2)} />
          </>
        )}
        {step === 2 && (
          <>
            <Eyebrow>Baseline</Eyebrow>
            <H1>Baseline. Three numbers, ninety seconds.</H1>
            <P>Resting rate, CO2 tolerance, exhale control. Re-test every seven days. The graph is the proof.</P>
            <View style={{ flex: 1 }} />
            <Button title="Take the baseline test" onPress={() => finish(true)} />
            <Button title="Skip for now" kind="quiet" style={{ marginTop: 8 }} onPress={() => finish(false)} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { padding: 22, paddingBottom: 36, flexGrow: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 15, color: C.text },
  big: { fontFamily: MONO, fontSize: 40, color: C.text, lineHeight: 44 },
});
