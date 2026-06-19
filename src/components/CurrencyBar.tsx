/** Top HUD: the Code balance (count-up) and live production rate. */
import { StyleSheet, Text, View } from 'react-native';
import type Decimal from 'break_infinity.js';
import { palette, radius, outline, spacing, type as typeTokens } from '../theme/theme';
import { AnimatedNumber } from './AnimatedNumber';

interface Props {
  code: Decimal;
  productionPerSec: Decimal;
}

export function CurrencyBar({ code, productionPerSec }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>✦ CODE</Text>
      <AnimatedNumber
        value={code}
        decimals={2}
        style={styles.balance}
      />
      <View style={styles.rateChip}>
        {/* ▲ is a non-colour "producing" cue, not hue-coded */}
        <Text style={styles.rateGlyph}>▲</Text>
        <AnimatedNumber value={productionPerSec} decimals={1} style={styles.rateNum} />
        <Text style={styles.rateUnit}>/ sec</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  kicker: {
    ...typeTokens.label,
  },
  balance: {
    ...typeTokens.numberLg,
    textAlign: 'center',
  },
  rateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: palette.paperDeep,
    borderRadius: radius.pill,
    borderWidth: outline.thin,
    borderColor: palette.ink,
  },
  rateGlyph: {
    ...typeTokens.buttonSm,
  },
  rateNum: {
    ...typeTokens.number,
  },
  rateUnit: {
    ...typeTokens.body,
    color: palette.inkSoft,
  },
});
