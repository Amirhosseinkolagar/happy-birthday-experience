export type ColorOption = {
  id: string;
  name: string;
  value: string;
  softValue: string;
};

export type VisualWorld = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
  mood: string;
  image: string;
};

export type EmotionOption = {
  id: string;
  title: string;
  emoji: string;
  description: string;
};

export type SymbolOption = {
  id: string;
  title: string;
  emoji: string;
};

export type MusicOption = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
};

export type LightingOption = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  gradient: string;
};

export type UserPreferences = {
  colors: string[];
  worlds: string[];
  music: string[];
  lighting: string;
  emotions: string[];
  symbols: string[];
  secretSymbol: string | null;
};

export type ExperienceTheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  atmosphere: string;
  lighting: string;
  emotion: string;
  symbol: string;
};