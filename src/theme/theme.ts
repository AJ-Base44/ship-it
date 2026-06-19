/**
 * Design tokens — the single source of truth for colour, spacing, type, and
 * shadow. Components must never hardcode a hex or a px; pull from here.
 *
 * Art direction: flat, bold-outline editorial illustration on cream paper.
 * Hard (non-blurred) offset drop shadows — implemented in <Shadowed/> as a
 * solid offset ink layer, NOT via blurred platform shadows.
 *
 * COLOURBLIND RULE: the accent palette below is for decoration and section /
 * character coding ONLY. Semantic state (affordable, locked, ready, success,
 * error, progress) must never be carried by hue alone — encode it with fill
 * vs ghost, outline weight, icons, text labels, and motion as well.
 */
import type { TextStyle } from 'react-native';

export const palette = {
  // Surfaces & ink
  paper: '#F6F1E7',
  ink: '#141210',
  card: '#FFFFFF',
  // Ink at reduced strength (for secondary text / hairlines)
  inkSoft: 'rgba(20, 18, 16, 0.62)',
  inkFaint: 'rgba(20, 18, 16, 0.16)',
  // Accents — DECORATIVE / section coding only (never the sole carrier of meaning)
  orange: '#F5872E',
  pink: '#EF4C8F',
  sky: '#4FB0E0',
  violet: '#7C5CD6',
  yellow: '#FFC93C',
  green: '#27AE76',
} as const;

export type AccentKey = 'orange' | 'pink' | 'sky' | 'violet' | 'yellow' | 'green';

export const accent = (key: AccentKey): string => palette[key];

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
} as const;

export const outline = {
  thin: 2,
  thick: 3,
} as const;

/** Default hard-shadow offset (px). Used by <Shadowed/>. */
export const SHADOW_OFFSET = 4;

/**
 * Type scale. A bold display face for headings + a clean sans for body/numbers.
 * Exact custom faces get locked here once font assets land (Phase 2); for the
 * Phase 0 prototype we lean on the platform system stack via fontWeight.
 */
export const type = {
  display: { fontSize: 40, fontWeight: '800', letterSpacing: 0.2, color: palette.ink },
  title: { fontSize: 18, fontWeight: '800', color: palette.ink },
  body: { fontSize: 14, fontWeight: '500', color: palette.ink },
  flavor: { fontSize: 12, fontWeight: '500', color: palette.inkSoft },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, color: palette.inkSoft },
  number: { fontSize: 16, fontWeight: '800', color: palette.ink },
} as const satisfies Record<string, TextStyle>;
