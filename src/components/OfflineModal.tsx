/**
 * "Welcome back" offline-earnings modal. Same visual language as the rest of
 * the game: white card, thick ink outline, hard offset shadow. The amount
 * counts up from zero for a little delight; a chunky Collect button dismisses.
 */
import { Modal, StyleSheet, Text, View } from 'react-native';
import { MotiView } from 'moti';
import Decimal from 'break_infinity.js';
import {
  palette,
  radius,
  outline,
  spacing,
  size,
  motion,
  SHADOW_OFFSET_LG,
  type as typeTokens,
} from '../theme/theme';
import { Shadowed } from './Shadowed';
import { Button } from './Button';
import { AnimatedNumber } from './AnimatedNumber';

interface Props {
  visible: boolean;
  amount: Decimal;
  onCollect: () => void;
}

export function OfflineModal({ visible, amount, onCollect }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCollect}>
      <View style={styles.backdrop}>
        {visible ? (
          <MotiView
            // Re-mount per open (keyed by amount) so the count-up replays.
            key={amount.toString()}
            from={{ opacity: 0, scale: 0.82, translateY: 12 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'spring', ...motion.spring }}
          >
            <Shadowed radius={radius.lg} offset={SHADOW_OFFSET_LG}>
              <View style={styles.card}>
                <Text style={styles.kicker}>✦ WHILE YOU WERE OUT</Text>
                <Text style={styles.title}>Your team kept shipping</Text>

                <View style={styles.amountRow}>
                  <Text style={styles.plus}>+</Text>
                  <AnimatedNumber
                    value={amount}
                    from={0}
                    decimals={2}
                    duration={900}
                    style={styles.amount}
                  />
                  <Text style={styles.unit}>Code</Text>
                </View>

                <Button label="Collect" onPress={onCollect} style={styles.collect} />
              </View>
            </Shadowed>
          </MotiView>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: palette.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    borderWidth: outline.thick,
    borderColor: palette.ink,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: size.modalMinWidth,
  },
  kicker: {
    ...typeTokens.label,
  },
  title: {
    ...typeTokens.h1,
    textAlign: 'center',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginVertical: spacing.sm,
  },
  plus: {
    ...typeTokens.numberMd,
    color: palette.ink,
  },
  amount: {
    ...typeTokens.numberLg,
  },
  unit: {
    ...typeTokens.h2,
    color: palette.inkSoft,
  },
  collect: {
    marginTop: spacing.sm,
  },
});
