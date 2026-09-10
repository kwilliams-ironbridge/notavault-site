import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Eyebrow, Stat, Tiny } from '@/components/ui';
import { dayIndex, lastTest, prescribe, retestDue, streak, weekOf } from '@/lib/program';
import { useApp } from '@/lib/store';
import { TECH } from '@/lib/techniques';
import { C, MONO } from '@/lib/theme';

export default function Today() {
  const { state } = useApp();
  const router = useRouter();
  const p = prescribe(state);
  const t = TECH[p.id];
  const w = weekOf(state.start);
  const last = lastTest(state.tests);
  const first = state.tests[0];
  const delta = (k: 'rr' | 'bolt' | 'exhale', lowerIsBetter = false) => {
    if (!last || !first || last === first) return undefined;
    const d = last[k] - first[k];
    const better = lowerIsBetter ? d < 0 : d > 0;
    return `${d > 0 ? '+' : ''}${k === 'rr' ? d.toFixed(1) : d}${better ? ' better' : ''}`;
  };
  const gated = w >= 2 && !state.pro;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.body}>
        <View style={s.row}>
          <View>
            <Eyebrow>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Eyebrow>
            <Text style={s.h1}>Day {dayIndex(state.start) + 1}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Tiny>Streak</Tiny>
            <Text style={s.big}>{streak(state.sessions)}</Text>
          </View>
        </View>

        <View style={s.week}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={[s.weekSeg, i < w && { backgroundColor: C.accent }, i === w && { backgroundColor: C.accentDim, borderWidth: 1, borderColor: C.accent }]} />
          ))}
        </View>

        <Card prime>
          <Eyebrow>Week {w} of 4{gated ? ' · Pro' : ''}</Eyebrow>
          <Text style={s.tech}>{t.name}</Text>
          <Text style={s.desc}>{t.desc}</Text>
          <View style={[s.row, { marginTop: 14 }]}>
            <Text style={s.meta}>{p.minutes} min</Text>
            <Text style={s.meta}>{p.phases.map((x) => x.seconds).join(' · ')} s</Text>
          </View>
          <Button title="Start" style={{ marginTop: 16 }} onPress={() => (gated ? router.push('/paywall') : router.push({ pathname: '/session', params: { tech: p.id } }))} />
        </Card>

        <Card>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>Reset drill</Text>
              <Tiny>60 seconds. Before the meeting, after the argument, at 2 a.m.</Tiny>
            </View>
            <Button title="Reset" kind="ghost" style={{ minHeight: 44 }} onPress={() => router.push({ pathname: '/session', params: { tech: 'sigh', forced: '1' } })} />
          </View>
        </Card>

        {state.tests.length > 0 && retestDue(state.tests) ? (
          <Card>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>Re-test due</Text>
                <Tiny>Seven days since your last measurement.</Tiny>
              </View>
              <Button title="Test" kind="ghost" style={{ minHeight: 44 }} onPress={() => router.push('/test')} />
            </View>
          </Card>
        ) : null}

        <View style={[s.row, { marginTop: 16, gap: 10 }]}>
          {last ? (
            <>
              <Stat label="Resting rate" value={last.rr.toFixed(1)} delta={delta('rr', true)} />
              <Stat label="CO2 tolerance" value={`${last.bolt}s`} delta={delta('bolt')} />
              <Stat label="Exhale control" value={`${last.exhale}s`} delta={delta('exhale')} />
            </>
          ) : (
            <Card style={{ flex: 1, marginTop: 0 }}>
              <Text style={s.cardTitle}>No baseline yet</Text>
              <Tiny>Take the 90-second test so the graph has a starting point.</Tiny>
              <Button title="Take the baseline" kind="ghost" style={{ marginTop: 12 }} onPress={() => router.push('/test')} />
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { padding: 22, paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  h1: { fontSize: 30, fontWeight: '700', color: C.text, letterSpacing: -0.5 },
  big: { fontFamily: MONO, fontSize: 40, color: C.text, lineHeight: 44 },
  week: { flexDirection: 'row', gap: 6, marginTop: 16 },
  weekSeg: { flex: 1, height: 6, borderRadius: 3, backgroundColor: C.line },
  tech: { fontSize: 24, fontWeight: '700', color: C.text },
  desc: { fontSize: 15, lineHeight: 22, color: C.muted, marginTop: 6 },
  meta: { fontFamily: MONO, fontSize: 14, color: C.muted },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text, marginBottom: 2 },
});
