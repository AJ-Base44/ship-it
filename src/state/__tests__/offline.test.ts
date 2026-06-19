import Decimal from 'break_infinity.js';
import { computeOfflineEarnings, OFFLINE_CAP_SECONDS } from '../offline';

const rate = (perSec: number) => new Decimal(perSec);

describe('computeOfflineEarnings', () => {
  it('awards production × elapsed below the cap', () => {
    const r = computeOfflineEarnings(rate(2), 100);
    expect(r.earned.toNumber()).toBeCloseTo(200, 6);
    expect(r.awardedSeconds).toBe(100);
    expect(r.wasCapped).toBe(false);
  });

  it('clamps elapsed to the cap', () => {
    const r = computeOfflineEarnings(rate(1), OFFLINE_CAP_SECONDS + 5000);
    expect(r.awardedSeconds).toBe(OFFLINE_CAP_SECONDS);
    expect(r.earned.toNumber()).toBeCloseTo(OFFLINE_CAP_SECONDS, 6);
    expect(r.wasCapped).toBe(true);
  });

  it('never awards for negative or non-finite elapsed', () => {
    expect(computeOfflineEarnings(rate(5), -10).earned.toNumber()).toBe(0);
    expect(computeOfflineEarnings(rate(5), NaN).earned.toNumber()).toBe(0);
  });

  it('awards nothing when there is no production', () => {
    expect(computeOfflineEarnings(rate(0), 9999).earned.toNumber()).toBe(0);
  });

  it('respects a custom cap', () => {
    const r = computeOfflineEarnings(rate(3), 500, 100);
    expect(r.awardedSeconds).toBe(100);
    expect(r.earned.toNumber()).toBeCloseTo(300, 6);
    expect(r.wasCapped).toBe(true);
  });
});
