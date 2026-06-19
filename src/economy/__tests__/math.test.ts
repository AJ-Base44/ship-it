import Decimal from 'break_infinity.js';
import { nextCost, generatorOutput, totalOutputPerSec, canAfford } from '../math';
import { GENERATORS_BY_ID } from '../generators';

const junior = GENERATORS_BY_ID.junior; // baseCost 15, prod 0.1, growth 1.07
const agent = GENERATORS_BY_ID.agent; // baseCost 100, prod 1, growth 1.10

describe('nextCost', () => {
  it('returns baseCost for the first unit', () => {
    expect(nextCost(junior, 0).toNumber()).toBeCloseTo(15, 6);
  });

  it('scales by growthRate^owned', () => {
    expect(nextCost(junior, 1).toNumber()).toBeCloseTo(15 * 1.07, 6);
    expect(nextCost(junior, 3).toNumber()).toBeCloseTo(15 * 1.07 ** 3, 6);
    expect(nextCost(agent, 5).toNumber()).toBeCloseTo(100 * 1.1 ** 5, 6);
  });
});

describe('generatorOutput', () => {
  it('is zero when none owned', () => {
    expect(generatorOutput(junior, 0).toNumber()).toBe(0);
  });

  it('is baseProduction × owned', () => {
    expect(generatorOutput(junior, 10).toNumber()).toBeCloseTo(1, 6);
    expect(generatorOutput(agent, 3).toNumber()).toBeCloseTo(3, 6);
  });
});

describe('totalOutputPerSec', () => {
  it('sums every line', () => {
    const defs = [junior, agent];
    const owned = { junior: 10, agent: 2 }; // 10*0.1 + 2*1 = 3
    expect(totalOutputPerSec(defs, owned).toNumber()).toBeCloseTo(3, 6);
  });

  it('treats missing ids as zero owned', () => {
    expect(totalOutputPerSec([junior, agent], {}).toNumber()).toBe(0);
  });
});

describe('canAfford', () => {
  it('is true when balance >= cost (inclusive)', () => {
    expect(canAfford(new Decimal(15), new Decimal(15))).toBe(true);
    expect(canAfford(new Decimal(16), new Decimal(15))).toBe(true);
  });

  it('is false when balance < cost', () => {
    expect(canAfford(new Decimal(14.99), new Decimal(15))).toBe(false);
  });
});
