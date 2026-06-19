/** "Welcome back" banner showing Code the team produced while away. */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type Decimal from 'break_infinity.js';
import { palette, radius, outline, spacing, type as typeTokens } from '../theme/theme';
import { formatNumber } from '../economy/format';
import { Shadowed } from './Shadowed';

interface Props {
  amount: Decimal;
  onDismiss: () => void;
}

export function OfflineBanner({ amount, onDismiss }: Props) {
  return (
    <Shadowed radius={radius.md} style={styles.wrap}>
      <View style={styles.banner}>
        <View style={styles.text}>
          <Text style={typeTokens.label}>WHILE YOU WERE OUT</Text>
          <Text style={styles.amount}>
            Your team shipped {formatNumber(amount)} Code
          </Text>
        </View>
        <Pressable onPress={onDismiss} hitSlop={10} style={styles.close}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
    </Shadowed>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    marginBottom: spacing.md,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.yellow,
    borderRadius: radius.md,
    borderWidth: outline.thick,
    borderColor: palette.ink,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  amount: {
    ...typeTokens.title,
  },
  close: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: outline.thin,
    borderColor: palette.ink,
  },
  closeText: {
    ...typeTokens.title,
    fontSize: 14,
  },
});
