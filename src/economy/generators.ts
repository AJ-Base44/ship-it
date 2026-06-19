/**
 * Generator catalog — the "idle" producers (your team). Pure data; all math
 * that consumes it lives in ./math as pure functions so the curve is easy to
 * re-tune in Phase 1.
 *
 * Values are the Phase 0 starting point from CLAUDE.md's economy table. The
 * system is data-driven: Phase 1 extends this array (DevOps Bot, 10x Engineer,
 * AI Swarm, …) and layers on upgrades + prestige without touching the math.
 */
import type { AccentKey } from '../theme/theme';

export interface GeneratorDef {
  id: string;
  name: string;
  flavor: string;
  /** Cost of the first unit, in Code. */
  baseCost: number;
  /** Code/sec produced per unit owned. */
  baseProduction: number;
  /** Cost multiplier per unit already owned (baseCost × growthRate^owned). */
  growthRate: number;
  /** DECORATIVE section coding only — never used to signal state. */
  accent: AccentKey;
}

export const GENERATORS: readonly GeneratorDef[] = [
  {
    id: 'junior',
    name: 'Junior Dev',
    flavor: 'Ships bugs and features alike.',
    baseCost: 15,
    baseProduction: 0.1,
    growthRate: 1.07,
    accent: 'orange',
  },
  {
    id: 'agent',
    name: 'AI Coding Agent',
    flavor: 'Tireless. Mostly correct.',
    baseCost: 100,
    baseProduction: 1,
    growthRate: 1.1,
    accent: 'sky',
  },
  {
    id: 'senior',
    name: 'Senior Engineer',
    flavor: 'Refactors your refactors.',
    baseCost: 1100,
    baseProduction: 8,
    growthRate: 1.12,
    accent: 'violet',
  },
  {
    id: 'offshore',
    name: 'Offshore Team',
    flavor: 'Follows the sun, ships at night.',
    baseCost: 12000,
    baseProduction: 47,
    growthRate: 1.14,
    accent: 'pink',
  },
] as const;

export const GENERATORS_BY_ID: Record<string, GeneratorDef> = Object.fromEntries(
  GENERATORS.map((g) => [g.id, g]),
);
