import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { TechId } from './techniques';

export interface SessionLog {
  date: string;
  tech: TechId;
  minutes: number;
  pre: number;
  post: number;
  done: boolean;
}

export interface TestLog {
  date: string;
  rr: number;
  bolt: number;
  exhale: number;
}

export interface AppState {
  onboarded: boolean;
  start: string | null;
  sessions: SessionLog[];
  tests: TestLog[];
  boxCount: number;
  exhaleRatio: number;
  pro: boolean;
  remind: boolean;
  haptics: boolean;
}

export const DEFAULT_STATE: AppState = {
  onboarded: false,
  start: null,
  sessions: [],
  tests: [],
  boxCount: 4,
  exhaleRatio: 6,
  pro: false,
  remind: false,
  haptics: true,
};

const KEY = 'fourcount.v1';

interface KV {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  removeItemAsync(key: string): Promise<void>;
}

// Lessons Learned 6.2: the storage handle is built lazily, on first use,
// never at module scope. A failure here degrades to in-memory state.
let _kv: KV | null = null;
function kv(): KV {
  if (!_kv) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _kv = require('expo-sqlite/kv-store').default as KV;
  }
  return _kv;
}

export async function loadState(): Promise<AppState> {
  try {
    const raw = await kv().getItemAsync(KEY);
    if (raw) return { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch (e) {
    if (__DEV__) console.warn('[store] load failed, using defaults', e);
  }
  return DEFAULT_STATE;
}

export async function saveState(s: AppState): Promise<void> {
  try {
    await kv().setItemAsync(KEY, JSON.stringify(s));
  } catch (e) {
    if (__DEV__) console.warn('[store] save failed', e);
  }
}

export async function clearState(): Promise<void> {
  try {
    await kv().removeItemAsync(KEY);
  } catch (e) {
    if (__DEV__) console.warn('[store] clear failed', e);
  }
}

interface Ctx {
  state: AppState;
  ready: boolean;
  update: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
  reset: () => Promise<void>;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    loadState().then((s) => {
      if (alive) {
        setState(s);
        setReady(true);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const update = useCallback<Ctx['update']>((patch) => {
    setState((prev) => {
      const p = typeof patch === 'function' ? patch(prev) : patch;
      const next = { ...prev, ...p };
      void saveState(next);
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    await clearState();
    setState(DEFAULT_STATE);
  }, []);

  return React.createElement(AppContext.Provider, { value: { state, ready, update, reset } }, children);
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
