/**
 * Ship It! — Phase 0 prototype root.
 *
 * Boots the game loop (load → offline catch-up → tick/save), then renders the
 * main screen on the cream-paper background. Full safe-area handling and the
 * juiced visual system come in later phases.
 */
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useGameLoop } from './src/state/useGameLoop';
import { MainGame } from './src/screens/MainGame';
import { palette, spacing, type as typeTokens } from './src/theme/theme';

const TOP_PAD =
  Platform.select({
    ios: 56,
    android: (RNStatusBar.currentHeight ?? 24) + spacing.md,
    default: 24,
  }) ?? 24;

export default function App() {
  const { ready } = useGameLoop();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {ready ? (
        <MainGame />
      ) : (
        <View style={styles.loading}>
          <Text style={typeTokens.title}>Booting studio…</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.paper,
    paddingTop: TOP_PAD,
    paddingBottom: spacing.lg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
