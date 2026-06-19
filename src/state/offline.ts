/**
 * Offline earnings — delta-time only.
 *
 * On resume we award `productionPerSec × min(elapsed, cap)` in ONE calculation.
 * We never simulate ticks across offline time. Cap defaults to 8h (made
 * extendable via rewarded ad in Phase 3).
 */
import type Decimal from 'break_infinity.js';

export const OFFLINE_CAP_SECONDS = 8 * 60 * 60; // 8 hours

export interface OfflineResult {
  /** Code awarded for the offline span. */
  earned: Decimal;
  /** Seconds actually credited (after clamping to the cap). */
  awardedSeconds: number;
  /** True when real elapsed time exceeded the cap. */
  wasCapped: boolean;
}

export function computeOfflineEarnings(
  productionPerSec: Decimal,
  elapsedSeconds: number,
  capSeconds: number = OFFLINE_CAP_SECONDS,
): OfflineResult {
  const cap = Math.max(0, capSeconds);
  const elapsed = Number.isFinite(elapsedSeconds) ? Math.max(0, elapsedSeconds) : 0;
  const awardedSeconds = Math.min(elapsed, cap);
  return {
    earned: productionPerSec.mul(awardedSeconds),
    awardedSeconds,
    wasCapped: elapsed > cap,
  };
}
