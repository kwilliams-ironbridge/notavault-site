import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { C, MONO } from '@/lib/theme';

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <Text style={s.eyebrow}>{children}</Text>;
}
export function H1({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[s.h1, style]}>{children}</Text>;
}
export function P({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[s.p, style]}>{children}</Text>;
}
export function Tiny({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[s.tiny, style]}>{children}</Text>;
}
export function Card({ children, prime, style }: { children: React.ReactNode; prime?: boolean; style?: ViewStyle }) {
  return <View style={[s.card, prime && { borderColor: C.accentDim }, style]}>{children}</View>;
}
export function Button({ title, onPress, kind = 'primary', disabled, style }: { title: string; onPress: () => void; kind?: 'primary' | 'ghost' | 'quiet'; disabled?: boolean; style?: ViewStyle }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.btn,
        kind === 'ghost' && s.btnGhost,
        kind === 'quiet' && s.btnQuiet,
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.8 },
        style,
      ]}>
      <Text style={[s.btnText, kind === 'ghost' && { color: C.text }, kind === 'quiet' && { color: C.muted, fontWeight: '500' }]}>{title}</Text>
    </Pressable>
  );
}
export function Stat({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.statL}>{label}</Text>
      <Text style={s.statV}>{value}</Text>
      {delta ? <Text style={s.statD}>{delta}</Text> : null}
    </View>
  );
}
export function Scale({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <View style={s.scale}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
        <Pressable key={i} onPress={() => onChange(i)} accessibilityRole="button" style={[s.scaleBtn, value === i && s.scaleOn]}>
          <Text style={[s.scaleText, value === i && { color: C.bg }]}>{i}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  eyebrow: { fontFamily: MONO, fontSize: 12, color: C.accent, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  h1: { fontSize: 28, fontWeight: '700', color: C.text, letterSpacing: -0.5, lineHeight: 33 },
  p: { fontSize: 15, lineHeight: 22, color: C.muted, marginTop: 10 },
  tiny: { fontSize: 12, lineHeight: 18, color: C.muted },
  card: { backgroundColor: C.surface, borderColor: C.line, borderWidth: 1, borderRadius: 16, padding: 20, marginTop: 16 },
  btn: { minHeight: 52, borderRadius: 12, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.line },
  btnQuiet: { backgroundColor: 'transparent', minHeight: 44 },
  btnText: { fontSize: 16, fontWeight: '700', color: C.bg },
  stat: { flex: 1, backgroundColor: C.surface2, borderRadius: 12, padding: 14 },
  statL: { fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
  statV: { fontFamily: MONO, fontSize: 20, color: C.text, marginTop: 4 },
  statD: { fontFamily: MONO, fontSize: 12, color: C.accent, marginTop: 2 },
  scale: { flexDirection: 'row', gap: 6, marginTop: 14 },
  scaleBtn: { flex: 1, minHeight: 44, borderRadius: 8, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' },
  scaleOn: { backgroundColor: C.accent, borderColor: C.accent },
  scaleText: { fontFamily: MONO, fontSize: 13, color: C.text },
});
