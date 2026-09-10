import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LineChart } from '@/components/LineChart';
import { Card, Eyebrow, H1, Tiny } from '@/components/ui';
import { lastTest } from '@/lib/program';
import { useApp } from '@/lib/store';
import { C, MONO } from '@/lib/theme';

export default function Progress() {
  const { state } = useApp();
  const { width } = useWindowDimensions();
  const cw = width - 22 * 2 - 20 * 2;
  const lbl = (d: string) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const last = lastTest(state.tests);
  const rated = state.sessions.filter((x) => x.pre && x.post);
  const avgShift = rated.length ? rated.reduce((a, x) => a + x.pre - x.post, 0) / rated.length : null;

  const Block = ({ title, now, note, children }: { title: string; now?: string; note: string; children: React.ReactNode }) => (
    <Card>
      <View style={s.row}>
        <Text style={s.h2}>{title}</Text>
        {now ? <Text style={s.now}>{now}</Text> : null}
      </View>
      {children}
      <Tiny>{note}</Tiny>
    </Card>
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.body}>
        <Eyebrow>Progress</Eyebrow>
        <H1>The graph.</H1>
        <Block title="CO2 tolerance (s)" now={last ? `${last.bolt}s` : undefined} note="Higher is better. The number breath-hold selection and stress tolerance both load on. 25 s or more is a solid target.">
          <LineChart width={cw} points={state.tests.map((x) => ({ v: x.bolt, label: lbl(x.date) }))} format={(v) => `${v}s`} />
        </Block>
        <Block title="Resting rate (breaths/min)" now={last ? String(last.rr) : undefined} note="Lower is better. The Stanford trial's main physiological outcome.">
          <LineChart width={cw} points={state.tests.map((x) => ({ v: x.rr, label: lbl(x.date) }))} format={(v) => v.toFixed(0)} />
        </Block>
        <Block title="Exhale control (s)" now={last ? `${last.exhale}s` : undefined} note="Higher is better. Exhale control drives three of your four drills.">
          <LineChart width={cw} points={state.tests.map((x) => ({ v: x.exhale, label: lbl(x.date) }))} format={(v) => `${v}s`} />
        </Block>
        <Block title="Down-shift per drill" now={avgShift !== null ? `${avgShift.toFixed(1)} avg` : undefined} note="Before minus after on the arousal scale. Higher is better.">
          <LineChart width={cw} points={rated.map((x) => ({ v: x.pre - x.post, label: lbl(x.date) }))} format={(v) => `${v > 0 ? '+' : ''}${v}`} />
        </Block>
        <Card>
          <View style={s.row}><Text style={s.h2}>Drills</Text><Text style={s.now}>{state.sessions.length}</Text></View>
          <View style={[s.row, { marginTop: 6 }]}><Text style={s.h2}>Minutes trained</Text><Text style={s.now}>{state.sessions.reduce((a, x) => a + x.minutes, 0)}</Text></View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { padding: 22, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  h2: { fontSize: 12, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4 },
  now: { fontFamily: MONO, fontSize: 16, color: C.accent },
});
