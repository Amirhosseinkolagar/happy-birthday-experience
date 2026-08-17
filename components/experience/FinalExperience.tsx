"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

import { colors } from "@/data/colors";
import { visualWorlds } from "@/data/worlds";
import { emotions } from "@/data/emotions";
import { symbols } from "@/data/symbols";
import { lightingOptions } from "@/data/lighting";
import { musicOptions } from "@/data/music";

import { useExperience } from "@/hooks/useExperience";

type FinalExperienceProps = {
  onFinish?: () => void;
};

type RGB = {
  r: number;
  g: number;
  b: number;
};

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "").trim();

  if (clean.length !== 3 && clean.length !== 6) {
    return null;
  }

  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;

  const value = Number.parseInt(normalized, 16);

  if (Number.isNaN(value)) {
    return null;
  }

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return 0.5;
  }

  const values = [
    rgb.r / 255,
    rgb.g / 255,
    rgb.b / 255,
  ].map((value) =>
    value <= 0.03928
      ? value / 12.92
      : Math.pow(
          (value + 0.055) / 1.055,
          2.4
        )
  );

  return (
    0.2126 * values[0] +
    0.7152 * values[1] +
    0.0722 * values[2]
  );
}

function getContrastRatio(
  colorA: string,
  colorB: string
): number {
  const lumA = getLuminance(colorA);
  const lumB = getLuminance(colorB);

  const brightest = Math.max(lumA, lumB);
  const darkest = Math.min(lumA, lumB);

  return (
    (brightest + 0.05) /
    (darkest + 0.05)
  );
}

function getReadableTextColor(
  preferred: string,
  alternatives: string[]
): string {
  const candidates = [
    preferred,
    ...alternatives,
    "#F8F3E9",
  ];

  const background = "#101010";

  for (const candidate of candidates) {
    if (
      getContrastRatio(
        candidate,
        background
      ) >= 4.5
    ) {
      return candidate;
    }
  }

  return "#F8F3E9";
}

function getButtonTextColor(
  buttonColor: string
): string {
  const luminance =
    getLuminance(buttonColor);

  return luminance > 0.42
    ? "#17120D"
    : "#FFFFFF";
}

function getUsableBorderColor(
  color: string
): string {
  const luminance =
    getLuminance(color);

  if (luminance < 0.045) {
    return "#C7A45B";
  }

  return color;
}

