/**
 * Font modules for expo-font's useFonts(). Kept separate from theme tokens so
 * the (heavier) Google-Font asset imports live in one place; theme.ts only
 * references the resulting family-name strings.
 *
 * NOTE: import from each weight's SUBPATH (not the package root) so Metro
 * bundles only the faces we actually use — importing the package index pulls
 * in every weight/italic (~3MB). The map keys MUST equal the family names used
 * in theme `fonts`.
 */
import { Baloo2_700Bold } from '@expo-google-fonts/baloo-2/700Bold';
import { Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2/800ExtraBold';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';

export const fontMap = {
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} as const;
