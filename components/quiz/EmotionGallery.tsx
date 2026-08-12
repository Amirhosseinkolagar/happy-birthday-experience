"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { emotions } from "@/data/emotions";

type EmotionGalleryProps = {
  selectedEmotions: string[];
  onComplete: (emotionIds: string[]) => void;
};

const MAX_SELECTIONS = 3;

export default function EmotionGallery({
  selectedEmotions,
  onComplete,
}: EmotionGalleryProps) {
  const [localSelections, setLocalSelections] =
    useState<string[]>(selectedEmotions);

  function toggleEmotion(emotionId: string) {
    setLocalSelections((current) => {
      if (current.includes(emotionId)) {
        return current.filter((id) => id !== emotionId);
      }

      if (current.length >= MAX_SELECTIONS) {
        return current;
      }

      return [...current, emotionId];
    });
  }

  function handleContinue() {
    if (localSelections.length !== MAX_SELECTIONS) {
      return;
    }

    onComplete(localSelections);
  }

  const isComplete =
    localSelections.length === MAX_SELECTIONS;

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#070707] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_55%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-12 sm:px-8 lg:px-12">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mb-12 text-center"
        >
          <span className="text-xs tracking-[0.35em] text-[#D4AF37]">
            انتخاب سوم
          </span>

          <h1 className="mt-4 text-4xl font-semibold text-[#F8F3E9] sm:text-5xl">
            این دنیا باید چه حسی داشته باشد؟
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/50 sm:text-base">
            سه حسی را انتخاب کن که بیشتر دوست داری در تجربه‌ی
            تو حضور داشته باشند.
          </p>

          {/* COUNTER */}
          <motion.div
            initial={false}
            animate={{
              opacity: isComplete ? 1 : 0.6,
            }}
            className="mt-6 text-sm text-[#D4AF37]"
          >
            {localSelections.length} از {MAX_SELECTIONS}
          </motion.div>
        </motion.div>

        {/* EMOTIONS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {emotions.map((emotion, index) => {
            const selected = localSelections.includes(
              emotion.id
            );

            const disabled =
              !selected &&
              localSelections.length >= MAX_SELECTIONS;

            const selectionIndex =
              localSelections.indexOf(emotion.id);

            return (
              <motion.button
                key={emotion.id}
                type="button"
                disabled={disabled}
                onClick={() => toggleEmotion(emotion.id)}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: disabled ? 0.35 : 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.5,
                }}
                whileHover={
                  disabled
                    ? undefined
                    : {
                        y: -6,
                      }
                }
                whileTap={
                  disabled
                    ? undefined
                    : {
                        scale: 0.97,
                      }
                }
                className={`group relative min-h-52 overflow-hidden rounded-3xl border p-6 text-right transition-all duration-300 ${
                  selected
                    ? "border-[#D4AF37]/70 bg-[#D4AF37]/10 shadow-[0_0_40px_rgba(212,175,55,0.12)]"
                    : "border-white/10 bg-white/[0.035] hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                {/* SELECTION NUMBER */}
                {selected && (
                  <motion.div
                    initial={{
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-sm text-[#D4AF37]"
                  >
                    {selectionIndex + 1}
                  </motion.div>
                )}

                {/* EMOJI */}
                <div className="mb-7 text-4xl">
                  {emotion.emoji}
                </div>

                {/* TITLE */}
                <h2 className="text-xl font-medium text-white">
                  {emotion.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="mt-3 text-sm leading-7 text-white/45">
                  {emotion.description}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* CONTINUE */}
        <motion.div
          initial={false}
          animate={{
            opacity: isComplete ? 1 : 0.35,
            y: isComplete ? 0 : 6,
          }}
          className="mt-12 flex justify-center"
        >
          <button
            type="button"
            disabled={!isComplete}
            onClick={handleContinue}
            className="rounded-full border border-[#D4AF37]/50 bg-black/20 px-8 py-3.5 text-sm text-[#D4AF37] backdrop-blur-xl transition hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed"
          >
            ادامه

            <span className="mr-3">
              →
            </span>
          </button>
        </motion.div>
      </section>
    </main>
  );
}