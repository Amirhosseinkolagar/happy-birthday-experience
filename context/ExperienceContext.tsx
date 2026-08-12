"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { UserPreferences } from "@/types/experience";

const initialPreferences: UserPreferences = {
  colors: [],
  worlds: [],
  music: [],
  lighting: "",
  emotions: [],
  symbols: [],
  secretSymbol: null,
};

type ExperienceContextValue = {
  preferences: UserPreferences;

  setColors: (colors: string[]) => void;
  setWorlds: (worlds: string[]) => void;
  setMusic: (music: string[]) => void;
  setLighting: (lighting: string) => void;
  setEmotions: (emotions: string[]) => void;
  setSymbols: (symbols: string[]) => void;
  setSecretSymbol: (symbol: string | null) => void;

  resetExperience: () => void;
};

const ExperienceContext =
  createContext<ExperienceContextValue | null>(null);

type ExperienceProviderProps = {
  children: ReactNode;
};

export function ExperienceProvider({
  children,
}: ExperienceProviderProps) {
  const [preferences, setPreferences] =
    useState<UserPreferences>(initialPreferences);

  const setColors = useCallback((colors: string[]) => {
    setPreferences((current) => ({
      ...current,
      colors,
    }));
  }, []);

  const setWorlds = useCallback((worlds: string[]) => {
    setPreferences((current) => ({
      ...current,
      worlds,
    }));
  }, []);

  const setMusic = useCallback((music: string[]) => {
    setPreferences((current) => ({
      ...current,
      music,
    }));
  }, []);

  const setLighting = useCallback((lighting: string) => {
    setPreferences((current) => ({
      ...current,
      lighting,
    }));
  }, []);

  const setEmotions = useCallback((emotions: string[]) => {
    setPreferences((current) => ({
      ...current,
      emotions,
    }));
  }, []);

  const setSymbols = useCallback((symbols: string[]) => {
    setPreferences((current) => ({
      ...current,
      symbols,
    }));
  }, []);

  const setSecretSymbol = useCallback(
    (secretSymbol: string | null) => {
      setPreferences((current) => ({
        ...current,
        secretSymbol,
      }));
    },
    []
  );

  const resetExperience = useCallback(() => {
    setPreferences(initialPreferences);
  }, []);

  const value = useMemo(
    () => ({
      preferences,
      setColors,
      setWorlds,
      setMusic,
      setLighting,
      setEmotions,
      setSymbols,
      setSecretSymbol,
      resetExperience,
    }),
    [
      preferences,
      setColors,
      setWorlds,
      setMusic,
      setLighting,
      setEmotions,
      setSymbols,
      setSecretSymbol,
      resetExperience,
    ]
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperienceContext() {
  const context = useContext(ExperienceContext);

  if (!context) {
    throw new Error(
      "useExperienceContext must be used inside ExperienceProvider"
    );
  }

  return context;
}