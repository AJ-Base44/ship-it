/**
 * Human-readable formatting for Decimal currency values.
 *
 * < 1000          -> plain (integers clean, fractions trimmed to `decimals`)
 * 1e3 .. < 1e36   -> short suffix (K, M, B, T, Qa, Qi, Sx, Sp, Oc, No, Dc)
 * >= 1e36         -> scientific (e.g. "1.23e42")
 */
import Decimal from 'break_infinity.js';

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

function trimZeros(s: string): string {
  if (s.indexOf('.') === -1) return s;
  return s.replace(/\.?0+$/, '');
}

export function formatNumber(value: Decimal, decimals = 2): string {
  if (value.eq(0)) return '0';
  if (value.lt(0)) return '-' + formatNumber(value.neg(), decimals);

  if (value.lt(1000)) {
    const n = value.toNumber();
    if (Number.isInteger(n)) return String(n);
    return trimZeros(n.toFixed(decimals));
  }

  // value = mantissa (.m, in [1,10)) × 10^exponent (.e)
  const exp = value.e;
  const tier = Math.floor(exp / 3);
  if (tier < SUFFIXES.length) {
    const within = exp - tier * 3; // 0, 1, or 2
    const scaled = value.m * Math.pow(10, within); // back into [1, 1000)
    return trimZeros(scaled.toFixed(decimals)) + SUFFIXES[tier];
  }

  // Astronomical — fall back to scientific notation.
  return trimZeros(value.m.toFixed(decimals)) + 'e' + exp;
}

/** Per-second rates read better with a single decimal by default. */
export function formatRate(value: Decimal, decimals = 1): string {
  return formatNumber(value, decimals);
}
