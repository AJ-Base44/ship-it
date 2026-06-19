/**
 * Pure (de)serialization for the save blob. Kept free of AsyncStorage so the
 * codec is unit-testable in plain Node. Decimals are persisted as strings and
 * rebuilt on load.
 */
import Decimal from 'break_infinity.js';
import type { GameState } from './types';

export const SAVE_VERSION = 1;

export interface SavedGame {
  v: number;
  code: string;
  totalCodeEver: string;
  tapValue: string;
  owned: Record<string, number>;
  lastSeen: number;
}

type Persistable = Pick<
  GameState,
  'code' | 'totalCodeEver' | 'tapValue' | 'owned' | 'lastSeen'
>;

export function serialize(state: Persistable): string {
  const payload: SavedGame = {
    v: SAVE_VERSION,
    code: state.code.toString(),
    totalCodeEver: state.totalCodeEver.toString(),
    tapValue: state.tapValue.toString(),
    owned: state.owned,
    lastSeen: state.lastSeen,
  };
  return JSON.stringify(payload);
}

export function deserialize(raw: string): Partial<GameState> | null {
  let parsed: SavedGame;
  try {
    parsed = JSON.parse(raw) as SavedGame;
  } catch {
    return null;
  }
  if (!parsed || parsed.v !== SAVE_VERSION) return null;

  try {
    return {
      code: new Decimal(parsed.code),
      totalCodeEver: new Decimal(parsed.totalCodeEver),
      tapValue: new Decimal(parsed.tapValue ?? 1),
      owned: sanitizeOwned(parsed.owned),
      lastSeen: typeof parsed.lastSeen === 'number' ? parsed.lastSeen : Date.now(),
    };
  } catch {
    return null;
  }
}

function sanitizeOwned(owned: Record<string, number> | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  if (!owned) return out;
  for (const [id, count] of Object.entries(owned)) {
    if (typeof count === 'number' && Number.isFinite(count) && count > 0) {
      out[id] = Math.floor(count);
    }
  }
  return out;
}
