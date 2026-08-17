import type { ColorOption } from "@/types/experience";

export type ColorGroup = {
  id: string;
  name: string;
  description: string;
};

export const colorGroups: ColorGroup[] = [
  {
    id: "black",
    name: "سیاه و خاکستری",
    description: "عمق، قدرت و سکوت",
  },
  {
    id: "red",
    name: "قرمز",
    description: "هیجان، جسارت و احساس",
  },
  {
    id: "orange",
    name: "نارنجی",
    description: "انرژی، گرما و زندگی",
  },
  {
    id: "yellow",
    name: "زرد و طلایی",
    description: "نور، شادی و درخشش",
  },
  {
    id: "green",
    name: "سبز",
    description: "طبیعت، آرامش و تازگی",
  },
  {
    id: "teal",
    name: "فیروزه‌ای",
    description: "آب، آزادی و تازگی",
  },
  {
    id: "blue",
    name: "آبی",
    description: "آرامش، اعتماد و عمق",
  },
  {
    id: "purple",
    name: "بنفش",
    description: "راز، خیال و شکوه",
  },
  {
    id: "lavender",
    name: "یاسی",
    description: "لطافت، رویا و آرامش",
  },
  {
    id: "pink",
    name: "صورتی",
    description: "محبت، لطافت و احساس",
  },
  {
    id: "brown",
    name: "قهوه‌ای",
    description: "گرما، اصالت و صمیمیت",
  },
  {
    id: "cream",
    name: "کرم و سفید",
    description: "نور، ظرافت و آرامش",
  },
];

const familyDefinitions = [
  {
    id: "black",
    name: "سیاه",
    hue: 0,
    saturation: 0,
    lightness: [
      8, 12, 16, 20, 24,
      28, 32, 36, 40, 45,
      50, 56, 64, 72, 82,
    ],
  },
  {
    id: "red",
    name: "قرمز",
    hue: 0,
    saturation: 72,
    lightness: [
      18, 23, 28, 33, 38,
      43, 48, 53, 58, 63,
      68, 73, 78, 84, 90,
    ],
  },
  {
    id: "orange",
    name: "نارنجی",
    hue: 25,
    saturation: 76,
    lightness: [
      18, 23, 28, 33, 38,
      43, 48, 53, 58, 63,
      68, 73, 78, 84, 90,
    ],
  },
  {
    id: "yellow",
    name: "طلایی",
    hue: 45,
    saturation: 82,
    lightness: [
      18, 23, 28, 33, 38,
      43, 48, 53, 58, 63,
      68, 73, 78, 84, 92,
    ],
  },
  {
    id: "green",
    name: "سبز",
    hue: 145,
    saturation: 58,
    lightness: [
      18, 23, 28, 33, 38,
      43, 48, 53, 58, 63,
      68, 73, 78, 84, 90,
    ],
  },
  {
    id: "teal",
    name: "فیروزه‌ای",
    hue: 175,
    saturation: 65,
    lightness: [
      18, 23, 28, 33, 38,
      43, 48, 53, 58, 63,
      68, 73, 78, 84, 90,
    ],
  },
  {
    id: "blue",
    name: "آبی",
    hue: 215,
    saturation: 70,
    lightness: [
      18, 23, 28, 33, 38,
      43, 48, 53, 58, 63,
      68, 73, 78, 84, 91,
    ],
  },
  {
    id: "purple",
    name: "بنفش",
    hue: 270,
    saturation: 58,
    lightness: [
      18, 23, 28, 33, 38,
      43, 48, 53, 58, 63,
      68, 73, 78, 84, 90,
    ],
  },
  {
    id: "lavender",
    name: "یاسی",
    hue: 285,
    saturation: 42,
    lightness: [
      24, 29, 34, 39, 44,
      49, 54, 59, 64, 69,
      74, 79, 84, 89, 94,
    ],
  },
  {
    id: "pink",
    name: "صورتی",
    hue: 340,
    saturation: 62,
    lightness: [
      20, 25, 30, 35, 40,
      45, 50, 55, 60, 65,
      70, 75, 80, 86, 92,
    ],
  },
  {
    id: "brown",
    name: "قهوه‌ای",
    hue: 25,
    saturation: 38,
    lightness: [
      18, 23, 28, 33, 38,
      43, 48, 53, 58, 63,
      68, 73, 78, 84, 90,
    ],
  },
  {
    id: "cream",
    name: "کرم",
    hue: 42,
    saturation: 25,
    lightness: [
      30, 35, 40, 45, 50,
      55, 60, 65, 70, 75,
      80, 84, 88, 92, 96,
    ],
  },
] as const;

const shadeNames = [
  "شب",
  "سایه",
  "عمیق",
  "تیره",
  "دود",
  "سنگ",
  "اصلی",
  "خالص",
  "نرم",
  "روشن",
  "لطیف",
  "پاستلی",
  "ابری",
  "مهتابی",
  "درخشان",
] as const;

function hslToHex(
  h: number,
  s: number,
  l: number
): string {
  s /= 100;
  l /= 100;

  const k = (n: number) =>
    (n + h / 30) % 12;

  const a =
    s * Math.min(l, 1 - l);

  const f = (n: number) =>
    l -
    a *
      Math.max(
        -1,
        Math.min(
          k(n) - 3,
          Math.min(
            9 - k(n),
            1
          )
        )
      );

  const rgb = [
    f(0),
    f(8),
    f(4),
  ].map((value) =>
    Math.round(value * 255)
  );

  return (
    "#" +
    rgb
      .map((value) =>
        value
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

function createPalette(): ColorOption[] {
  return familyDefinitions.flatMap(
    (family) =>
      family.lightness.map(
        (lightness, index) => {
          const value =
            hslToHex(
              family.hue,
              family.saturation,
              lightness
            );

          const softValue =
            hslToHex(
              family.hue,
              Math.max(
                0,
                family.saturation - 18
              ),
              Math.max(
                8,
                lightness - 12
              )
            );

          return {
            id: `${family.id}-${index + 1}`,

            name: `${family.name} ${shadeNames[index]}`,

            value,

            softValue,

            // گروه اصلی رنگ
            group: family.id,

            // نام فارسی گروه
            groupName: family.name,
          };
        }
      )
  );
}

export const colors: ColorOption[] =
  createPalette();