import Decimal from 'break_infinity.js';
import { serialize, deserialize, SAVE_VERSION } from '../saveCodec';

const sample = () => ({
  code: new Decimal('1.5e10'),
  totalCodeEver: new Decimal('2.5e10'),
  tapValue: new Decimal(2),
  owned: { junior: 3, agent: 1 },
  lastSeen: 1_700_000_000_000,
});

describe('saveCodec round-trip', () => {
  it('preserves Decimal values, owned, and lastSeen', () => {
    const restored = deserialize(serialize(sample()));
    expect(restored).not.toBeNull();
    expect(restored!.code!.toString()).toBe(new Decimal('1.5e10').toString());
    expect(restored!.totalCodeEver!.toString()).toBe(new Decimal('2.5e10').toString());
    expect(restored!.tapValue!.toNumber()).toBe(2);
    expect(restored!.owned).toEqual({ junior: 3, agent: 1 });
    expect(restored!.lastSeen).toBe(1_700_000_000_000);
  });
});

describe('deserialize guards', () => {
  it('returns null for malformed JSON', () => {
    expect(deserialize('not json {')).toBeNull();
  });

  it('returns null for an unknown save version', () => {
    const blob = JSON.stringify({ v: SAVE_VERSION + 99, code: '1' });
    expect(deserialize(blob)).toBeNull();
  });

  it('drops invalid owned counts', () => {
    const blob = serialize({
      ...sample(),
      owned: { junior: 3, bad: -1, zero: 0, nan: NaN as unknown as number },
    });
    expect(deserialize(blob)!.owned).toEqual({ junior: 3 });
  });

  it('floors fractional owned counts', () => {
    const blob = serialize({ ...sample(), owned: { junior: 3.9 } });
    expect(deserialize(blob)!.owned).toEqual({ junior: 3 });
  });
});
