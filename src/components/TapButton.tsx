/** The primary tap target — write Code by hand. Haptic on every tap. */
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text } from 'react-native';
import type Decimal from 'break_infinity.js';
import { palette, radius, outline, spacing, type as typeTokens } from '../theme/theme';
import { formatNumber } from '../economy/format';
import { Shadowed } from './Shadowed';

interface Props {
  tapValue: Decimal;
  onTap: () => void;
}

export function TapButton({ tapValue, onTap }: Props) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onTap();
  };

  return (
    <Shadowed radius={radius.lg} offset={6} style={styles.wrap}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.glyph}>{'</>'}</Text>
        <Text style={styles.label}>Write Code</Text>
        <Text style={styles.sub}>+{formatNumber(tapValue)} per tap</Text>
      </Pressable>
    </Shadowed>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
  },
  button: {
    backgroundColor: palette.ink,
    borderRadius: radius.lg,
    borderWidth: outline.thick,
    borderColor: palette.ink,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  glyph: {
    ...typeTokens.display,
    color: palette.paper,
  },
  label: {
    ...typeTokens.title,
    color: palette.paper,
  },
  sub: {
    ...typeTokens.body,
    color: palette.paper,
    opacity: 0.8,
  },
});
