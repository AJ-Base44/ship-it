/**
 * Samples the store for rendering on the slow UI cadence.
 *
 * This is the bridge that keeps the 250ms logic tick from re-rendering the
 * tree: the continuous Code accrual is read on an interval (UI_REFRESH_MS),
 * while discrete user actions (tap / buy / offline award) bump `actionVersion`
 * — which IS subscribed reactively — so those land instantly.
 */
import { useEffect, useReducer } from 'react';
import type Decimal from 'break_infinity.js';
import { useGameStore } from './store';
import { UI_REFRESH_MS } from './loopConfig';

export interface UiSnapshot {
  code: Decimal;
  totalCodeEver: Decimal;
  productionPerSec: Decimal;
  tapValue: Decimal;
  owned: Record<string, number>;
  lastOfflineEarned: Decimal | null;
}

export function useUiSnapshot(): UiSnapshot {
  // Reactive: re-render the instant a discrete action happens.
  const version = useGameStore((s) => s.actionVersion);
  // Interval-driven: re-render on the slow cadence to show idle accrual.
  const [, refresh] = useReducer((c: number) => c + 1, 0);

  useEffect(() => {
    const id = setInterval(refresh, UI_REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // `version` is referenced so the dependency is explicit to readers/linters.
  void version;

  const s = useGameStore.getState();
  return {
    code: s.code,
    totalCodeEver: s.totalCodeEver,
    productionPerSec: s.productionPerSec,
    tapValue: s.tapValue,
    owned: s.owned,
    lastOfflineEarned: s.lastOfflineEarned,
  };
}
