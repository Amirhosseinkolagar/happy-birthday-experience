"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";

import { colors } from "@/data/colors";
import { useExperience } from "@/hooks/useExperience";
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


type QuizStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function QuizExperience() {
  const [step, setStep] = useState<QuizStep>(1);
  const [colorsRevealed, setColorsRevealed] = useState(false);

  const {
    preferences,
    setColors,
    setWorlds,
    setEmotions,
    setMusic,
    setLighting,
    setSymbols,
  } = useExperience();

  const selectedColors = preferences.colors;

  const selectedColorValues = useMemo(() => {
    return selectedColors
      .map((id) => colors.find((color) => color.id === id))
      .filter(Boolean);
  }, [selectedColors]);

  const colorsComplete = selectedColors.length === 4;

  const primary =
    selectedColorValues[0]?.value ?? "#D4AF37";

  const secondary =
    selectedColorValues[1]?.value ?? "#6E5D3C";

  const accent =
    selectedColorValues[2]?.value ?? "#D4AF37";

  function handleColorsChange(nextColors: string[]) {
    setColors(nextColors);
    setColorsRevealed(false);

    if (nextColors.length === 4) {
      setTimeout(() => {
        setColorsRevealed(true);
      }, 850);
    }
  }

  function handleWorldsComplete(worldIds: string[]) {
    const nextPreferences = {
      ...preferences,
      worlds: worldIds,
    };

    setWorlds(worldIds);

    const theme = buildExperienceTheme(
      nextPreferences
    );

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

  function handleEmotionComplete(emotionIds: string[]) {
    setEmotions(emotionIds);

    console.log("Selected emotions:", emotionIds);

    setStep(4);
  }

  function handleMusicComplete(musicIds: string[]) {
    setMusic(musicIds);

    console.log("Selected music:", musicIds);

    setStep(5);
  }

  function handleLightingComplete(lightingId: string) {
    setLighting(lightingId);

    console.log("Selected lighting:", lightingId);

    setStep(6);
  }

  function handleSymbolsComplete(symbolIds: string[]) {
    setSymbols(symbolIds);

    console.log("Selected symbols:", symbolIds);

    setStep(7);
  }

  

  function handleNextStep() {
    if (!colorsRevealed) {
      return;
    }

    setStep(2);
  }

  if (step === 2) {
    return (
      <WorldGallery
        onComplete={handleWorldsComplete}
      />
    );
  }

  if (step === 3) {
    return (
      <EmotionGallery
      selectedEmotions={preferences.emotions}
      onComplete={handleEmotionComplete}
      />
    );
  }

  if (step === 4) {
    return (
      <MusicGallery
        selectedMusic={preferences.music}
        onComplete={handleMusicComplete}
      />
    );
  }

  if (step === 5) {
    return (
      <LightingGallery
        selectedLighting={preferences.lighting}
        onComplete={handleLightingComplete}
      />
    );
  }

  if (step === 6) {
    return (
      <SymbolGallery
        selectedSymbols={preferences.symbols}
        onChange={setSymbols}
        onComplete={handleSymbolsComplete}
      />
    );
  }

  if (step === 7) {
  return (
    <FinalExperience
      preferences={preferences}
    />
  );
}

  return (
    <main
      dir="rtl"
      className={`quiz-screen ${
        colorsComplete ? "is-complete" : ""
      }`}
      style={
        {
          "--primary": primary,
          "--secondary": secondary,
          "--accent": accent,
        } as React.CSSProperties
      }
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
              ? "پالت تو آماده‌ست"
              : "انتخاب اول"}
          </motion.span>

          <motion.h1 layout>
            {colorsRevealed
              ? "پالتت شکل گرفت..."
              : "اولین چیزی که انتخاب می‌کنی، یک رنگه"}
          </motion.h1>

          <motion.p layout>
            {colorsRevealed
              ? "چهار انتخاب تو، اولین تکه از این تجربه را ساختند."
              : "چهار رنگ را انتخاب کن؛ بدون فکر زیاد. فقط ببین کدام رنگ بیشتر صدایت می‌کند."}
          </motion.p>

          <motion.span
            className="quiz-hint"
            layout
          >
            {colorsRevealed
              ? "حالا بریم سراغ دنیایی که بیشتر شبیه توئه..."
              : "انتخابت را جدی نگیر؛ فقط به حست اعتماد کن."}
          </motion.span>
        </motion.div>

        {/* COLOR PANEL */}
        <div className="color-selection-stage">

          <motion.div
            className="glass-panel-glow"
            animate={{
              scale: colorsComplete ? 1.12 : 1,
              opacity: colorsComplete ? 1 : 0.65,
            }}
            transition={{
              duration: 1.2,
            }}
          />

          <motion.div
            className="color-panel"
            animate={{
              borderColor: colorsComplete
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
                selected={selectedColors.length}
                max={4}
              />

            </div>

            {/* MINI PALETTE */}
            <motion.div
              className="mini-palette"
              initial={false}
              animate={{
                opacity: colorsComplete ? 1 : 0,
                y: colorsComplete ? 0 : -8,
              }}
            >
              {selectedColorValues.map(
                (color, index) => (
                  <motion.div
                    key={color?.id}
                    className="mini-color"
                    style={{
                      background:
                        color?.value,
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
                      delay: index * 0.12,
                      type: "spring",
                      stiffness: 260,
                      damping: 16,
                    }}
                  >
                    <span>
                      {String(index + 1).padStart(
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
              selectedColors={selectedColors}
              onChange={handleColorsChange}
            />

            <motion.p
              className="color-panel-footer"
              animate={{
                opacity: colorsRevealed
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
            opacity: colorsRevealed ? 1 : 0,
            y: colorsRevealed ? 0 : 15,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <span className="completion-line" />

          <span>
            چهار انتخاب.
            <br />
            یک پالت کاملاً مخصوص تو.
          </span>

          <span className="completion-line" />
        </motion.div>

        {/* NEXT */}
        <motion.button
          type="button"
          className="quiz-next-button"
          disabled={!colorsRevealed}
          onClick={handleNextStep}
          initial={false}
          animate={{
            opacity: colorsRevealed ? 1 : 0,
            y: colorsRevealed ? 0 : 12,
            scale: colorsRevealed ? 1 : 0.95,
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

          <span>←</span>
        </motion.button>

      </section>
    </main>
  );
}