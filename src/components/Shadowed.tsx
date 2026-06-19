/**
 * Hard offset drop shadow — a solid ink layer placed behind the content and
 * pushed down-right. This is the on-brand alternative to platform shadows,
 * which blur (iOS shadowRadius / Android elevation). Renders identically on
 * both platforms.
 */
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { palette, SHADOW_OFFSET } from '../theme/theme';

const FILL = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const;

interface Props {
  children: React.ReactNode;
  /** Match the child's borderRadius so the shadow's corners line up. */
  radius: number;
  offset?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Shadowed({
  children,
  radius,
  offset = SHADOW_OFFSET,
  color = palette.ink,
  style,
}: Props) {
  return (
    <View style={style}>
      <View
        pointerEvents="none"
        style={[
          FILL,
          {
            borderRadius: radius,
            backgroundColor: color,
            transform: [{ translateX: offset }, { translateY: offset }],
          },
        ]}
      />
      {children}
    </View>
  );
}
