/**
 * The Phase 0 prototype screen: currency readout, tap target, and the buyable
 * generator roster. Pulls live values from a single useUiSnapshot() so numbers
 * refresh on the slow UI cadence (not every logic tick).
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../state/store';
import { useUiSnapshot } from '../state/useUiSnapshot';
import { GENERATORS } from '../economy/generators';
import { palette, spacing, type as typeTokens } from '../theme/theme';
import { CurrencyBar } from '../components/CurrencyBar';
import { TapButton } from '../components/TapButton';
import { GeneratorCard } from '../components/GeneratorCard';
import { OfflineBanner } from '../components/OfflineBanner';

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
      <TapButton tapValue={snap.tapValue} onTap={onTap} />

      <Text style={[typeTokens.label, styles.sectionHeader]}>YOUR TEAM</Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {showOffline ? (
          <OfflineBanner amount={snap.lastOfflineEarned!} onDismiss={onDismissOffline} />
        ) : null}

        {GENERATORS.map((def) => (
          <GeneratorCard
            key={def.id}
            def={def}
            owned={snap.owned[def.id] ?? 0}
            code={snap.code}
            onBuy={onBuy}
          />
        ))}

        <Pressable onPress={onReset} style={styles.reset} hitSlop={8}>
          <Text style={styles.resetText}>Reset progress (dev)</Text>
        </Pressable>
      </ScrollView>
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
    marginTop: spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  reset: {
    alignSelf: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  resetText: {
    ...typeTokens.body,
    color: palette.inkSoft,
    textDecorationLine: 'underline',
  },
});
