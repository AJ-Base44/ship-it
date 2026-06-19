/**
 * Count-up number. The displayed value tweens on the UI thread (Reanimated)
 * by animating a non-editable TextInput's `text` via useAnimatedProps.
 *
 * Why a worklet formatter instead of economy/format: that formatter operates on
 * break_infinity Decimals, which can't run inside a UI-thread worklet. The
 * tween target is `value.toNumber()` — for display we only need ~3 significant
 * figures, so the precision loss on very large values is invisible. The
 * authoritative balance stays a Decimal in the store; this only animates the
 * label.
 */
import { useEffect } from 'react';
import { Platform, StyleSheet, TextInput, type StyleProp, type TextStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type Decimal from 'break_infinity.js';
import { formatNumber } from '../economy/format';
import { motion } from '../theme/theme';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

/** Self-contained number → short string formatter, safe to run in a worklet. */
function formatWorklet(value: number, decimals: number): string {
  'worklet';
  if (value !== value) return '0'; // NaN
  if (value === Infinity) return '∞';
  if (value === -Infinity) return '-∞';
  if (value === 0) return '0';

  const neg = value < 0;
  const n = neg ? -value : value;
  let out: string;

  if (n < 1000) {
    if (n % 1 === 0) {
      out = String(n);
    } else {
      out = n.toFixed(decimals);
      out = trimTrailingZeros(out);
    }
  } else {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    const exp = Math.floor(Math.log10(n) + 1e-9);
    const tier = Math.floor(exp / 3);
    if (tier < suffixes.length) {
      const scaled = n / Math.pow(10, tier * 3);
      out = trimTrailingZeros(scaled.toFixed(decimals)) + suffixes[tier];
    } else {
      const m = n / Math.pow(10, exp);
      out = trimTrailingZeros(m.toFixed(decimals)) + 'e' + exp;
    }
  }
  return neg ? '-' + out : out;
}

function trimTrailingZeros(s: string): string {
  'worklet';
  if (s.indexOf('.') === -1) return s;
  let end = s.length;
  while (end > 0 && s.charAt(end - 1) === '0') end -= 1;
  if (end > 0 && s.charAt(end - 1) === '.') end -= 1;
  return s.substring(0, end);
}

interface Props {
  value: Decimal;
  style?: StyleProp<TextStyle>;
  decimals?: number;
  /** Starting value for the tween (defaults to the current value = no intro). */
  from?: number;
  duration?: number;
}

export function AnimatedNumber({
  value,
  style,
  decimals = 2,
  from,
  duration = motion.countUpMs,
}: Props) {
  const target = value.toNumber();
  const startAt = from ?? (Number.isFinite(target) ? target : Number.MAX_VALUE);
  const sv = useSharedValue(startAt);
  const valueKey = value.toString();

  useEffect(() => {
    sv.value = Number.isFinite(target)
      ? withTiming(target, { duration, easing: Easing.out(Easing.cubic) })
      : Number.MAX_VALUE;
    // Re-tween only when the underlying value actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueKey]);

  const animatedProps = useAnimatedProps(() => {
    return { text: formatWorklet(sv.value, decimals) } as never;
  });

  return (
    <AnimatedTextInput
      editable={false}
      caretHidden
      pointerEvents="none"
      underlineColorAndroid="transparent"
      style={[styles.input, style]}
      defaultValue={formatNumber(value, decimals)}
      accessibilityLabel={formatNumber(value, decimals)}
      animatedProps={animatedProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 0,
    margin: 0,
    ...Platform.select({
      android: { includeFontPadding: false, textAlignVertical: 'center' as const },
      default: null,
    }),
  },
});
