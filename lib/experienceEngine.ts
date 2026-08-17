import type {
  ExperienceTheme,
  UserPreferences,
} from "@/types/experience";

import { colors } from "@/data/colors";
import { visualWorlds } from "@/data/worlds";
import { emotions } from "@/data/emotions";
import { symbols } from "@/data/symbols";

type BuildExperienceThemeInput = {
  preferences?: Partial<UserPreferences> | null;
};

const fallbackPreferences: UserPreferences = {
  colors: [],
  worlds: [],
  music: [],
  lighting: "",
  emotions: [],
  symbols: [],
  secretSymbol: null,
  profile: null,
};

export function buildExperienceTheme({
  preferences,
}: BuildExperienceThemeInput): ExperienceTheme {
  const safePreferences: UserPreferences = {
    ...fallbackPreferences,
    ...(preferences ?? {}),

    colors: preferences?.colors ?? [],
    worlds: preferences?.worlds ?? [],
    music: preferences?.music ?? [],
    lighting: preferences?.lighting ?? "",
    emotions: preferences?.emotions ?? [],
    symbols: preferences?.symbols ?? [],
    secretSymbol:
      preferences?.secretSymbol ?? null,
    profile:
      preferences?.profile ?? null,
  };

  const selectedColors = safePreferences.colors
    .map((id) =>
      colors.find(
        (color) => color.id === id
      )
    )
    .filter(
      (
        color
      ): color is (typeof colors)[number] =>
        Boolean(color)
    );

  const selectedWorld =
    visualWorlds.find(
      (world) =>
        world.id ===
        safePreferences.worlds[0]
    ) ?? visualWorlds[0];

  const selectedEmotion =
    emotions.find(
      (emotion) =>
        emotion.id ===
        safePreferences.emotions[0]
    ) ?? emotions[0];

  const symbolId =
    safePreferences.secretSymbol ??
    safePreferences.symbols[0];

  const selectedSymbol =
    symbols.find(
      (symbol) =>
        symbol.id === symbolId
    ) ?? symbols[0];

  const primary =
    selectedColors[0]?.value ??
    "#D4AF37";

  const secondary =
    selectedColors[1]?.softValue ??
    selectedColors[0]?.softValue ??
    "#6E5D3C";

  const accent =
    selectedColors[2]?.value ??
    selectedColors[0]?.value ??
    "#D4AF37";

  return {
    primary,
    secondary,
    accent,

    background:
      selectedWorld?.gradient ??
      "linear-gradient(145deg, #090909, #17130A, #33270C)",

    atmosphere:
      selectedWorld?.mood ??
      "mysterious",

    lighting:
      safePreferences.lighting ||
      "soft",

    emotion:
      selectedEmotion?.id ??
      "warm",

    symbol:
      selectedSymbol?.id ??
      "sparkles",
  };
}