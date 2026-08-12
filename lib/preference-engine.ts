import type {
  ExperienceTheme,
  UserPreferences,
} from "@/types/experience";

import { colors } from "@/data/colors";
import { visualWorlds } from "@/data/worlds";
import { emotions } from "@/data/emotions";
import { symbols } from "@/data/symbols";

export function createExperienceTheme(
  preferences: UserPreferences
): ExperienceTheme {
  const selectedColors = preferences.colors
    .map((id) => colors.find((color) => color.id === id))
    .filter(Boolean);

  const selectedWorlds = preferences.worlds
    .map((id) => visualWorlds.find((world) => world.id === id))
    .filter(Boolean);

  const selectedEmotions = preferences.emotions
    .map((id) => emotions.find((emotion) => emotion.id === id))
    .filter(Boolean);

  const selectedSymbols = preferences.symbols
    .map((id) => symbols.find((symbol) => symbol.id === id))
    .filter(Boolean);

  const primary = selectedColors[0]?.value ?? "#D4AF37";

  const secondary =
    selectedColors[1]?.value ??
    selectedColors[0]?.softValue ??
    "#6E5D3C";

  const accent =
    selectedColors[2]?.value ??
    selectedColors[0]?.value ??
    "#D4AF37";

  const background =
    selectedWorlds[0]?.gradient ??
    "linear-gradient(145deg, #050505, #17130A)";

  const atmosphere =
    selectedWorlds[0]?.mood ??
    "luxury";

  const lighting =
    preferences.lighting || "warm";

  const emotion =
    selectedEmotions[0]?.id ??
    "grand";

  const symbol =
    selectedSymbols[0]?.id ??
    preferences.secretSymbol ??
    "sparkles";

  return {
    primary,
    secondary,
    accent,
    background,
    atmosphere,
    lighting,
    emotion,
    symbol,
  };
}