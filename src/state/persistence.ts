/** AsyncStorage-backed persistence. Thin wrapper over the pure saveCodec. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState } from './types';
import { serialize, deserialize } from './saveCodec';

const SAVE_KEY = 'shipit.save';

type Persistable = Pick<
  GameState,
  'code' | 'totalCodeEver' | 'tapValue' | 'owned' | 'lastSeen'
>;

export async function saveGame(state: Persistable): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVE_KEY, serialize(state));
  } catch {
    // Best-effort; a dropped save is recoverable next tick.
  }
}

export async function loadGame(): Promise<Partial<GameState> | null> {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    return raw ? deserialize(raw) : null;
  } catch {
    return null;
  }
}

export async function clearSave(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}
