/**
 * Ship It! root.
 *
 * Loads the display + body fonts (expo-font), boots the game loop, and renders
 * the HUD on the cream-paper background once both are ready. Skia, animated
 * backgrounds, and particles are deferred to a later phase — Reanimated + Moti
 * only, so this runs in Expo Go.
 */
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useGameLoop } from './src/state/useGameLoop';
import { MainGame } from './src/screens/MainGame';
import { fontMap } from './src/theme/fontMap';
import { palette, spacing } from './src/theme/theme';

const TOP_PAD =
  Platform.select({
    ios: 56,
    android: (RNStatusBar.currentHeight ?? 24) + spacing.md,
    default: 24,
  }) ?? 24;

export default function App() {
  const [fontsLoaded] = useFonts(fontMap);
  const { ready } = useGameLoop();
  const appReady = ready && fontsLoaded;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {appReady ? (
        <MainGame />
      ) : (
        <View style={styles.loading}>
          {/* System font here — custom faces may not be loaded yet. */}
          <Text style={styles.loadingText}>Booting studio…</Text>
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
  loadingText: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.ink,
  },
});
