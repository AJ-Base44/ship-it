/**
 * Chunky pill button.
 *
 * COLOURBLIND RULE: affordability/active state is carried by SHAPE, not hue:
 *  - filled  = solid ink fill, raised on a hard offset shadow  (actionable)
 *  - ghost   = transparent, thick ink outline, flat (no shadow) (not actionable)
 * Callers reinforce ghost state with an `icon` (e.g. a lock) and always-visible
 * label/sublabel text, so meaning survives in pure greyscale.
 */
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { palette, radius, outline, spacing, type as typeTokens } from '../theme/theme';
import { Shadowed } from './Shadowed';

export type ButtonVariant = 'filled' | 'ghost';

interface Props {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  sublabel?: string;
  /** Small leading glyph — used to flag locked/ghost state in greyscale. */
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'filled',
  disabled = false,
  sublabel,
  icon,
  style,
}: Props) {
  const filled = variant === 'filled' && !disabled;
  const textColor = filled ? palette.paper : palette.ink;

  const inner = (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        filled ? styles.filled : styles.ghost,
        pressed && !disabled && styles.pressed,
      ]}
    >
      {icon ? <Text style={[styles.icon, { color: textColor }]}>{icon}</Text> : null}
      <View style={styles.labels}>
        <Text style={[typeTokens.title, { color: textColor }]}>{label}</Text>
        {sublabel ? (
          <Text style={[styles.sublabel, { color: textColor }]}>{sublabel}</Text>
        ) : null}
      </View>
    </Pressable>
  );

  // Only the raised (filled) state gets the hard shadow.
  return filled ? (
    <Shadowed radius={radius.pill} style={style}>
      {inner}
    </Shadowed>
  ) : (
    <View style={style}>{inner}</View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: outline.thick,
    borderColor: palette.ink,
    minWidth: 96,
  },
  filled: {
    backgroundColor: palette.ink,
  },
  ghost: {
    backgroundColor: 'transparent',
    opacity: 0.75,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ translateY: 1 }],
  },
  labels: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 14,
  },
  sublabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});
