/**
 * The single game-state store (Zustand).
 *
 * Read with selectors so only components using a value re-render. The 250ms
 * logic tick mutates `code`/`totalCodeEver` here; UI components do NOT subscribe
 * to those reactively (see useUiSnapshot) — they sample on a slower cadence.
 *
 * `actionVersion` bumps only on discrete user actions (tap / buy / offline
 * award) so the UI can refresh instantly for those, while the continuous idle
 * accrual stays on the slow UI cadence.
 *
 * `productionPerSec` is cached and recomputed only when `owned` changes, so the
 * tick never re-sums the whole roster.
 */
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import Decimal from 'break_infinity.js';
import type { GameState } from './types';
import { GENERATORS, GENERATORS_BY_ID } from '../economy/generators';
import { nextCost, totalOutputPerSec } from '../economy/math';

const INITIAL_TAP_VALUE = 1;

export interface GameStore extends GameState {
  /** Cached Code/sec across all generators; recomputed on owned change. */
  productionPerSec: Decimal;
  /** Most recent offline award (drives the "welcome back" banner); null = none. */
  lastOfflineEarned: Decimal | null;
  /** Bumps on discrete user actions for instant UI feedback. */
  actionVersion: number;

  tap: () => void;
  buy: (generatorId: string) => boolean;
  tick: (dtSeconds: number) => void;
  hydrate: (partial: Partial<GameState>) => void;
  applyOffline: (earned: Decimal) => void;
  dismissOffline: () => void;
  reset: () => void;
}

function freshState(): GameState {
  return {
    code: new Decimal(0),
    totalCodeEver: new Decimal(0),
    tapValue: new Decimal(INITIAL_TAP_VALUE),
    owned: {},
    lastSeen: Date.now(),
  };
}

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...freshState(),
    productionPerSec: new Decimal(0),
    lastOfflineEarned: null,
    actionVersion: 0,

    tap: () =>
      set((s) => {
        const gain = s.tapValue;
        return {
          code: s.code.add(gain),
          totalCodeEver: s.totalCodeEver.add(gain),
          actionVersion: s.actionVersion + 1,
        };
      }),

    buy: (id) => {
      const s = get();
      const def = GENERATORS_BY_ID[id];
      if (!def) return false;
      const owned = s.owned[id] ?? 0;
      const cost = nextCost(def, owned);
      if (s.code.lt(cost)) return false;

      const nextOwned = { ...s.owned, [id]: owned + 1 };
      set({
        code: s.code.sub(cost),
        owned: nextOwned,
        productionPerSec: totalOutputPerSec(GENERATORS, nextOwned),
        actionVersion: s.actionVersion + 1,
      });
      return true;
    },

    tick: (dtSeconds) => {
      if (dtSeconds <= 0) return;
      const s = get();
      const gain = s.productionPerSec.mul(dtSeconds);
      if (gain.lte(0)) return;
      set({
        code: s.code.add(gain),
        totalCodeEver: s.totalCodeEver.add(gain),
      });
    },

    hydrate: (p) =>
      set((s) => {
        const owned = p.owned ?? s.owned;
        return {
          code: p.code ?? s.code,
          totalCodeEver: p.totalCodeEver ?? s.totalCodeEver,
          tapValue: p.tapValue ?? s.tapValue,
          owned,
          lastSeen: p.lastSeen ?? s.lastSeen,
          productionPerSec: totalOutputPerSec(GENERATORS, owned),
        };
      }),

    applyOffline: (earned) =>
      set((s) => ({
        code: s.code.add(earned),
        totalCodeEver: s.totalCodeEver.add(earned),
        lastOfflineEarned: earned,
        actionVersion: s.actionVersion + 1,
      })),

    dismissOffline: () => set({ lastOfflineEarned: null }),

    reset: () =>
      set((s) => ({
        ...freshState(),
        productionPerSec: new Decimal(0),
        lastOfflineEarned: null,
        actionVersion: s.actionVersion + 1,
      })),
  })),
);
