/** Top-of-screen readout: current Code balance + live production rate. */
import { StyleSheet, Text, View } from 'react-native';
import type Decimal from 'break_infinity.js';
import { palette, spacing, type as typeTokens } from '../theme/theme';
import { formatNumber, formatRate } from '../economy/format';

interface Props {
  code: Decimal;
  productionPerSec: Decimal;
}

export function CurrencyBar({ code, productionPerSec }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={typeTokens.label}>CODE</Text>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {formatNumber(code)}
      </Text>
      <Text style={styles.rate}>
        {'</> '}
        {formatRate(productionPerSec)} / sec
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  value: {
    ...typeTokens.display,
  },
  rate: {
    ...typeTokens.number,
    color: palette.inkSoft,
  },
});
