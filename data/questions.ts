import type { UserPreferences } from "@/types/experience";

export type QuestionType =
  | "colors"
  | "worlds"
  | "music"
  | "lighting"
  | "emotions"
  | "symbols"
  | "secret";

export type QuestionConfig = {
  id: keyof UserPreferences;
  type: QuestionType;
  eyebrow: string;
  title: string;
  description: string;
  minSelections: number;
  maxSelections: number;
  required: boolean;
};

export const questions: QuestionConfig[] = [
  {
    id: "colors",
    type: "colors",
    eyebrow: "اولین انتخاب",
    title: "بذار با رنگ‌ها شروع کنیم...",
    description: "۴ رنگی که چشمت رو نگه می‌دارن انتخاب کن.",
    minSelections: 4,
    maxSelections: 4,
    required: true,
  },

  {
    id: "worlds",
    type: "worlds",
    eyebrow: "دنیای تو",
    title: "کدوم دنیا بیشتر به دلت می‌شینه؟",
    description: "۳ فضا رو انتخاب کن؛ زیاد فکر نکن، حس اولت مهمه.",
    minSelections: 3,
    maxSelections: 3,
    required: true,
  },

  {
    id: "music",
    type: "music",
    eyebrow: "یک انتخاب شنیداری",
    title: "حالا بذار صدا وارد این دنیا بشه...",
    description: "۲ سبک موسیقی رو برای این تجربه انتخاب کن.",
    minSelections: 2,
    maxSelections: 2,
    required: true,
  },

  {
    id: "lighting",
    type: "lighting",
    eyebrow: "نور",
    title: "اگر این دنیا نور داشت...",
    description: "نوری رو انتخاب کن که بیشتر باهات جور درمیاد.",
    minSelections: 1,
    maxSelections: 1,
    required: true,
  },

  {
    id: "emotions",
    type: "emotions",
    eyebrow: "حس",
    title: "حالا فقط حسش رو انتخاب کن.",
    description: "۳ حس که بیشتر دوستشون داری.",
    minSelections: 3,
    maxSelections: 3,
    required: true,
  },

  {
    id: "symbols",
    type: "symbols",
    eyebrow: "جزئیات کوچک",
    title: "اگر قرار بود یک نشونه همراهت باشه...",
    description: "۲ نماد رو انتخاب کن.",
    minSelections: 2,
    maxSelections: 2,
    required: true,
  },

  {
    id: "secretSymbol",
    type: "secret",
    eyebrow: "آخرین انتخاب",
    title: "این یکی رو زیاد فکر نکن.",
    description: "فقط چیزی رو انتخاب کن که اول چشمت گرفت.",
    minSelections: 1,
    maxSelections: 1,
    required: true,
  },
];