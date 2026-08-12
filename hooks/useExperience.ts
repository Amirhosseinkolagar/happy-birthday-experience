"use client";

import { useExperienceContext } from "@/context/ExperienceContext";

export function useExperience() {
  const experience = useExperienceContext();

  return {
    ...experience,

    hasColors:
      experience.preferences.colors.length === 4,

    hasWorlds:
      experience.preferences.worlds.length === 3,

    hasMusic:
      experience.preferences.music.length > 0,

    hasLighting:
      Boolean(experience.preferences.lighting),

    hasEmotions:
      experience.preferences.emotions.length > 0,

    hasSymbols:
      experience.preferences.symbols.length > 0,

    hasSecret:
      Boolean(experience.preferences.secretSymbol),
  };
}