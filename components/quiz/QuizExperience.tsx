"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
} from "react";

import { motion } from "motion/react";

import { colors } from "@/data/colors";
import { useExperience } from "@/hooks/useExperience";
import { useExperienceAudio } from "@/src/components/audio/ExperienceAudioManager";
import { buildExperienceTheme } from "@/lib/experienceEngine";

import ColorUniverse from "./ColorUniverse";
import QuizProgress from "./QuizProgress";
import SelectionCounter from "./SelectionCounter";
import WorldGallery from "./WorldGallery";
import EmotionGallery from "./EmotionGallery";
import MusicGallery from "./MusicGallery";
import LightingGallery from "./LightingGallery";
import SymbolGallery from "./SymbolGallery";

import FinalExperience from "../experience/FinalExperience";
import ExperienceCredits from "../experience/ExperienceCredits";

type QuizStep =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7;

const FINAL_AUDIO_DELAY = 2000;

export default function QuizExperience() {
  const [step, setStep] =
    useState<QuizStep>(1);

  const [colorsRevealed, setColorsRevealed] =
    useState(false);

  const [showCredits, setShowCredits] =
    useState(false);

  const [preparingFinal, setPreparingFinal] =
    useState(false);

  const {
    preferences,
    setColors,
    setWorlds,
    setEmotions,
    setMusic,
    setLighting,
    setSymbols,
  } = useExperience();

  const {
    fadeOut,
  } = useExperienceAudio();

  /*
   * =======================================================
   * COLORS
   * =======================================================
   */

  const selectedColors =
    preferences.colors;

  const selectedColorValues =
    useMemo(() => {
      return selectedColors
        .map((id) =>
          colors.find(
            (color) =>
              color.id === id
          )
        )
        .filter(
          (
            color
          ): color is NonNullable<
            typeof color
          > => Boolean(color)
        );
    }, [selectedColors]);

  const colorsComplete =
    selectedColors.length === 3;

  const primary =
    selectedColorValues[0]?.value ??
    "#D4AF37";

  const secondary =
    selectedColorValues[1]?.value ??
    "#6E5D3C";

  const accent =
    selectedColorValues[2]?.value ??
    "#D4AF37";

  /*
   * =======================================================
   * COLOR CHANGE
   * =======================================================
   */

  function handleColorsChange(
    nextColors: string[]
  ) {
    setColors(nextColors);

    setColorsRevealed(false);

    if (nextColors.length === 3) {
      window.setTimeout(() => {
        setColorsRevealed(true);
      }, 850);
    }
  }

  /*
   * =======================================================
   * WORLD
   * =======================================================
   */

  function handleWorldsComplete(
    worldIds: string[]
  ) {
    const nextPreferences = {
      ...preferences,
      worlds: worldIds,
    };

    setWorlds(worldIds);

    const theme =
      buildExperienceTheme({
        preferences:
          nextPreferences,
      });

    console.log(
      "Experience preferences:",
      nextPreferences
    );

    console.log(
      "Generated experience theme:",
      theme
    );

    setStep(3);
  }

  /*
   * =======================================================
   * EMOTION
   * =======================================================
   */

  function handleEmotionComplete(
    emotionIds: string[]
  ) {
    setEmotions(
      emotionIds
    );

    console.log(
      "Selected emotions:",
      emotionIds
    );

    setStep(4);
  }

  /*
   * =======================================================
   * MUSIC
   * =======================================================
   */

  function handleMusicComplete(
    musicIds: string[]
  ) {
    setMusic(
      musicIds
    );

    console.log(
      "Selected music:",
      musicIds
    );

    setStep(5);
  }

  /*
   * =======================================================
   * LIGHTING
   * =======================================================
   */

  function handleLightingComplete(
    lightingId: string
  ) {
    setLighting(
      lightingId
    );

    console.log(
      "Selected lighting:",
      lightingId
    );

    setStep(6);
  }

  /*
   * =======================================================
   * SYMBOL
   * =======================================================
   *
   * بعد از انتخاب Symbol:
   *
   * Symbol
   *    ↓
   *  2 seconds
   *    ↓
   * Background Music Fade Out
   *    ↓
   * FinalExperience
   *
   * =======================================================
   */

  async function handleSymbolsComplete(
    symbolIds: string[]
  ) {
    if (preparingFinal) {
      return;
    }

    setSymbols(
      symbolIds
    );

    console.log(
      "Selected symbols:",
      symbolIds
    );

    setPreparingFinal(true);

    /*
     * -------------------------------------------------------
     * اجازه می‌دهیم آخرین بخش SymbolExperience
     * کمی روی صفحه بماند.
     * -------------------------------------------------------
     */

    await new Promise<void>(
      (resolve) => {
        window.setTimeout(
          resolve,
          FINAL_AUDIO_DELAY
        );
      }
    );

    /*
     * -------------------------------------------------------
     * حالا موزیک Background را کامل Fade Out می‌کنیم.
     *
     * stopAfter = true
     *
     * یعنی بعد از Fade Out:
     *
     * pause()
     * currentTime = 0
     *
     * -------------------------------------------------------
     */

    await fadeOut(true);

    /*
     * -------------------------------------------------------
     * فقط بعد از قطع کامل موزیک وارد Final می‌شویم.
     * -------------------------------------------------------
     */

    setStep(7);
    setPreparingFinal(false);
  }

  /*
   * =======================================================
   * NEXT
   * =======================================================
   */

  function handleNextStep() {
    if (!colorsRevealed) {
      return;
    }

    setStep(2);
  }

  /*
   * =======================================================
   * CREDITS
   * =======================================================
   */

  if (showCredits) {
    return (
      <ExperienceCredits
        onHome={() => {
          window.location.reload();
        }}
      />
    );
  }

  /*
   * =======================================================
   * FINAL PREPARATION
   * =======================================================
   */

  if (preparingFinal) {
    return (
      <main
        className="quiz-screen final-preparing-screen"
        aria-label="Preparing final experience"
      >
        <div className="color-orbit color-orbit-one" />
        <div className="color-orbit color-orbit-two" />

        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 24,
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <p
              style={{
                margin: 0,
                opacity: 0.6,
                fontSize: 13,
                letterSpacing: 3,
              }}
            >
              YOUR STORY
            </p>

            <h1
              style={{
                marginTop: 18,
                marginBottom: 0,
                fontSize:
                  "clamp(28px, 5vw, 56px)",
                fontWeight: 400,
              }}
            >
              لحظه‌ی تو نزدیک است...
            </h1>
          </motion.div>
        </section>
      </main>
    );
  }

  /*
   * =======================================================
   * STEP 2 — WORLD
   * =======================================================
   */

  if (step === 2) {
    return (
      <WorldGallery
        onComplete={
          handleWorldsComplete
        }
      />
    );
  }

  /*
   * =======================================================
   * STEP 3 — EMOTION
   * =======================================================
   */

  if (step === 3) {
    return (
      <EmotionGallery
        selectedEmotions={
          preferences.emotions
        }
        onComplete={
          handleEmotionComplete
        }
      />
    );
  }

  /*
   * =======================================================
   * STEP 4 — MUSIC
   * =======================================================
   */

  if (step === 4) {
    return (
      <MusicGallery
        selectedMusic={
          preferences.music
        }
        onComplete={
          handleMusicComplete
        }
      />
    );
  }

  /*
   * =======================================================
   * STEP 5 — LIGHTING
   * =======================================================
   */

  if (step === 5) {
    return (
      <LightingGallery
        selectedLighting={
          preferences.lighting
        }
        onComplete={
          handleLightingComplete
        }
      />
    );
  }

  /*
   * =======================================================
   * STEP 6 — SYMBOL
   * =======================================================
   */

  if (step === 6) {
    return (
      <SymbolGallery
        selectedSymbols={
          preferences.symbols
        }
        onChange={
          setSymbols
        }
        onComplete={
          handleSymbolsComplete
        }
      />
    );
  }

  /*
   * =======================================================
   * STEP 7 — FINAL EXPERIENCE
   * =======================================================
   */

  if (step === 7) {
    return (
      <FinalExperience
        onFinish={() => {
          setShowCredits(true);
        }}
      />
    );
  }

  /*
   * =======================================================
   * COLOR QUIZ
   * =======================================================
   */

  const quizStyle: CSSProperties & {
    "--primary": string;
    "--secondary": string;
    "--accent": string;
  } = {
    "--primary": primary,
    "--secondary": secondary,
    "--accent": accent,
  };

  return (
    <main
      dir="rtl"
      className={`quiz-screen ${
        colorsComplete
          ? "is-complete"
          : ""
      }`}
      style={quizStyle}
    >
      <div className="color-orbit color-orbit-one" />
      <div className="color-orbit color-orbit-two" />

      <QuizProgress
        current={1}
        total={7}
      />

      <section className="quiz-content">
        {/* HEADER */}

        <motion.div
          className="quiz-heading"
          layout
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <motion.span
            className="quiz-eyebrow"
            layout
          >
            {colorsRevealed
              ? "مرحله اول کامل شد"
              : "ردپای اول تو"}
          </motion.span>

          <motion.h1 layout>
            {colorsRevealed
              ? "این سه رنگ، تصادفی انتخاب نشدن..."
              : "اگر حالِ این روزهایت یک رنگ بود، چه رنگی بود؟"}
          </motion.h1>

          <motion.p layout>
            {colorsRevealed
              ? "حالا یک تکه از شخصیت این تجربه را می‌شناسیم."
              : "از بین ۱۸۰ رنگ، فقط سه تا را انتخاب کن. نه منطقی، نه درست یا غلط؛ فقط آن‌هایی که یک لحظه بیشتر نگاهت را نگه می‌دارند."}
          </motion.p>

          <motion.span
            className="quiz-hint"
            layout
          >
            {colorsRevealed
              ? "اما این فقط اولین سرنخه..."
              : "سه رنگ انتخاب کن؛ بعد می‌فهمی چرا همین سه تا."}
          </motion.span>
        </motion.div>

        {/* COLOR PANEL */}

        <div className="color-selection-stage">
          <motion.div
            className="glass-panel-glow"
            animate={{
              scale:
                colorsComplete
                  ? 1.12
                  : 1,
              opacity:
                colorsComplete
                  ? 1
                  : 0.65,
            }}
            transition={{
              duration: 1.2,
            }}
          />

          <motion.div
            className="color-panel"
            animate={{
              borderColor:
                colorsComplete
                  ? "rgba(255,255,255,0.24)"
                  : "rgba(255,255,255,0.13)",
            }}
            transition={{
              duration: 0.8,
            }}
          >
            {/* PANEL HEADER */}

            <div className="color-panel-header">
              <span>
                {colorsRevealed
                  ? "ترکیب انتخاب‌های تو"
                  : "پالت انتخاب تو"}
              </span>

              <SelectionCounter
                selected={
                  selectedColors.length
                }
                max={3}
              />
            </div>

            {/* MINI PALETTE */}

            <motion.div
              className="mini-palette"
              initial={false}
              animate={{
                opacity:
                  colorsComplete
                    ? 1
                    : 0,
                y:
                  colorsComplete
                    ? 0
                    : -8,
              }}
            >
              {selectedColorValues.map(
                (
                  color,
                  index
                ) => (
                  <motion.div
                    key={
                      color.id
                    }
                    className="mini-color"
                    style={{
                      background:
                        color.value,
                    }}
                    initial={{
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      delay:
                        index *
                        0.12,
                      type:
                        "spring",
                      stiffness:
                        260,
                      damping:
                        16,
                    }}
                  >
                    <span>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>
                  </motion.div>
                )
              )}
            </motion.div>

            {/* COLORS */}

            <ColorUniverse
              selectedColors={
                selectedColors
              }
              onChange={
                handleColorsChange
              }
            />

            {/* FOOTER */}

            <motion.p
              className="color-panel-footer"
              animate={{
                opacity:
                  colorsRevealed
                    ? 0.55
                    : 0.3,
              }}
            >
              {colorsRevealed
                ? "این فقط شروع ماجراست."
                : "انتخاب‌هایت قرار است فضای این تجربه را بسازند."}
            </motion.p>
          </motion.div>
        </div>

        {/* COMPLETE MESSAGE */}

        <motion.div
          className="completion-message"
          initial={false}
          animate={{
            opacity:
              colorsRevealed
                ? 1
                : 0,
            y:
              colorsRevealed
                ? 0
                : 15,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <span className="completion-line" />

          <span>
            سه انتخاب.
            <br />
            یک پالت کاملاً مخصوص تو.
          </span>

          <span className="completion-line" />
        </motion.div>

        {/* NEXT */}

        <motion.button
          type="button"
          className="quiz-next-button"
          disabled={
            !colorsRevealed
          }
          onClick={
            handleNextStep
          }
          initial={false}
          animate={{
            opacity:
              colorsRevealed
                ? 1
                : 0,
            y:
              colorsRevealed
                ? 0
                : 12,
            scale:
              colorsRevealed
                ? 1
                : 0.95,
          }}
          whileHover={
            colorsRevealed
              ? {
                  scale: 1.04,
                }
              : undefined
          }
          whileTap={
            colorsRevealed
              ? {
                  scale: 0.97,
                }
              : undefined
          }
        >
          کشف مرحله بعد

          <span>
            ←
          </span>
        </motion.button>
      </section>
    </main>
  );
}