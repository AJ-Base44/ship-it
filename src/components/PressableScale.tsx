/**
 * A Pressable that squashes on press-in and springs back on release — the
 * tactile base for every button in the game. Runs entirely on the UI thread
 * (Reanimated), so it never competes with the JS-thread logic tick.
 */
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { motion } from '../theme/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  hitSlop?: PressableProps['hitSlop'];
  accessibilityLabel?: string;
}

export function PressableScale({
  children,
  onPress,
  disabled = false,
  style,
  scaleTo = motion.pressScale,
  hitSlop,
  accessibilityLabel,
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel}
      onPressIn={() => {
        if (disabled) return;
        scale.value = withTiming(scaleTo, { duration: motion.durFast });
      }}
      onPressOut={() => {
        if (disabled) return;
        scale.value = withSpring(1, motion.spring);
      }}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
