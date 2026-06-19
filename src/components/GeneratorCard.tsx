/**
 * One generator line: name, flavour, owned count, current output, and a buy
 * button. Affordability is shown by the button's fill-vs-ghost shape + a lock
 * glyph + the always-visible cost (never by colour alone).
 */
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';
import Decimal from 'break_infinity.js';
import type { GeneratorDef } from '../economy/generators';
import { nextCost, generatorOutput, canAfford } from '../economy/math';
import { formatNumber, formatRate } from '../economy/format';
import { palette, radius, spacing, outline, accent, type as typeTokens } from '../theme/theme';
import { Card } from './Card';
import { Button } from './Button';

interface Props {
  def: GeneratorDef;
  owned: number;
  code: Decimal;
  onBuy: (id: string) => void;
}

export function GeneratorCard({ def, owned, code, onBuy }: Props) {
  const cost = nextCost(def, owned);
  const output = generatorOutput(def, owned);
  const affordable = canAfford(code, cost);

  const handleBuy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onBuy(def.id);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.titleRow}>
            <View style={[styles.dot, { backgroundColor: accent(def.accent) }]} />
            <Text style={typeTokens.title}>{def.name}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>×{owned}</Text>
            </View>
          </View>
          <Text style={typeTokens.flavor}>{def.flavor}</Text>
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
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
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
  dot: {
    width: 14,
    height: 14,
    borderRadius: radius.pill,
    borderWidth: outline.thin,
    borderColor: palette.ink,
  },
  countBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
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
    color: palette.ink,
  },
});
