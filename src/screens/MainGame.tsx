/**
 * Main HUD. Reference structure:
 *   top    — currency bar (Code balance + Code/sec)
 *   center — hero tap zone
 *   middle — scrollable styled generator buy-list
 *   bottom — action bar (Boost / Shop / Settings placeholders)
 * Plus the offline "welcome back" modal overlay.
 *
 * Live values come from a single useUiSnapshot() so numbers refresh on the slow
 * UI cadence, not every 250ms logic tick.
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Decimal from 'break_infinity.js';
import { useGameStore } from '../state/store';
import { useUiSnapshot } from '../state/useUiSnapshot';
import { GENERATORS } from '../economy/generators';
import { palette, spacing, type as typeTokens } from '../theme/theme';
import { CurrencyBar } from '../components/CurrencyBar';
import { HeroTap } from '../components/HeroTap';
import { GeneratorCard } from '../components/GeneratorCard';
import { BottomBar } from '../components/BottomBar';
import { OfflineModal } from '../components/OfflineModal';
import { PressableScale } from '../components/PressableScale';

const ZERO = new Decimal(0);

export function MainGame() {
  const snap = useUiSnapshot();

  const onTap = () => useGameStore.getState().tap();
  const onBuy = (id: string) => useGameStore.getState().buy(id);
  const onReset = () => useGameStore.getState().reset();
  const onDismissOffline = () => useGameStore.getState().dismissOffline();

  const showOffline = snap.lastOfflineEarned !== null && snap.lastOfflineEarned.gt(0);

  return (
    <View style={styles.container}>
      <CurrencyBar code={snap.code} productionPerSec={snap.productionPerSec} />
      <HeroTap tapValue={snap.tapValue} onTap={onTap} />

      <Text style={[typeTokens.label, styles.sectionHeader]}>YOUR TEAM</Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {GENERATORS.map((def, i) => (
          <GeneratorCard
            key={def.id}
            def={def}
            index={i}
            owned={snap.owned[def.id] ?? 0}
            code={snap.code}
            onBuy={onBuy}
          />
        ))}

        <PressableScale onPress={onReset} style={styles.reset}>
          <Text style={styles.resetText}>Reset progress (dev)</Text>
        </PressableScale>
      </ScrollView>

      <BottomBar />

      <OfflineModal
        visible={showOffline}
        amount={snap.lastOfflineEarned ?? ZERO}
        onCollect={onDismissOffline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  sectionHeader: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  reset: {
    alignSelf: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  resetText: {
    ...typeTokens.body,
    color: palette.inkSoft,
    textDecorationLine: 'underline',
  },
});
