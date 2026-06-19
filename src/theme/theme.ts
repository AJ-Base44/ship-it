/**
 * Design tokens — the single source of truth for colour, type, spacing, shadow,
 * and motion. Components must never hardcode a hex, px, font, or duration.
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
  paperDeep: '#ECE3D0', // slightly deeper paper for insets / tracks
  ink: '#141210',
  card: '#FFFFFF',
  // Ink at reduced strength (for secondary text / hairlines)
  inkSoft: 'rgba(20, 18, 16, 0.62)',
  inkFaint: 'rgba(20, 18, 16, 0.16)',
  // A scrim for modal backdrops (ink, not pure black, to stay on-brand)
  scrim: 'rgba(20, 18, 16, 0.45)',
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
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Fixed control / element dimensions (px) used across components. */
export const size = {
  hairline: 1,
  iconButton: 40, // bottom-bar icon circle
  sticker: 44, // generator accent sticker
  buttonMinWidth: 92,
  modalMinWidth: 280,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const outline = {
  hair: 1.5,
  thin: 2,
  thick: 3,
  heavy: 4,
} as const;

/** Hard-shadow offsets (px). Used by <Shadowed/>. */
export const SHADOW_OFFSET = 4;
export const SHADOW_OFFSET_LG = 6; // hero, modals

/**
 * Font families. Custom faces encode weight in the family name (React Native
 * does not synthesise weight for custom fonts), so tokens set `fontFamily`
 * rather than `fontWeight`. Faces are loaded in App via expo-font.
 *
 *   Display / headings : Baloo 2  — chunky rounded display, sticker/kawaii feel
 *   Body / numbers     : Nunito   — clean readable sans with strong numerals
 */
export const fonts = {
  display: 'Baloo2_800ExtraBold',
  displayBold: 'Baloo2_700Bold',
  body: 'Nunito_600SemiBold',
  bodyRegular: 'Nunito_400Regular',
  bodyBold: 'Nunito_700Bold',
  number: 'Nunito_800ExtraBold',
} as const;

/**
 * Type scale. Headings/branding use the chunky display face; body and ALL
 * numbers use the clean sans (per art direction: "clean readable sans for body
 * and numbers").
 */
export const type = {
  displayXl: { fontFamily: fonts.display, fontSize: 52, color: palette.ink },
  display: { fontFamily: fonts.display, fontSize: 40, letterSpacing: 0.2, color: palette.ink },
  h1: { fontFamily: fonts.display, fontSize: 28, color: palette.ink },
  h2: { fontFamily: fonts.displayBold, fontSize: 20, color: palette.ink },
  title: { fontFamily: fonts.displayBold, fontSize: 17, color: palette.ink },
  body: { fontFamily: fonts.body, fontSize: 14, color: palette.ink },
  flavor: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: palette.inkSoft },
  label: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.6, color: palette.inkSoft },
  micro: { fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1, color: palette.ink },
  icon: { fontSize: 18, color: palette.ink },
  number: { fontFamily: fonts.number, fontSize: 16, color: palette.ink },
  numberMd: { fontFamily: fonts.number, fontSize: 22, color: palette.ink },
  numberLg: { fontFamily: fonts.number, fontSize: 44, letterSpacing: 0.5, color: palette.ink },
  buttonSm: { fontFamily: fonts.number, fontSize: 13, color: palette.ink },
} as const satisfies Record<string, TextStyle>;

/**
 * Motion tokens. All juice pulls timing/spring from here so the world feels
 * consistent. (Reanimated/Moti on the UI thread — see components.)
 */
export const motion = {
  durFast: 120,
  durBase: 220,
  durSlow: 360,
  countUpMs: 380,
  /** Squash-and-bounce spring for presses and pops. */
  spring: { damping: 13, stiffness: 200, mass: 0.7 },
  /** Scale a control squashes to while pressed. */
  pressScale: 0.93,
  /** Per-item delay for staggered list entrances. */
  enterStaggerMs: 55,
  /** Idle "breathing" pulse on the hero. */
  idlePulseScale: 1.06,
  idlePulseMs: 1500,
  /** Count-badge pop on purchase. */
  popFromScale: 1.35,
  /** Floating "+N" feedback: rise distance, lifetime, horizontal spread. */
  floatRiseY: -64,
  floatMs: 800,
  floatSpreadX: 56,
} as const;
