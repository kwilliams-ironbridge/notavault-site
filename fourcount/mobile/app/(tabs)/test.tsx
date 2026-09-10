import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Eyebrow, H1, P, Stat, Tiny } from '@/components/ui';
import { useApp, type TestLog } from '@/lib/store';
import { C, MONO } from '@/lib/theme';

type Key = 'rr' | 'bolt' | 'exhale';
const TESTS: { k: Key; title: string; desc: string }[] = [
  { k: 'rr', title: 'Resting rate', desc: 'Sit still for a moment. When the timer starts, tap the button once for every inhale. Sixty seconds.' },
  { k: 'bolt', title: 'CO2 tolerance', desc: 'Plain version: how long you can comfortably hold after a normal exhale. Breathe normally, exhale, pinch your nose, start the timer. Stop at the FIRST clear urge to breathe, not your max hold.' },
  { k: 'exhale', title: 'Exhale control', desc: 'Take a normal breath in. Start the timer and exhale slowly through pursed lips. Stop when you are empty, without straining.' },
];

export default function Test() {
  const { state, update } = useApp();
  const router = useRouter();
  const [i, setI] = useState(0);
  const [res, setRes] = useState<Partial<Record<Key, number>>>({});
  const [running, setRunning] = useState(false);
  const [display, setDisplay] = useState('');
  const [taps, setTaps] = useState(0);
  const startRef = useRef(0);
  const t = TESTS[i];

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const id = setInterval(() => {
      const secs = (Date.now() - startRef.current) / 1000;
      if (t.k === 'rr') {
        const leftS = Math.max(0, 60 - Math.floor(secs));
        setDisplay(String(leftS));
        if (leftS <= 0) {
          clearInterval(id);
          setRunning(false);
          finish(taps);
        }
      } else {
        setDisplay(secs.toFixed(1));
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, taps]);

  const finish = (value: number) => {
    const next = { ...res, [t.k]: value };
    setRes(next);
    setDisplay('');
    setTaps(0);
    if (i + 1 < TESTS.length) {
      setI(i + 1);
      return;
    }
    const log: TestLog = { date: new Date().toISOString(), rr: next.rr ?? 0, bolt: next.bolt ?? 0, exhale: next.exhale ?? 0 };
    update((s) => ({ tests: [...s.tests, log], start: s.start ?? new Date().toISOString() }));
    setI(0);
    setRes({});
    router.push('/progress');
  };

  const action = () => {
    if (t.k === 'rr') {
      if (!running) {
        setTaps(0);
        setRunning(true);
      } else setTaps((n) => n + 1);
      return;
    }
    if (!running) setRunning(true);
    else {
      setRunning(false);
      finish(Math.round((Date.now() - startRef.current) / 1000));
    }
  };

  const label = t.k === 'rr' ? (running ? 'Inhale (tap)' : 'Start') : running ? 'Stop' : 'Start';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.body}>
        <Eyebrow>Measurement {i + 1} of 3{state.tests.length ? ' · re-test' : ' · baseline'}</Eyebrow>
        <H1>{t.title}</H1>
        <P>{t.desc}</P>
        <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
          <Text style={s.big}>{display || (t.k === 'rr' ? '60' : '0.0')}</Text>
          <Tiny style={{ marginTop: 8 }}>{t.k === 'rr' ? (running ? `${taps} breaths so far` : 'seconds. Tap on every inhale.') : 'seconds'}</Tiny>
          <Button title={label} style={{ marginTop: 20, alignSelf: 'stretch', backgroundColor: running && t.k !== 'rr' ? C.hold : C.accent }} onPress={action} />
        </Card>
        <View style={s.row}>
          {TESTS.map((x) => (
            <Stat key={x.k} label={x.title} value={res[x.k] !== undefined ? String(res[x.k]) : x.k === t.k ? (running ? 'Running' : 'Now') : 'Next'} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { padding: 22, paddingBottom: 40 },
  big: { fontFamily: MONO, fontSize: 48, color: C.text, lineHeight: 54 },
  row: { flexDirection: 'row', gap: 10, marginTop: 16 },
});
