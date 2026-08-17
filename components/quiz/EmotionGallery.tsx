"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { emotions } from "@/data/emotions";

type EmotionGalleryProps = {
  selectedEmotions: string[];
  onComplete: (emotionIds: string[]) => void;
};

const MAX_SELECTIONS = 1;

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
      className="emotion-experience"
    >
      {/* ATMOSPHERE */}
      <div className="emotion-atmosphere" />
      <div className="emotion-orbit emotion-orbit-one" />
      <div className="emotion-orbit emotion-orbit-two" />
      <div className="emotion-grain" />

      <section className="emotion-shell">

        {/* TOP PROGRESS */}
        <div className="emotion-topbar">
          <div>
            <span className="emotion-step-label">
              فصل سوم
            </span>

            <span className="emotion-step-title">
              لایه‌ی احساس
            </span>
          </div>

          <div className="emotion-progress">
            <span className={localSelections.length >= 1 ? "active" : ""} />
          </div>

          <span className="emotion-counter">
            {String(localSelections.length).padStart(2, "0")}
            {" / "}
            {String(MAX_SELECTIONS).padStart(2, "0")}
          </span>
        </div>

        {/* HEADER */}
        <motion.header
          className="emotion-heading"
          initial={{
            opacity: 0,
            y: 28,
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
            className="emotion-eyebrow"
            initial={{
              opacity: 0,
              letterSpacing: "0.5em",
            }}
            animate={{
              opacity: 1,
              letterSpacing: "0.25em",
            }}
            transition={{
              duration: 1,
            }}
          >
            یک حس را انتخاب نمی‌کنی...
          </motion.span>

          <h1>
            ببین کدام لحظه
            <br />
            <em>بیشتر شبیه توست؟</em>
          </h1>

          <p>
            این بار دنبال جواب درست نیستیم.
            <br />
            فقط یک تصویر را پیدا کن که وقتی می‌بینی،
            چیزی درونت می‌گوید:
            <strong> «همینه» </strong>
          </p>

          <div className="emotion-secret-hint">
            <span />
            انتخاب‌هایت بعداً معنی پیدا می‌کنند.
            <span />
          </div>
        </motion.header>

        {/* CARDS */}
        <div className="emotion-grid">
          {emotions.map((emotion, index) => {
            const selected =
              localSelections.includes(emotion.id);

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
                className={[
                  "emotion-card",
                  selected ? "is-selected" : "",
                  disabled ? "is-disabled" : "",
                ].join(" ")}
                initial={{
                  opacity: 0,
                  y: 35,
                  scale: 0.97,
                }}
                animate={{
                  opacity: disabled ? 0.32 : 1,
                  y: 0,
                  scale: selected ? 1.015 : 1,
                }}
                transition={{
                  delay: index * 0.055,
                  duration: 0.55,
                }}
                whileHover={
                  disabled
                    ? undefined
                    : {
                        y: -8,
                        scale: 1.015,
                      }
                }
                whileTap={
                  disabled
                    ? undefined
                    : {
                        scale: 0.97,
                      }
                }
              >
                {/* VISUAL */}
                  <div 
                  className="emotion-visual"
                  style={{
                    backgroundImage: `url("${emotion.image}")`,
                  }}
                >
                  <div className="emotion-visual-gradient" />

                  <div className="emotion-visual-glow" />

                  <div className="emotion-visual-symbol">
                    {emotion.emoji}
                  </div>

                  
                </div>

                {/* OVERLAY */}
                <div className="emotion-card-overlay" />

                {/* SELECTION */}
                <div
                  className={[
                    "emotion-selection",
                    selected ? "visible" : "",
                  ].join(" ")}
                >
                  <span>
                    {selected
                      ? String(selectionIndex + 1).padStart(2, "0")
                      : "+"}
                  </span>
                </div>

                {/* TEXT */}
                <div className="emotion-card-content">
                  

                  <h2>{emotion.title}</h2>

                  <p>{emotion.description}</p>

                </div>
              </motion.button>
            );
          })}
        </div>

        {/* BOTTOM MESSAGE */}
        <motion.div
          className="emotion-bottom"
          animate={{
            opacity: isComplete ? 1 : 0.55,
          }}
        >
          <div className="emotion-bottom-line" />

          <div>
            {isComplete ? (
              <>

                <strong>
                  شاید حالا کمی بیشتر
                  <br />
                  خودت را بشناسی...
                </strong>
              </>
            ) : (
              <>
                <span className="emotion-bottom-kicker">
                  هنوز یک راز کوچک باقی مانده
                </span>

                <strong>
                  {MAX_SELECTIONS - localSelections.length}
                  {" "}
                  انتخاب دیگر
                </strong>
              </>
            )}
          </div>

          <div className="emotion-bottom-line" />
        </motion.div>

        {/* CONTINUE */}
        <motion.button
          type="button"
          disabled={!isComplete}
          onClick={handleContinue}
          className="emotion-continue"
          animate={{
            opacity: isComplete ? 1 : 0.3,
            y: isComplete ? 0 : 8,
          }}
          whileHover={
            isComplete
              ? {
                  scale: 1.035,
                }
              : undefined
          }
          whileTap={
            isComplete
              ? {
                  scale: 0.97,
                }
              : undefined
          }
        >
          <span>
            {isComplete
              ? "حالا ببینیم این انتخاب‌ها چه می‌گویند"
              : "سه حس را پیدا کن"}
          </span>

          <b>←</b>
        </motion.button>
      </section>
    </main>
  );
}