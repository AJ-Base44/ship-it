/** Core game-state shape. All currencies are Decimal — never plain number. */
import type Decimal from 'break_infinity.js';

export interface GameState {
  /** Current spendable Code. */
  code: Decimal;
  /** Lifetime Code earned — for stats and (Phase 1) prestige math. */
  totalCodeEver: Decimal;
  /** Code earned per tap. Starts at 1; upgrades multiply it (Phase 1). */
  tapValue: Decimal;
  /** generatorId -> units owned. */
  owned: Record<string, number>;
  /** Epoch ms of the last save / foreground — anchor for offline earnings. */
  lastSeen: number;
}
