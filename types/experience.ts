export type ColorOption = {
  id: string;
  name: string;
  value: string;
  softValue: string;
  group: string;
  groupName: string;
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
  image: string;
};

export type SymbolOption = {
  id: string;
  title: string;
  emoji: string;
  image: string;
};

export type MusicTrack = {
  id: string;
  title: string;
  subtitle: string;
  audio: string;
  duration?: number;
};

export type MusicOption = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  image: string;
  audio: string;
  category:
    | "piano"
    | "acoustic"
    | "cinematic"
    | "lofi"
    | "classical"
    | "dreamy";
};

export type LightingOption = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  gradient: string;
  image: string;
};

export type BirthdayProfile = {
  name: string;
  birthDate: string;
  wish: string;
  age: number;
  tone: "warm-friendly" | "warm-respectful";
};

export type UserPreferences = {
  colors: string[];
  worlds: string[];
  music: string[];
  lighting: string;
  emotions: string[];
  symbols: string[];
  secretSymbol: string | null;
  profile: BirthdayProfile | null;
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