import type { LightingOption } from "@/types/experience";

export const lightingOptions: LightingOption[] = [
  {
    id: "candle",
    title: "نور شمع",
    emoji: "🕯️",
    description: "گرم، نزدیک و صمیمی",
    gradient:
      "radial-gradient(circle at center, rgba(255,190,90,0.28), transparent 65%)",
  },
  {
    id: "moonlight",
    title: "نور ماه",
    emoji: "🌙",
    description: "آرام، سرد و رویایی",
    gradient:
      "radial-gradient(circle at center, rgba(120,150,255,0.2), transparent 65%)",
  },
  {
    id: "golden",
    title: "نور طلایی",
    emoji: "✨",
    description: "باشکوه، گرم و لطیف",
    gradient:
      "radial-gradient(circle at center, rgba(212,175,55,0.25), transparent 65%)",
  },
  {
    id: "soft",
    title: "نور نرم",
    emoji: "☁️",
    description: "مینیمال، روشن و آرام",
    gradient:
      "radial-gradient(circle at center, rgba(255,255,255,0.14), transparent 65%)",
  },
];