export default function FinalExperience({
  onFinish,
}: FinalExperienceProps) {
  const { preferences } =
    useExperience();

  const [
    surpriseStarted,
    setSurpriseStarted,
  ] = useState(false);

  const [
    balloonsGone,
    setBalloonsGone,
  ] = useState(false);

  const [
    envelopeVisible,
    setEnvelopeVisible,
  ] = useState(false);

  const [
    letterOpen,
    setLetterOpen,
  ] = useState(false);

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  /*
   * ==================================================
   * USER COLORS
   * ==================================================
   */

  const selectedColors =
    useMemo(
      () =>
        (preferences.colors ?? [])
          .map((id) =>
            colors.find(
              (color) =>
                color.id === id
            )
          )
          .filter(
            (
              color
            ): color is (typeof colors)[number] =>
              Boolean(color)
          ),
      [preferences.colors]
    );

  const primary =
    selectedColors[0]?.value ??
    "#C7A45B";

  const secondary =
    selectedColors[1]?.value ??
    selectedColors[0]?.softValue ??
    "#A9824A";

  const tertiary =
    selectedColors[2]?.value ??
    "#D9B873";

  const titleColor =
    useMemo(
      () =>
        getReadableTextColor(
          primary,
          selectedColors
            .slice(1)
            .map(
              (color) =>
                color.value
            )
        ),
      [
        primary,
        selectedColors,
      ]
    );

  const buttonColor =
    secondary;

  const buttonTextColor =
    getButtonTextColor(
      buttonColor
    );

  const envelopeBorderColor =
    getUsableBorderColor(
      tertiary
    );

  /*
   * ==================================================
   * WORLD
   * ==================================================
   */

  const world =
    visualWorlds.find(
      (item) =>
        item.id ===
        (preferences.worlds?.[0] ??
          "")
    ) ?? visualWorlds[0];

  /*
   * ==================================================
   * EMOTION
   * ==================================================
   */

  const selectedEmotion =
    emotions.find(
      (item) =>
        item.id ===
        (preferences.emotions?.[0] ??
          "")
    ) ?? emotions[0];

  /*
   * ==================================================
   * SYMBOL
   * ==================================================
   */

  const selectedSymbol =
    symbols.find(
      (item) =>
        item.id ===
        (preferences.secretSymbol ??
          preferences.symbols?.[0] ??
          "")
    ) ?? symbols[0];

  /*
   * ==================================================
   * LIGHTING
   * ==================================================
   */

  const lighting =
    lightingOptions.find(
      (item) =>
        item.id ===
        (preferences.lighting ?? "")
    ) ?? lightingOptions[0];

  /*
   * ==================================================
   * MUSIC
   * ==================================================
   */

  const music =
    musicOptions.find(
      (item) =>
        item.id ===
        (preferences.music?.[0] ??
          "")
    ) ?? null;

  const profile =
    preferences.profile;

  /*
   * ==================================================
   * AUDIO
   * ==================================================
   */

  useEffect(() => {
    if (!music?.audio) {
      return;
    }

    const audio =
      new Audio(music.audio);

    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.38;

    audioRef.current = audio;

    const tryPlay =
      async () => {
        try {
          await audio.play();
        } catch {
          // Autoplay ممکن است توسط مرورگر مسدود شود.
        }
      };

    void tryPlay();

    const handleInteraction =
      async () => {
        if (!audio.paused) {
          return;
        }

        try {
          await audio.play();
        } catch {
          // در تعامل بعدی دوباره تلاش می‌شود.
        }
      };

    window.addEventListener(
      "pointerdown",
      handleInteraction,
      { once: true }
    );

    window.addEventListener(
      "keydown",
      handleInteraction,
      { once: true }
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        handleInteraction
      );

      window.removeEventListener(
        "keydown",
        handleInteraction
      );

      audio.pause();
      audio.src = "";

      if (
        audioRef.current ===
        audio
      ) {
        audioRef.current = null;
      }
    };
  }, [music]);

  /*
   * ==================================================
   * SURPRISE
   * ==================================================
   */

  function startSurprise() {
    if (surpriseStarted) {
      return;
    }

    setSurpriseStarted(true);

    window.setTimeout(() => {
      setBalloonsGone(true);
    }, 3000);

    window.setTimeout(() => {
      setEnvelopeVisible(true);
    }, 3300);
  }

  function openEnvelope() {
    setLetterOpen(true);
  }

  function closeLetter() {
    setLetterOpen(false);
  }

  function finishExperience() {
    onFinish?.();
  }

  /*
   * ==================================================
   * BIRTHDAY MESSAGE
   * ==================================================
   */

  const birthdayMessage =
    useMemo(() => {
      const name =
        profile?.name?.trim() ||
        "دوست عزیز";

      const wish =
        profile?.wish?.trim() ||
        "آرزویی که در دلت داری";

      const age = profile?.age
        ? `در ${profile.age} سالگی`
        : "";

      return {
        greeting:
          `تولدت مبارک ${name} عزیز`,

        body:
          `امروز فقط یک روز دیگر در تقویم نیست؛
امروز روزی‌ست که زندگی، یک دلیل تازه برای لبخند زدن دارد؛
چون تو یک سال دیگر از مسیر زیبای زندگی‌ات را پشت سر گذاشتی.

امیدوارم ${age} روزهایت
بیشتر از همیشه با آرامش، آدم‌های خوب،
خبرهای شیرین و اتفاق‌هایی پر شود
که ارزش به خاطر سپردن داشته باشند.

امیدوارم هر صبح، حتی در میان شلوغی زندگی،
چیزی پیدا کنی که دلت را گرم کند
و هر شب با خیال راحت‌تری چشم‌هایت را ببندی.`,

        wish:
          `و از میان تمام خواسته‌هایی که
در گوشه‌ی قلبت نگه داشته‌ای،
از خدا می‌خواهم به‌خصوص آرزوی

«${wish}»

را اگر خیر و صلاح تو در آن است،
به زیباترین شکل ممکن به اجابت برساند؛
طوری که وقتی به گذشته نگاه می‌کنی،
با لبخند بگویی:
«ارزش تمام آن انتظار را داشت.»`,

        prayers:
          `الهی همیشه تنت سالم،
دلت آرام و قلبت سرشار از امید باشد.

الهی زندگی‌ات پر از برکت،
فراوانی، روزی پاک و اتفاق‌های نیک باشد.

الهی عزیزانت همیشه در کنارت باشند
و خانه‌ی دلت از محبت و آرامش خالی نشود.

الهی در مسیر زندگی‌ات
آدم‌های درست، فرصت‌های خوب
و انتخاب‌های روشن قرار بگیرند.

و الهی هر چیزی که برایت خیر است،
در بهترین زمان و زیباترین شکل
سر راهت قرار بگیرد.`,

        ending:
          `برای تو سالی پر از لبخند،
خبرهای خوب، تجربه‌های قشنگ
و لحظه‌هایی آرزو می‌کنم
که ارزش به خاطر سپردن داشته باشند.

تولدت خیلی خیلی مبارک`,
      };
    }, [
      profile?.name,
      profile?.age,
      profile?.wish,
    ]);

  /*
   * ==================================================
   * ENVELOPE STYLE
   * ==================================================
   */

  const envelopeStyle: CSSProperties =
    {
      borderColor:
        `${envelopeBorderColor}D0`,
    };

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-black text-white"
    >
      {/* ==================================================
          WORLD BACKGROUND
          ================================================== */}

      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image
          src={world.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-center"
        />

        <div
          className="absolute inset-0"
          style={{
            background: `
              ${lighting.gradient},
              linear-gradient(
                to bottom,
                rgba(0,0,0,0.48),
                rgba(0,0,0,0.62) 50%,
                rgba(0,0,0,0.55)
              )
            `,
          }}
        />

        <div
          className="absolute -inset-[2px] bg-black/10"
          style={{
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* ==================================================
          COLOR ATMOSPHERE
          ================================================== */}

      <div className="pointer-events-none fixed inset-0 z-[2]">
        {selectedColors.map(
          (color, index) => (
            <motion.div
              key={color.id}
              className="absolute h-72 w-72 rounded-full blur-3xl"
              style={{
                background:
                  color.value,
                opacity: 0.075,
                left: `${
                  8 + index * 35
                }%`,
                top: `${
                  15 +
                  (index % 2) *
                    55
                }%`,
              }}
              animate={{
                x: [
                  0,
                  25,
                  -15,
                  0,
                ],
                y: [
                  0,
                  -20,
                  20,
                  0,
                ],
                scale: [
                  1,
                  1.1,
                  0.95,
                  1,
                ],
              }}
              transition={{
                duration:
                  14 +
                  index * 2,
                repeat:
                  Infinity,
                ease:
                  "easeInOut",
              }}
            />
          )
        )}
      </div>

      {/* ==================================================
          SYMBOL PARTICLES
          ================================================== */}

      <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
        {Array.from({
          length: 18,
        }).map((_, index) => {
          const left =
            (index * 37) % 100;

          const delay =
            (index % 8) * 0.8;

          const duration =
            8 +
            (index % 5) *
              1.4;

          const size =
            20 +
            (index % 4) * 7;

          return (
            <motion.div
              key={index}
              className="absolute top-[-80px]"
              style={{
                left: `${left}%`,
              }}
              initial={{
                y: -100,
                opacity: 0,
              }}
              animate={{
                y: "115vh",
                opacity: [
                  0,
                  0.55,
                  0.4,
                  0,
                ],
              }}
              transition={{
                duration,
                delay,
                repeat:
                  Infinity,
                ease: "linear",
              }}
            >
              <div
                className="relative overflow-hidden rounded-full"
                style={{
                  width: size,
                  height: size,
                }}
              >
                <Image
                  src={
                    selectedSymbol.image
                  }
                  alt=""
                  fill
                  sizes={`${size}px`}
                  className="object-cover"
                  style={{
    filter: `
      brightness(1.35)
      contrast(1.15)
      saturate(1.15)
    `,
  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ==================================================
          CONTENT
          ================================================== */}

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-20">
        <AnimatePresence mode="wait">

          {/* ==================================================
              INTRO
              ================================================== */}

          {!surpriseStarted && (
            <motion.div
              key="intro"
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              transition={{
                duration: 0.9,
              }}
              className="w-full max-w-2xl text-center"
            >
              {profile?.name && (
                <p className="text-sm text-white/70">
                  {profile.name} عزیز
                </p>
              )}

              <h1
                className="mt-6 text-4xl font-semibold leading-tight sm:text-6xl"
                style={{
                  color:
                    titleColor,
                  textShadow: `
                    0 0 25px
                    rgba(0,0,0,0.65),
                    0 0 45px
                    ${titleColor}30
                  `,
                }}
              >
                دنیایی که برای تو ساخته شد
              </h1>

              <p className="mx-auto mt-6 max-w-lg text-sm leading-8 text-white/70 sm:text-base">
                همه‌چیز آماده است...
                <br />
                فقط یک چیز باقی مانده.
              </p>

              <motion.button
                type="button"
                onClick={
                  startSurprise
                }
                whileHover={{
                  scale: 1.04,
                  boxShadow: `
                    0 0 35px
                    ${buttonColor}55
                  `,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="mt-12 rounded-full border px-8 py-4 text-sm font-medium transition-all"
                style={{
                  color:
                    buttonTextColor,
                  borderColor:
                    `${buttonColor}D0`,
                  background: `
                    linear-gradient(
                      135deg,
                      ${buttonColor},
                      ${buttonColor}D9
                    )
                  `,
                  boxShadow: `
                    0 10px 35px
                    rgba(0,0,0,0.35),
                    0 0 25px
                    ${buttonColor}30
                  `,
                }}
              >
                آماده‌ای سوپرایزت رو ببینی؟

                <span className="mr-2">
                  ✨
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* ==================================================
              BALLOONS
              ================================================== */}

          {surpriseStarted &&
            !balloonsGone && (
              <motion.div
                key="balloons"
                className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
                exit={{
                  opacity: 0,
                }}
              >
                {Array.from({
                  length: 20,
                }).map(
                  (_, index) => {
                    const balloonColors =
                      [
                        primary,
                        secondary,
                        tertiary,
                      ];

                    const balloonColor =
                      balloonColors[
                        index %
                          balloonColors.length
                      ];

                    return (
                      <motion.div
                        key={index}
                        className="absolute bottom-[-140px]"
                        style={{
                          left: `${
                            4 +
                            (index *
                              47) %
                              92
                          }%`,
                        }}
                        initial={{
                          y: 0,
                          opacity: 0,
                        }}
                        animate={{
                          y: "-125vh",
                          opacity: [
                            0,
                            1,
                            1,
                            0,
                          ],
                          rotate: [
                            -8,
                            8,
                            -5,
                            5,
                          ],
                        }}
                        transition={{
                          duration:
                            4 +
                            (index %
                              5) *
                              0.35,
                          delay:
                            (index %
                              6) *
                            0.08,
                          ease:
                            "easeOut",
                        }}
                      >
                        <div
                          className="relative h-16 w-12 rounded-[50%]"
                          style={{
                            background: `
                              radial-gradient(
                                circle at 35% 25%,
                                rgba(255,255,255,0.75),
                                transparent 18%
                              ),
                              ${balloonColor}
                            `,
                          }}
                        />

                        <div className="mx-auto h-16 w-px bg-white/35" />
                      </motion.div>
                    );
                  }
                )}
              </motion.div>
            )}

          {/* ==================================================
              ENVELOPE
              ================================================== */}

          {envelopeVisible &&
            !letterOpen && (
              <motion.div
                key="envelope"
                initial={{
                  opacity: 0,
                  y: 80,
                  scale: 0.88,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.9,
                }}
                className="relative z-40 w-full max-w-[520px]"
              >
                <div
                  className="absolute inset-x-10 bottom-[-25px] h-14 rounded-full blur-3xl"
                  style={{
                    background:
                      `${envelopeBorderColor}35`,
                  }}
                />

                <motion.button
                  type="button"
                  onClick={
                    openEnvelope
                  }
                  whileHover={{
                    scale: 1.015,
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  className="relative block aspect-[1.55/1] w-full overflow-hidden rounded-[20px] text-right"
                  aria-label="باز کردن نامه"
                  style={{
                    ...envelopeStyle,
                    borderWidth: 3,
                    borderStyle:
                      "solid",
                    boxShadow: `
                      0 30px 80px
                      rgba(0,0,0,0.50),
                      0 0 40px
                      ${envelopeBorderColor}28
                    `,
                  }}
                >
                  {/* LETTER IMAGE BASE */}

                  <Image
                    src={
                      selectedEmotion.image
                    }
                    alt=""
                    fill
                    priority
                    sizes="92vw"
                    className="object-cover object-center"
                  />

                  {/* IMAGE PROTECTION */}

                  <div className="pointer-events-none absolute inset-0 bg-black/20" />

                  {/* ENVELOPE BODY */}

                  <div>
                    <div
                      className="absolute bottom-0 left-0 h-full w-1/2"
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 100%, 0 100%)",
                        borderRight:
                          `3px solid ${envelopeBorderColor}D0`,
                      }}
                    />

                    <div
                      className="absolute bottom-0 right-0 h-full w-1/2"
                      style={{
                        clipPath:
                          "polygon(100% 0, 100% 100%, 0 100%)",
                        borderLeft:
                          `3px solid ${envelopeBorderColor}D0`,
                      }}
                    />
                  </div>

                  {/* ==================================================
                      TRIANGULAR FLAP
                      ================================================== */}

                  <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[58%]">
                    <div
                      className="absolute left-0 top-0 h-[3px] w-[57%] origin-left"
                      style={{
                        transform:
                          "rotate(31deg)",
                        background:
                          `${envelopeBorderColor}E5`,
                      }}
                    />

                    <div
                      className="absolute right-0 top-0 h-[3px] w-[57%] origin-right"
                      style={{
                        transform:
                          "rotate(-31deg)",
                        background:
                          `${envelopeBorderColor}E5`,
                      }}
                    />
                  </div>

                  {/* ==================================================
                      SYMBOL ON ENVELOPE
                      WHITE BACKGROUND + BORDER
                      ================================================== */}

                  <div className="absolute left-1/2 top-[52%] z-50 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      whileHover={{
                        scale: 1.06,
                        rotate: 2,
                      }}
                      className="relative h-[82px] w-[82px] overflow-hidden rounded-full border-[3px] bg-white shadow-2xl"
                      style={{
                        borderColor:
                          `${envelopeBorderColor}DD`,
                        boxShadow: `
                          0 0 0 5px rgba(0,0,0,0.20),
                          0 0 35px ${envelopeBorderColor}70
                        `,
                      }}
                    >
                      <Image
                        src={
                          selectedSymbol.image
                        }
                        alt=""
                        fill
                        sizes="82px"
                        className="object-contain"
                      />
                    </motion.div>
                  </div>

                  {/* ==================================================
                      TEXT
                      ================================================== */}

                  <div className="absolute bottom-6 left-0 right-0 z-40 text-center">
                    <span
                      className="text-xs tracking-[0.25em] text-white"
                      style={{
                        textShadow:
                          "0 1px 4px rgba(0,0,0,0.8)",
                      }}
                    >
                      یک پیام برای تو
                    </span>

                    <div
                      className="mt-2 text-lg font-semibold text-white"
                      style={{
                        textShadow:
                          "0 2px 8px rgba(0,0,0,0.8)",
                      }}
                    >
                      سوپرایزت رو ببین
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            )}

          {/* ==================================================
              LETTER
              ================================================== */}

          {letterOpen && (
            <motion.div
              key="letter"
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 35,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="relative z-50 w-full max-w-[560px]"
            >
              {/*
               * نامه:
               * نسبت اصلی تصویر = 1122 / 1402
               * ≈ 0.8003
               *
               * ارتفاع عمداً محدود شده.
               */}

              <div
  className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] shadow-2xl"
  style={{
    aspectRatio: "1122 / 1402",
  }}
>
                {/* ==================================================
                    FIXED LETTER BACKGROUND
                    NO BORDER
                    ================================================== */}

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <Image
                    src={
                      lighting.image
                    }
                    alt=""
                    fill
                    priority
                    sizes="94vw"
                    className="object-fill"
                  />

                  {/* خوانایی متن بدون قاب */}

                  <div
                    className="absolute inset-0"
                    style={{
                      background: `
                        linear-gradient(
                          180deg,
                          rgba(0,0,0,0.42),
                          rgba(0,0,0,0.58) 50%,
                          rgba(0,0,0,0.48)
                        ),
                        radial-gradient(
                          circle at center,
                          rgba(0,0,0,0.08),
                          rgba(0,0,0,0.38)
                        )
                      `,
                    }}
                  />
                </div>

                {/* ==================================================
                    SCROLLABLE LETTER CONTENT
                    ================================================== */}

                <div className="relative z-10 h-full overflow-y-auto overscroll-contain px-7 py-8 sm:px-10 sm:py-10">

                  {/* ==================================================
                      SYMBOL INSIDE LETTER
                      NO BACKGROUND
                      NO BORDER
                      ================================================== */}

                  <div className="mb-7 flex justify-center">
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        rotate: 2,
                      }}
                      className="relative h-16 w-16 overflow-hidden rounded-full bg-transparent"
                      style={{
                        filter: `
                          drop-shadow(
                            0 0 18px
                            ${envelopeBorderColor}45
                          )
                        `,
                      }}
                    >
                      <Image
                        src={
                          selectedSymbol.image
                        }
                        alt=""
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </motion.div>
                  </div>

                  {/* ==================================================
                      GREETING
                      ================================================== */}

                  <h2
                    className="text-center text-2xl font-bold sm:text-3xl"
                    style={{
                      color:
                        "#FFFDF8",
                      textShadow:
                        "0 2px 12px rgba(0,0,0,0.55)",
                    }}
                  >
                    {
                      birthdayMessage.greeting
                    }
                  </h2>

                  <div
                    className="mx-auto mt-5 h-[2px] w-20 rounded-full"
                    style={{
                      background:
                        envelopeBorderColor,
                      boxShadow:
                        `0 0 12px ${envelopeBorderColor}55`,
                    }}
                  />

                  {/* ==================================================
                      BODY
                      ================================================== */}

                  <p
                    className="mt-8 whitespace-pre-line text-sm leading-9 sm:text-base"
                    style={{
                      color:
                        "rgba(255,255,255,0.90)",
                      textShadow:
                        "0 1px 7px rgba(0,0,0,0.75)",
                    }}
                  >
                    {
                      birthdayMessage.body
                    }
                  </p>

                  {/* ==================================================
                      WISH
                      ================================================== */}

                  <div
                    className="my-8 rounded-2xl p-5"
                    style={{
                      background:
                        "rgba(0,0,0,0.24)",
                      boxShadow:
                        `inset 0 0 30px ${envelopeBorderColor}08`,
                    }}
                  >
                    <p
                      className="whitespace-pre-line text-sm font-semibold leading-9 sm:text-base"
                      style={{
                        color:
                          "#FFFDF8",
                        textShadow:
                          "0 1px 7px rgba(0,0,0,0.80)",
                      }}
                    >
                      {
                        birthdayMessage.wish
                      }
                    </p>
                  </div>

                  {/* ==================================================
                      PRAYERS
                      ================================================== */}

                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background:
                        "rgba(0,0,0,0.20)",
                    }}
                  >
                    <p
                      className="whitespace-pre-line text-sm leading-9 sm:text-base"
                      style={{
                        color:
                          "rgba(255,255,255,0.88)",
                        textShadow:
                          "0 1px 7px rgba(0,0,0,0.80)",
                      }}
                    >
                      {
                        birthdayMessage.prayers
                      }
                    </p>
                  </div>

                  {/* ==================================================
                      ENDING
                      ================================================== */}

                  <div
                    className="mt-9 pt-7"
                    style={{
                      borderTop:
                        `1px solid ${envelopeBorderColor}45`,
                    }}
                  >
                    <p
                      className="whitespace-pre-line text-center text-sm leading-9 sm:text-base"
                      style={{
                        color:
                          "#FFFDF8",
                        textShadow:
                          "0 1px 8px rgba(0,0,0,0.80)",
                      }}
                    >
                      {
                        birthdayMessage.ending
                      }
                    </p>

                    <div className="mt-7 flex items-center justify-center gap-4">
                      <span
                        className="text-3xl"
                        style={{
                          filter:
                            "drop-shadow(0 0 10px rgba(239,68,68,0.35))",
                        }}
                      >
                        ❤️
                      </span>

                      {/* ==================================================
                          SYMBOL INSIDE LETTER
                          NO BACKGROUND
                          NO BORDER
                          ================================================== */}

                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          rotate: 2,
                        }}
                        className="relative h-14 w-14 overflow-hidden rounded-full bg-transparent"
                        style={{
                          filter: `
                            drop-shadow(
                              0 0 15px
                              ${envelopeBorderColor}40
                            )
                          `,
                        }}
                      >
                        <Image
                          src={
                            selectedSymbol.image
                          }
                          alt=""
                          fill
                          sizes="56px"
                          className="object-contain"
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* ==================================================
                      CLOSE
                      ================================================== */}

                  <div className="mt-9 flex justify-center pb-4">
                    <motion.button
                      type="button"
                      onClick={
                        closeLetter
                      }
                      whileHover={{
                        scale: 1.03,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      className="rounded-full border px-7 py-3 text-sm font-medium"
                      style={{
                        borderColor:
                          `${envelopeBorderColor}90`,
                        background:
                          `${envelopeBorderColor}18`,
                        color:
                          "#FFFFFF",
                        boxShadow:
                          `0 0 20px ${envelopeBorderColor}15`,
                      }}
                    >
                      بستن نامه
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================================================
              FINISH
              ================================================== */}

          {!letterOpen &&
            envelopeVisible &&
            balloonsGone && (
              <motion.div
                key="finish"
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6"
              >
                <motion.button
                  type="button"
                  onClick={
                    finishExperience
                  }
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="rounded-full border px-8 py-4 text-sm font-medium shadow-2xl"
                  style={{
                    color:
                      buttonTextColor,

                    borderColor:
                      `${buttonColor}C0`,

                    background: `
                      linear-gradient(
                        135deg,
                        ${buttonColor},
                        ${buttonColor}D9
                      )
                    `,

                    boxShadow:
                      `0 0 35px ${buttonColor}30`,
                  }}
                >
                  پایان این تجربه خاص ✨
                </motion.button>
              </motion.div>
            )}

        </AnimatePresence>
      </section>
    </main>
  );
}