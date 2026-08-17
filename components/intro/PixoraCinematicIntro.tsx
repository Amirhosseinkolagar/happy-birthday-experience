"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

type PixoraCinematicIntroProps = {
  onComplete: () => void;
};

const LETTERS = ["P", "I", "X", "O", "R", "A"];

const LETTER_REVEAL_START = 14000;
const LETTER_INTERVAL = 3000;
const TAGLINE_DELAY = 2500;
const EXIT_DELAY = 3000;

export default function PixoraCinematicIntro({
  onComplete,
}: PixoraCinematicIntroProps) {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showTagline, setShowTagline] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timers: number[] = [];

    LETTERS.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setVisibleLetters(index + 1);
      }, LETTER_REVEAL_START + index * LETTER_INTERVAL);

      timers.push(timer);
    });

    const taglineTimer = window.setTimeout(() => {
      setShowTagline(true);
    }, LETTER_REVEAL_START + 5 * LETTER_INTERVAL + TAGLINE_DELAY);

    timers.push(taglineTimer);

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, LETTER_REVEAL_START + 5 * LETTER_INTERVAL + TAGLINE_DELAY + EXIT_DELAY);

    timers.push(exitTimer);

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, []);

  useEffect(() => {
    if (!isExiting) {
      return;
    }

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 1000);

    return () => {
      window.clearTimeout(completeTimer);
    };
  }, [isExiting, onComplete]);

  return (
    <main
      className={`pixora-intro ${
        isExiting ? "pixora-intro-exit" : ""
      }`}
      aria-label="PIXORA cinematic opening"
      dir="ltr"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pixora-bg" />

      <div className="pixora-vignette" />

      {/* =====================================================
          AMBIENT LIGHT
      ===================================================== */}

      <motion.div
        className="pixora-ambient pixora-ambient-one"
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        animate={{
          opacity: [0, 0.75, 0.4],
          scale: [0.7, 1.05, 1],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pixora-ambient pixora-ambient-two"
        initial={{
          opacity: 0,
          scale: 0.8,
          x: -70,
        }}
        animate={{
          opacity: [0, 0.2, 0.08],
          scale: [0.8, 1.15, 1],
          x: [-70, 80, 0],
        }}
        transition={{
          duration: 7,
          ease: "easeInOut",
        }}
      />

      {/* =====================================================
          CENTRAL ENERGY
      ===================================================== */}

      <div className="pixora-energy" aria-hidden="true">
        <motion.div
          className="pixora-energy-core"
          initial={{
            opacity: 0,
            scale: 0.2,
          }}
          animate={{
            opacity: [0, 1, 0.7],
            scale: [0.2, 1, 0.8],
          }}
          transition={{
            duration: 2.4,
            ease: "easeOut",
          }}
        />

        <motion.div
          className="pixora-energy-ring pixora-ring-one"
          initial={{
            opacity: 0,
            scale: 0.2,
          }}
          animate={{
            opacity: [0, 0.45, 0.08],
            scale: [0.2, 1, 1],
          }}
          transition={{
            duration: 3,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        <motion.div
          className="pixora-energy-ring pixora-ring-two"
          initial={{
            opacity: 0,
            scale: 0.2,
          }}
          animate={{
            opacity: [0, 0.3, 0.06],
            scale: [0.2, 1, 1],
          }}
          transition={{
            duration: 3.5,
            delay: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        <motion.div
          className="pixora-energy-ring pixora-ring-three"
          initial={{
            opacity: 0,
            scale: 0.2,
          }}
          animate={{
            opacity: [0, 0.22, 0.04],
            scale: [0.2, 1, 1],
          }}
          transition={{
            duration: 4,
            delay: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>

      {/* =====================================================
          LIGHT BEAMS
      ===================================================== */}

      <motion.div
        className="pixora-light-line pixora-light-line-one"
        initial={{
          left: "-40%",
          opacity: 0,
        }}
        animate={{
          left: ["-40%", "130%"],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 5,
          delay: 1.2,
          ease: [0.16, 1, 0.3, 1],
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />

      <motion.div
        className="pixora-light-line pixora-light-line-two"
        initial={{
          left: "120%",
          opacity: 0,
        }}
        animate={{
          left: ["120%", "-50%"],
          opacity: [0, 0.45, 0],
        }}
        transition={{
          duration: 6,
          delay: 2.8,
          ease: [0.16, 1, 0.3, 1],
          repeat: Infinity,
          repeatDelay: 4,
        }}
      />

      {/* =====================================================
          PARTICLES
      ===================================================== */}

      <div className="pixora-particles" aria-hidden="true">
        {Array.from({ length: 32 }).map((_, index) => (
          <motion.span
            key={`particle-${index}`}
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 61) % 100}%`,
              width: `${1 + (index % 3)}px`,
              height: `${1 + (index % 3)}px`,
            }}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 0.45, 0],
              scale: [0, 1, 0.5],
              x:
                index % 2 === 0
                  ? [0, 35, 0]
                  : [0, -35, 0],
              y:
                index % 3 === 0
                  ? [0, -30, 0]
                  : [0, 25, 0],
            }}
            transition={{
              duration: 4 + (index % 4),
              delay: index * 0.08,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* =====================================================
          BRAND CENTER
      ===================================================== */}

      <section className="pixora-brand" aria-label="PIXORA brand">
        <div className="pixora-word">
          {LETTERS.slice(0, visibleLetters).map((letter) => (
            <motion.span
              key={letter}
              className="pixora-letter"
              initial={{
                opacity: 0,
                y: 45,
                scale: 0.72,
                filter: "blur(16px)",
                rotateX: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [0.72, 1.04, 1],
                filter: "blur(0px)",
                rotateX: 0,
              }}
              transition={{
                duration: 1.15,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.75, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* ===================================================
            TAGLINE
        =================================================== */}

        <motion.div
          className="pixora-tagline"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: showTagline ? 1 : 0,
            y: showTagline ? 0 : 12,
          }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="pixora-tagline-line" />

          <span className="pixora-tagline-text">
            A WORLD MADE FOR YOU
          </span>

          <span className="pixora-tagline-line" />
        </motion.div>
      </section>

      {/* =====================================================
          FINAL CINEMATIC EXIT
      ===================================================== */}

      <motion.div
        className="pixora-final-sweep"
        initial={{
          opacity: 0,
          scale: 0.3,
        }}
        animate={{
          opacity: isExiting ? 1 : 0,
          scale: isExiting ? 2.8 : 0.3,
        }}
        transition={{
          duration: 1,
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </main>
  );
}