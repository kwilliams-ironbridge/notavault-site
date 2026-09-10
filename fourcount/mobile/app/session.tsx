import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Eyebrow, H1, P, Scale, Tiny } from '@/components/ui';
import { advance, prescribe, resetDrill, type Prescription } from '@/lib/program';
import { useApp } from '@/lib/store';
import { TECH, type Phase, type TechId } from '@/lib/techniques';
import { C, MONO } from '@/lib/theme';

type Stage = 'pre' | 'run' | 'post';

async function cue(kind: Phase['kind'], enabled: boolean) {
  if (!enabled) return;
  try {
    const H = await import('expo-haptics');
    await H.impactAsync(kind === 'hold' ? H.ImpactFeedbackStyle.Light : H.ImpactFeedbackStyle.Medium);
  } catch {
    /* haptics unavailable, ignore */
  }
}

export default function Session() {
  const { tech, forced } = useLocalSearchParams<{ tech?: TechId; forced?: string }>();
  const { state, update } = useApp();
  const router = useRouter();

  const rx = useRef<Prescription>(forced === '1' ? resetDrill() : prescribe(state));
  if (tech && tech !== rx.current.id && forced !== '1') rx.current = prescribe(state);
  const p = rx.current;
  const t = TECH[p.id];

  const [stage, setStage] = useState<Stage>('pre');
  const [pre, setPre] = useState<number | null>(null);
  const [post, setPost] = useState<number | null>(null);
  const [lead, setLead] = useState(3);
  const [pi, setPi] = useState(-1);
  const [left, setLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const doneRef = useRef(false);
  const scale = useRef(new Animated.Value(1)).current;
  const total = p.minutes * 60;

  useEffect(() => {
    if (stage !== 'run') return;
    const id = setInterval(() => {
      if (lead > 0) {
        setLead((l) => l - 1);
        return;
      }
      setElapsed((e) => e + 1);
      if (left <= 0) {
        const next = (pi + 1) % p.phases.length;
        const ph = p.phases[next];
        setPi(next);
        setLeft(ph.seconds - 1);
        Animated.timing(scale, { toValue: ph.scale, duration: ph.seconds * 1000, useNativeDriver: true }).start();
        void cue(ph.kind, state.haptics);
      } else {
        setLeft((l) => l - 1);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [stage, lead, left, pi, p, scale, state.haptics]);

  useEffect(() => {
    if (stage === 'run' && elapsed >= total) {
      doneRef.current = true;
      setStage('post');
    }
  }, [elapsed, total, stage]);

  const phase = pi >= 0 ? p.phases[pi] : null;
  const remain = Math.max(0, total - elapsed);
  const shift = pre !== null && post !== null ? pre - post : null;

  const save = () => {
    if (pre === null || post === null) return;
    update((s) => advance(s, { date: new Date().toISOString(), tech: p.id, minutes: p.minutes, pre, post, done: doneRef.current }));
    router.back();
  };

  return (
    <SafeAreaView style={s.safe}>
      {stage === 'pre' && (
        <ScrollView contentContainerStyle={s.body}>
          <Eyebrow>{t.name} · {p.minutes} min</Eyebrow>
          <H1>Where is your arousal right now?</H1>
          <P>1 is flat. 10 is redlined. First instinct.</P>
          <Scale value={pre} onChange={setPre} />
          <Card>
            <Text style={s.cardTitle}>How to do it</Text>
            <P style={{ marginTop: 4 }}>{t.how}</P>
          </Card>
          <Button title="Begin" disabled={pre === null} style={{ marginTop: 16 }} onPress={() => setStage('run')} />
          <Button title="Not now" kind="quiet" style={{ marginTop: 8 }} onPress={() => router.back()} />
        </ScrollView>
      )}

      {stage === 'run' && (
        <View style={s.body}>
          <View style={s.row}>
            <Eyebrow>{t.name}</Eyebrow>
            <Button title="End" kind="quiet" onPress={() => setStage('post')} />
          </View>
          <View style={s.guide}>
            <View style={s.ring} />
            <View style={[s.ring, { top: 34, left: 34, right: 34, bottom: 34, opacity: 0.6 }]} />
            <Animated.View style={[s.orb, phase?.kind === 'hold' && s.orbHold, { transform: [{ scale }] }]} />
          </View>
          <Text style={s.phase}>{lead > 0 ? 'Get ready' : phase?.label ?? ''}</Text>
          <Text style={s.count}>{lead > 0 ? lead : Math.ceil(left + 1)}</Text>
          <Text style={s.remain}>{Math.floor(remain / 60)}:{String(remain % 60).padStart(2, '0')} left</Text>
        </View>
      )}

      {stage === 'post' && (
        <ScrollView contentContainerStyle={s.body}>
          <Eyebrow>Drill complete</Eyebrow>
          <H1>And now?</H1>
          <P>Same scale. 1 flat, 10 redlined.</P>
          <Scale value={post} onChange={setPost} />
          {shift !== null && (
            <Card prime>
              <View style={s.row}>
                <Text style={s.cardTitle}>Down-shift</Text>
                <Text style={s.shift}>{shift > 0 ? '-' : shift < 0 ? '+' : ''}{Math.abs(shift)}</Text>
              </View>
              <Tiny style={{ marginTop: 6 }}>
                {shift > 0 ? 'That is the skill. Same time tomorrow.' : shift === 0 ? 'No shift today. The graph is built on weeks, not one drill.' : 'Higher after than before. Note where you are in an hour; the drop sometimes lands late.'}
              </Tiny>
            </Card>
          )}
          <Button title="Log drill" disabled={post === null} style={{ marginTop: 16 }} onPress={save} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  body: { padding: 22, paddingBottom: 40, flexGrow: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  guide: { width: 260, height: 260, alignSelf: 'center', marginTop: 40, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 130, borderWidth: 1, borderColor: C.line },
  orb: { width: 120, height: 120, borderRadius: 60, backgroundColor: C.accent, shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 30, shadowOffset: { width: 0, height: 0 } },
  orbHold: { backgroundColor: C.hold, shadowColor: C.hold },
  phase: { fontSize: 26, fontWeight: '700', color: C.text, textAlign: 'center', marginTop: 36 },
  count: { fontFamily: MONO, fontSize: 64, color: C.text, textAlign: 'center', marginTop: 6, lineHeight: 70 },
  remain: { fontFamily: MONO, fontSize: 14, color: C.muted, textAlign: 'center', marginTop: 10 },
  shift: { fontFamily: MONO, fontSize: 40, color: C.accent, lineHeight: 44 },
});
