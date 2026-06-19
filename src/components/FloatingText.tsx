/**
 * Floating "+N" feedback: each tap spawns a label that drifts up, scales, and
 * fades, then removes itself. Animation runs on the UI thread (Moti/Reanimated).
 *
 * Designed to live INSIDE a clipped surface (e.g. the hero) so floaters read
 * crisply against it and tidy away at the edge.
 */
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MotiText } from 'moti';
import { palette, motion, type as typeTokens } from '../theme/theme';

interface Floater {
  id: number;
  text: string;
  dx: number;
}

export function useFloatingText() {
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const nextId = useRef(0);

  const spawn = useCallback((text: string) => {
    const id = nextId.current++;
    const dx = (Math.random() - 0.5) * motion.floatSpreadX; // horizontal jitter
    setFloaters((prev) => [...prev, { id, text, dx }]);
  }, []);

  const remove = useCallback((id: number) => {
    setFloaters((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return { floaters, spawn, remove };
}

interface LayerProps {
  floaters: ReturnType<typeof useFloatingText>['floaters'];
  onDone: (id: number) => void;
  color?: string;
}

export function FloatingTextLayer({ floaters, onDone, color = palette.paper }: LayerProps) {
  return (
    <View pointerEvents="none" style={styles.layer}>
      {floaters.map((f) => (
        <MotiText
          key={f.id}
          style={[styles.text, { color, marginLeft: f.dx }]}
          from={{ opacity: 1, translateY: 0, scale: 0.9 }}
          animate={{ opacity: 0, translateY: motion.floatRiseY, scale: 1.2 }}
          transition={{ type: 'timing', duration: motion.floatMs }}
          onDidAnimate={(key, finished) => {
            if (key === 'opacity' && finished) onDone(f.id);
          }}
        >
          {f.text}
        </MotiText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typeTokens.numberMd,
  },
});
