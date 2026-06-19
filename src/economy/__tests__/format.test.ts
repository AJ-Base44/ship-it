import Decimal from 'break_infinity.js';
import { formatNumber, formatRate } from '../format';

const D = (v: string | number) => new Decimal(v);

describe('formatNumber', () => {
  it('handles zero and small integers', () => {
    expect(formatNumber(D(0))).toBe('0');
    expect(formatNumber(D(15))).toBe('15');
    expect(formatNumber(D(999))).toBe('999');
  });

  it('trims fractional values below 1000', () => {
    expect(formatNumber(D(3.4))).toBe('3.4');
    expect(formatNumber(D(2.5))).toBe('2.5');
    expect(formatNumber(D(0.1))).toBe('0.1');
  });

  it('uses short suffixes from 1e3', () => {
    expect(formatNumber(D(1500))).toBe('1.5K');
    expect(formatNumber(D(12000))).toBe('12K');
    expect(formatNumber(D(1234567))).toBe('1.23M');
    expect(formatNumber(D('1e9'))).toBe('1B');
    expect(formatNumber(D('1e12'))).toBe('1T');
  });

  it('falls back to scientific past the suffix table', () => {
    expect(formatNumber(D('1.23e42'))).toBe('1.23e42');
  });

  it('formats negatives with a leading sign', () => {
    expect(formatNumber(D(-1500))).toBe('-1.5K');
  });
});

describe('formatRate', () => {
  it('defaults to a single decimal', () => {
    expect(formatRate(D(0.1))).toBe('0.1');
    expect(formatRate(D(47))).toBe('47');
  });
});
