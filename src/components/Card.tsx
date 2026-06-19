/** White surface with a thick ink outline and a hard offset shadow. */
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { palette, radius, outline, spacing } from '../theme/theme';
import { Shadowed } from './Shadowed';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: Props) {
  return (
    <Shadowed radius={radius.lg} style={style}>
      <View style={styles.card}>{children}</View>
    </Shadowed>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    borderWidth: outline.thick,
    borderColor: palette.ink,
    padding: spacing.lg,
  },
});
