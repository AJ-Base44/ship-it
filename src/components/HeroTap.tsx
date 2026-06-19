/**
 * The central hero: tap to write Code. Squash-and-bounce press + a gentle idle
 * "breathing" pulse + floating "+N" feedback, all on the UI thread. Haptic on
 * every tap.
 */
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';
import { MotiView } from 'moti';
import type Decimal from 'break_infinity.js';
import {
  palette,
  radius,
  outline,
  spacing,
  motion,
  SHADOW_OFFSET_LG,
  type as typeTokens,
} from '../theme/theme';
import { formatNumber } from '../economy/format';
import { Shadowed } from './Shadowed';
import { PressableScale } from './PressableScale';
import { FloatingTextLayer, useFloatingText } from './FloatingText';

interface Props {
  tapValue: Decimal;
  onTap: () => void;
}

export function HeroTap({ tapValue, onTap }: Props) {
  const { floaters, spawn, remove } = useFloatingText();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    spawn(`+${formatNumber(tapValue)}`);
    onTap();
  };

  return (
    <Shadowed radius={radius.xl} offset={SHADOW_OFFSET_LG} style={styles.wrap}>
      <PressableScale onPress={handlePress} scaleTo={0.97} style={styles.hero} accessibilityLabel="Write code">
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: motion.idlePulseScale }}
          transition={{ type: 'timing', duration: motion.idlePulseMs, loop: true, repeatReverse: true }}
        >
          <Text style={styles.glyph}>{'</>'}</Text>
        </MotiView>
        <Text style={styles.label}>WRITE CODE</Text>
        <Text style={styles.sub}>+{formatNumber(tapValue)} per tap</Text>
        {/* Last child so floaters render on top of the glyph as they drift up */}
        <FloatingTextLayer floaters={floaters} onDone={remove} />
      </PressableScale>
    </Shadowed>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
  },
  hero: {
    backgroundColor: palette.ink,
    borderRadius: radius.xl,
    borderWidth: outline.thick,
    borderColor: palette.ink,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    overflow: 'hidden', // clip floaters to the hero
  },
  glyph: {
    ...typeTokens.displayXl,
    color: palette.paper,
  },
  label: {
    ...typeTokens.h2,
    color: palette.paper,
    letterSpacing: 1,
  },
  sub: {
    ...typeTokens.body,
    color: palette.paper,
    opacity: 0.75,
  },
});
