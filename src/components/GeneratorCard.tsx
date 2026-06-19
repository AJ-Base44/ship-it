/**
 * One generator line: accent sticker, name, flavour, owned count, current
 * output, and a buy button. Enters with a staggered slide-in; the count badge
 * pops on each purchase.
 *
 * COLOURBLIND RULE: affordability is shown by the button's fill-vs-ghost shape
 * + a lock glyph + the always-visible cost — never colour. The accent sticker
 * is pure decoration / section coding.
 */
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';
import { MotiView } from 'moti';
import Decimal from 'break_infinity.js';
import type { GeneratorDef } from '../economy/generators';
import { nextCost, generatorOutput, canAfford } from '../economy/math';
import { formatNumber, formatRate } from '../economy/format';
import {
  palette,
  radius,
  spacing,
  outline,
  size,
  accent,
  motion,
  type as typeTokens,
} from '../theme/theme';
import { Card } from './Card';
import { Button } from './Button';

interface Props {
  def: GeneratorDef;
  owned: number;
  code: Decimal;
  index: number;
  onBuy: (id: string) => void;
}

export function GeneratorCard({ def, owned, code, index, onBuy }: Props) {
  const cost = nextCost(def, owned);
  const output = generatorOutput(def, owned);
  const affordable = canAfford(code, cost);

  const handleBuy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onBuy(def.id);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: motion.durSlow, delay: index * motion.enterStaggerMs }}
    >
      <Card style={styles.card}>
        <View style={styles.row}>
          {/* Decorative accent sticker (section coding, not state) */}
          <View style={[styles.sticker, { backgroundColor: accent(def.accent) }]}>
            <Text style={styles.stickerLetter}>{def.name.charAt(0)}</Text>
          </View>

          <View style={styles.left}>
            <View style={styles.titleRow}>
              <Text style={typeTokens.title} numberOfLines={1}>
                {def.name}
              </Text>
              <MotiView
                key={owned}
                from={{ scale: motion.popFromScale }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', ...motion.spring }}
                style={styles.countBadge}
              >
                <Text style={styles.countText}>×{owned}</Text>
              </MotiView>
            </View>
            <Text style={typeTokens.flavor} numberOfLines={1}>
              {def.flavor}
            </Text>
            <Text style={styles.output}>
              {owned > 0
                ? `${formatRate(output)} / sec`
                : `+${formatRate(new Decimal(def.baseProduction))} / sec each`}
            </Text>
          </View>

          <Button
            label="Buy"
            sublabel={formatNumber(cost)}
            icon={affordable ? undefined : '🔒'}
            variant={affordable ? 'filled' : 'ghost'}
            disabled={!affordable}
            onPress={handleBuy}
          />
        </View>
      </Card>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sticker: {
    width: size.sticker,
    height: size.sticker,
    borderRadius: radius.md,
    borderWidth: outline.thick,
    borderColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerLetter: {
    ...typeTokens.h2,
    color: palette.ink,
  },
  left: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  countBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: size.hairline,
    borderRadius: radius.pill,
    borderWidth: outline.thin,
    borderColor: palette.ink,
  },
  countText: {
    ...typeTokens.label,
    color: palette.ink,
    letterSpacing: 0.5,
  },
  output: {
    ...typeTokens.number,
  },
});
