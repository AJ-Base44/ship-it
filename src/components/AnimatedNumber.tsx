/**
 * Count-up number.
 *
 * Formatting runs on the JS thread with the real economy/format.formatNumber
 * (full break_infinity precision); only the numeric value is tweened, via a
 * lightweight requestAnimationFrame loop.
 *
 * Why not a Reanimated worklet: worklets run in a separate UI-thread runtime
 * that lacks String()/Intl/locale APIs and can't call non-worklet helpers, so a
 * formatter worklet threw "undefined is not a function" on every tap. Keeping
 * the formatting on the JS thread is correctness-first; the tween is brief, so
 * it never meaningfully competes with the 250ms logic tick. The authoritative
 * balance stays a Decimal in the store — this only animates the label.
 */
import { useEffect, useRef, useState } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import Decimal from 'break_infinity.js';
import { formatNumber } from '../economy/format';
import { motion } from '../theme/theme';

interface Props {
  value: Decimal;
  style?: StyleProp<TextStyle>;
  decimals?: number;
  /** Starting value for the tween (defaults to the current value = no intro). */
  from?: number;
  duration?: number;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedNumber({
  value,
  style,
  decimals = 2,
  from,
  duration = motion.countUpMs,
}: Props) {
  const target = value.toNumber();
  const targetFinite = Number.isFinite(target);
  const valueKey = value.toString();

  const initial = from ?? (targetFinite ? target : 0);
  const [display, setDisplay] = useState(initial);
  const currentRef = useRef(initial);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Beyond Number range we can't tween a JS number; render the Decimal
    // directly (see `text` below) and skip the animation.
    if (!targetFinite) {
      currentRef.current = target;
      return;
    }

    const start = currentRef.current;
    const end = target;
    if (start === end) return;

    const startedAt = Date.now();
    const step = () => {
      const t = Math.min(1, (Date.now() - startedAt) / duration);
      const next = start + (end - start) * easeOutCubic(t);
      currentRef.current = next;
      setDisplay(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        currentRef.current = end;
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // Re-tween only when the underlying value actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueKey, duration]);

  const text = targetFinite
    ? formatNumber(new Decimal(display), decimals)
    : formatNumber(value, decimals);

  return (
    <Text style={style} numberOfLines={1}>
      {text}
    </Text>
  );
}
