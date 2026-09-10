import type { AppState, SessionLog, TestLog } from './store';
import { TECH, type Phase, type TechId } from './techniques';

export const DAY = 86_400_000;

export function day0(d: string | Date | number): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function dayIndex(start: string | null, now = new Date()): number {
  if (!start) return 0;
  return Math.max(0, Math.round((day0(now).getTime() - day0(start).getTime()) / DAY));
}

export function weekOf(start: string | null, now = new Date()): number {
  return Math.min(4, Math.floor(dayIndex(start, now) / 7) + 1);
}

export interface Prescription {
  id: TechId;
  phases: Phase[];
  minutes: number;
}

export function prescribe(s: AppState, now = new Date()): Prescription {
  const w = weekOf(s.start, now);
  const evening = now.getHours() >= 17;
  const ladder = { boxCount: s.boxCount, exhaleRatio: s.exhaleRatio };
  if (w === 1) return { id: 'box', phases: TECH.box.phases({ ...ladder, boxCount: 4 }), minutes: 5 };
  if (w === 2) return { id: 'resonance', phases: TECH.resonance.phases(ladder), minutes: 6 };
  if (w === 3) return { id: 'box', phases: TECH.box.phases(ladder), minutes: 6 };
  if (evening) return { id: 'exhale', phases: TECH.exhale.phases(ladder), minutes: 5 };
  return { id: 'box', phases: TECH.box.phases(ladder), minutes: 5 };
}

export function resetDrill(): Prescription {
  return { id: 'sigh', phases: TECH.sigh.phases({ boxCount: 4, exhaleRatio: 6 }), minutes: 1 };
}

export function streak(sessions: SessionLog[], now = new Date()): number {
  const days = new Set(sessions.map((s) => day0(s.date).getTime()));
  let n = 0;
  let d = day0(now).getTime();
  if (!days.has(d)) d -= DAY;
  while (days.has(d)) {
    n++;
    d -= DAY;
  }
  return n;
}

export function lastTest(tests: TestLog[]): TestLog | undefined {
  return tests[tests.length - 1];
}

export function retestDue(tests: TestLog[], now = new Date()): boolean {
  const t = lastTest(tests);
  if (!t) return true;
  return (day0(now).getTime() - day0(t.date).getTime()) / DAY >= 7;
}

/** Ladder advancement after a completed drill. Returns the state patch. */
export function advance(s: AppState, log: SessionLog): Partial<AppState> {
  const sessions = [...s.sessions, log];
  const patch: Partial<AppState> = { sessions };
  if (log.tech === 'box' && log.done) {
    const n = sessions.filter((x) => x.tech === 'box' && x.done).length;
    if (n % 3 === 0 && s.boxCount < 6) patch.boxCount = s.boxCount + 1;
  }
  if (log.tech === 'exhale' && log.done && s.exhaleRatio < 8) patch.exhaleRatio = s.exhaleRatio + 1;
  return patch;
}
