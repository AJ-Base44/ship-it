/**
 * Owns the game's lifecycle: load → offline catch-up → tick / autosave / save
 * on background. Mounted exactly once (in App). Talks to the store via
 * getState()/subscribe so it never triggers React re-renders itself.
 */
import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useGameStore } from './store';
import { loadGame, saveGame } from './persistence';
import { computeOfflineEarnings } from './offline';
import { AUTOSAVE_MS, LOGIC_TICK_MS, MAX_TICK_SECONDS } from './loopConfig';

/** Stamp lastSeen = now, then persist the current state. */
async function persistNow(): Promise<void> {
  useGameStore.setState({ lastSeen: Date.now() });
  await saveGame(useGameStore.getState());
}

/** Credit production for the time since `lastSeen` (delta-time, capped). */
function catchUpOffline(now: number): void {
  const { productionPerSec, lastSeen } = useGameStore.getState();
  const elapsedSeconds = (now - lastSeen) / 1000;
  const { earned } = computeOfflineEarnings(productionPerSec, elapsedSeconds);
  if (earned.gt(0)) useGameStore.getState().applyOffline(earned);
}

export function useGameLoop(): { ready: boolean } {
  const [ready, setReady] = useState(false);
  const lastTickRef = useRef<number>(Date.now());

  // ── Initial load + first offline catch-up ──────────────────────────────
  useEffect(() => {
    let mounted = true;
    (async () => {
      const saved = await loadGame();
      if (!mounted) return;
      if (saved) {
        useGameStore.getState().hydrate(saved);
        catchUpOffline(Date.now());
      }
      const now = Date.now();
      useGameStore.setState({ lastSeen: now });
      lastTickRef.current = now;
      setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Logic tick (real delta-time, clamped) ──────────────────────────────
  useEffect(() => {
    if (!ready) return;
    lastTickRef.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = Math.min((now - lastTickRef.current) / 1000, MAX_TICK_SECONDS);
      lastTickRef.current = now;
      useGameStore.getState().tick(dt);
    }, LOGIC_TICK_MS);
    return () => clearInterval(id);
  }, [ready]);

  // ── Periodic autosave ───────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => {
      void persistNow();
    }, AUTOSAVE_MS);
    return () => clearInterval(id);
  }, [ready]);

  // ── Save on meaningful change (a purchase changes `owned`) ─────────────
  useEffect(() => {
    if (!ready) return;
    let pending: ReturnType<typeof setTimeout> | undefined;
    const unsub = useGameStore.subscribe(
      (s) => s.owned,
      () => {
        if (pending) clearTimeout(pending);
        pending = setTimeout(() => void persistNow(), 800);
      },
    );
    return () => {
      unsub();
      if (pending) clearTimeout(pending);
    };
  }, [ready]);

  // ── Foreground/background: save on leave, catch up on return ───────────
  useEffect(() => {
    if (!ready) return;
    const onChange = (next: AppStateStatus) => {
      if (next === 'active') {
        catchUpOffline(Date.now());
        const now = Date.now();
        lastTickRef.current = now;
        useGameStore.setState({ lastSeen: now });
      } else if (next === 'background' || next === 'inactive') {
        void persistNow();
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [ready]);

  return { ready };
}
