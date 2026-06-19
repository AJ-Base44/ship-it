/**
 * Chunky pill button.
 *
 * COLOURBLIND RULE: affordability/active state is carried by SHAPE, not hue:
 *  - filled = solid ink fill, raised on a hard offset shadow   (actionable)
 *  - ghost  = transparent, thick ink outline, flat (no shadow) (not actionable)
 * Callers reinforce ghost state with an `icon` (e.g. a lock) and always-visible
 * label/sublabel text, so meaning survives in pure greyscale. Press feedback is
 * a squash-and-bounce (PressableScale).
 */
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { palette, radius, outline, spacing, size, type as typeTokens } from '../theme/theme';
import { Shadowed } from './Shadowed';
import { PressableScale } from './PressableScale';

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
  const a11y = sublabel ? `${label}, ${sublabel}` : label;

  const inner = (
    <View style={[styles.base, filled ? styles.filled : styles.ghost]}>
      {icon ? <Text style={[styles.icon, { color: textColor }]}>{icon}</Text> : null}
      <View style={styles.labels}>
        <Text style={[typeTokens.title, { color: textColor }]} numberOfLines={1}>
          {label}
        </Text>
        {sublabel ? (
          <Text style={[typeTokens.buttonSm, { color: textColor }]} numberOfLines={1}>
            {sublabel}
          </Text>
        ) : null}
      </View>
    </View>
  );

  // Only the raised (filled) state gets the hard shadow.
  return filled ? (
    <Shadowed radius={radius.pill} style={style}>
      <PressableScale onPress={onPress} disabled={disabled} accessibilityLabel={a11y}>
        {inner}
      </PressableScale>
    </Shadowed>
  ) : (
    <PressableScale onPress={onPress} disabled={disabled} style={style} accessibilityLabel={a11y}>
      {inner}
    </PressableScale>
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
    minWidth: size.buttonMinWidth,
  },
  filled: {
    backgroundColor: palette.ink,
  },
  ghost: {
    backgroundColor: 'transparent',
    opacity: 0.7,
  },
  labels: {
    alignItems: 'center',
  },
  icon: {
    ...typeTokens.body,
  },
});
