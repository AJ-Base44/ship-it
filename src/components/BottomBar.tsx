/**
 * Bottom action bar. Phase-2 visual placeholders only — none of these are
 * wired to real systems yet:
 *   - Boost : rewarded-ad slot (Phase 3) — styled as the call-to-action
 *   - Shop  : upgrades/shop (Phase 1/3)
 *   - Settings : settings/stats (Phase 1)
 * Each gives press feedback (squash + light haptic) so the bar feels alive.
 * Icons + text labels carry meaning (no hue-coding).
 */
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';
import { palette, radius, outline, spacing, size, type as typeTokens } from '../theme/theme';
import { Shadowed } from './Shadowed';
import { PressableScale } from './PressableScale';

interface Props {
  onBoost?: () => void;
  onShop?: () => void;
  onSettings?: () => void;
}

function tap(fn?: () => void) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  fn?.();
}

export function BottomBar({ onBoost, onShop, onSettings }: Props) {
  return (
    <Shadowed radius={radius.xl} style={styles.wrap}>
      <View style={styles.bar}>
        {/* Boost — the prominent (filled) call-to-action; rewarded-ad slot */}
        <PressableScale onPress={() => tap(onBoost)} accessibilityLabel="Boost (coming soon)" style={styles.boost}>
          <Text style={styles.boostGlyph}>★</Text>
          <Text style={styles.boostLabel}>BOOST</Text>
          <View style={styles.adTag}>
            <Text style={styles.adTagText}>AD</Text>
          </View>
        </PressableScale>

        <IconButton glyph="🛍" label="SHOP" onPress={() => tap(onShop)} />
        <IconButton glyph="⚙" label="SETTINGS" onPress={() => tap(onSettings)} />
      </View>
    </Shadowed>
  );
}

function IconButton({
  glyph,
  label,
  onPress,
}: {
  glyph: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress} style={styles.iconBtn} accessibilityLabel={`${label} (coming soon)`}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconGlyph}>{glyph}</Text>
      </View>
      <Text style={styles.iconLabel}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    borderWidth: outline.thick,
    borderColor: palette.ink,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  // Boost (filled CTA)
  boost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: palette.ink,
    borderRadius: radius.pill,
    borderWidth: outline.thick,
    borderColor: palette.ink,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  boostGlyph: {
    ...typeTokens.h2,
    color: palette.paper,
  },
  boostLabel: {
    ...typeTokens.label,
    color: palette.paper,
  },
  adTag: {
    paddingHorizontal: spacing.xs,
    paddingVertical: size.hairline,
    borderRadius: radius.sm,
    backgroundColor: palette.paper,
  },
  adTagText: {
    ...typeTokens.micro,
  },
  // Icon buttons (ghost)
  iconBtn: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  iconCircle: {
    width: size.iconButton,
    height: size.iconButton,
    borderRadius: radius.pill,
    borderWidth: outline.thick,
    borderColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    ...typeTokens.icon,
  },
  iconLabel: {
    ...typeTokens.micro,
  },
});
