export type PhaseKind = 'in' | 'out' | 'hold';

export interface Phase {
  label: string;
  seconds: number;
  kind: PhaseKind;
  scale: number;
}

export type TechId = 'box' | 'sigh' | 'resonance' | 'exhale';

export interface Ladder {
  boxCount: number;
  exhaleRatio: number;
}

export interface Technique {
  id: TechId;
  name: string;
  desc: string;
  how: string;
  minutes: number;
  phases: (l: Ladder) => Phase[];
}

export const TECH: Record<TechId, Technique> = {
  box: {
    id: 'box',
    name: 'Box 4-count',
    desc: 'Equal inhale, hold, exhale, hold. The count used in military and first-responder training. Your count climbs as you hold rhythm.',
    how: 'In through the nose, hold, out through the nose, hold. Every side the same length. If the hold gets sharp, the count is too high.',
    minutes: 5,
    phases: ({ boxCount: c }) => [
      { label: 'Inhale', seconds: c, kind: 'in', scale: 1.85 },
      { label: 'Hold', seconds: c, kind: 'hold', scale: 1.85 },
      { label: 'Exhale', seconds: c, kind: 'out', scale: 1 },
      { label: 'Hold', seconds: c, kind: 'hold', scale: 1 },
    ],
  },
  sigh: {
    id: 'sigh',
    name: 'Reset drill',
    desc: 'Two inhales through the nose, one long exhale through the mouth. The fastest down-regulation there is. Sixty seconds, any time.',
    how: 'Inhale through your nose until mostly full. Take a second, shorter sip of air on top. Then exhale slowly through the mouth until empty. Repeat until the timer ends.',
    minutes: 1,
    phases: () => [
      { label: 'Inhale', seconds: 2, kind: 'in', scale: 1.55 },
      { label: 'Sip', seconds: 1, kind: 'in', scale: 1.85 },
      { label: 'Exhale', seconds: 6, kind: 'out', scale: 1 },
    ],
  },
  resonance: {
    id: 'resonance',
    name: 'Autonomic base',
    desc: 'Resonance breathing at five and a half breaths per minute. The rate that maximizes heart-rate variability. This is where the long-term gain lives.',
    how: 'In through the nose for five seconds, out for five and a half. Smooth, quiet, no holds. Belly leads.',
    minutes: 6,
    phases: () => [
      { label: 'Inhale', seconds: 5, kind: 'in', scale: 1.85 },
      { label: 'Exhale', seconds: 5.5, kind: 'out', scale: 1 },
    ],
  },
  exhale: {
    id: 'exhale',
    name: 'Down-shift',
    desc: 'Short inhale, long exhale. The under-load drill and the evening close. Exhale length grows across the week.',
    how: 'In through the nose for four. Out through pursed lips for the full count, slow and quiet.',
    minutes: 5,
    phases: ({ exhaleRatio: r }) => [
      { label: 'Inhale', seconds: 4, kind: 'in', scale: 1.85 },
      { label: 'Exhale', seconds: r, kind: 'out', scale: 1 },
    ],
  },
};
