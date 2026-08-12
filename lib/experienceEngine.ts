import type {
  ExperienceTheme,
  UserPreferences,
} from "@/types/experience";

import { colors } from "@/data/colors";
import { visualWorlds } from "@/data/worlds";
import { emotions } from "@/data/emotions";

export function buildExperienceTheme(
  preferences: UserPreferences
): ExperienceTheme {
  const selectedColors = preferences.colors
    .map((id) => colors.find((color) => color.id === id))
    .filter(Boolean);

  const primary =
    selectedColors[0]?.value ?? "#D4AF37";

  const secondary =
    selectedColors[1]?.softValue ?? "#6E5D3C";

  const accent =
    selectedColors[2]?.value ?? "#D4AF37";

  const world =
    visualWorlds.find(
      (item) => item.id === preferences.worlds[0]
    ) ?? visualWorlds[0];

  const emotion =
    emotions.find(
      (item) => item.id === preferences.emotions[0]
    );

  return {
    primary,
    secondary,
    accent,

    background:
      world?.gradient ??
      "linear-gradient(145deg, #090909, #17130A, #33270C)",

    atmosphere:
      world?.mood ?? "mysterious",

    lighting:
      preferences.lighting || "soft",

    emotion:
      emotion?.id ?? "warm",

    symbol:
      preferences.secretSymbol ??
      preferences.symbols[0] ??
      "spark",
  };
}