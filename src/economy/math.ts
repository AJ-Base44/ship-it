/**
 * Economy math — pure functions, Decimal in / Decimal (or boolean) out.
 *
 * Every currency / cost / rate value is a break_infinity Decimal. Never a plain
 * JS number — those overflow within an hour of play.
 */
import Decimal from 'break_infinity.js';
import type { GeneratorDef } from './generators';

/** Cost to buy the next unit of a generator: baseCost × growthRate^owned. */
export function nextCost(def: GeneratorDef, owned: number): Decimal {
  return new Decimal(def.baseCost).mul(new Decimal(def.growthRate).pow(owned));
}

/** Total Code/sec produced by a single generator line at its current count. */
export function generatorOutput(def: GeneratorDef, owned: number): Decimal {
  if (owned <= 0) return new Decimal(0);
  return new Decimal(def.baseProduction).mul(owned);
}

/** Sum of Code/sec across every generator line. */
export function totalOutputPerSec(
  defs: readonly GeneratorDef[],
  owned: Record<string, number>,
): Decimal {
  return defs.reduce(
    (sum, def) => sum.add(generatorOutput(def, owned[def.id] ?? 0)),
    new Decimal(0),
  );
}

/** Affordability check. Kept as a named function so callers read clearly. */
export function canAfford(balance: Decimal, cost: Decimal): boolean {
  return balance.gte(cost);
}
