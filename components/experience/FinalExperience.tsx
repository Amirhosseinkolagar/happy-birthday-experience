"use client";

import { motion } from "motion/react";

import { colors } from "@/data/colors";
import { visualWorlds } from "@/data/worlds";
import { emotions } from "@/data/emotions";
import { symbols } from "@/data/symbols";
import { lightingOptions } from "@/data/lighting";

import type { UserPreferences } from "@/types/experience";

type FinalExperienceProps = {
  preferences: UserPreferences;
};

export default function FinalExperience({
  preferences,
}: FinalExperienceProps) {
  const selectedColorValues = preferences.colors
    .map((id) => colors.find((color) => color.id === id))
    .filter(Boolean);

  const world =
    visualWorlds.find(
      (item) => item.id === preferences.worlds[0]
    ) ?? visualWorlds[0];

  const emotion =
    emotions.find(
      (item) => item.id === preferences.emotions[0]
    ) ?? emotions[0];

  const lighting =
    lightingOptions.find(
      (item) => item.id === preferences.lighting
    ) ?? lightingOptions[0];

  const selectedSymbols = preferences.symbols
    .map((id) => symbols.find((symbol) => symbol.id === id))
    .filter(Boolean);

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-black text-white"
    >
      {/* WORLD IMAGE */}
      <div className="absolute inset-0">
        <motion.img
          src={world.image}
          alt={world.title}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8 }}
          className="h-full w-full object-cover"
        />

        <div
          className="absolute inset-0"
          style={{
            background: `
              ${lighting.gradient},
              linear-gradient(
                to bottom,
                rgba(0,0,0,0.25),
                rgba(0,0,0,0.72)
              )
            `,
          }}
        />

        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      </div>

      {/* COLOR ATMOSPHERE */}
      <div className="pointer-events-none absolute inset-0">
        {selectedColorValues.map((color, index) => (
          <motion.div
            key={color?.id}
            className="absolute h-72 w-72 rounded-full blur-3xl"
            style={{
              background: color?.value,
              opacity: 0.12,
              left: `${15 + index * 22}%`,
              top: `${12 + (index % 2) * 55}%`,
            }}
            animate={{
              x: [0, 25, -15, 0],
              y: [0, -20, 15, 0],
              scale: [1, 1.12, 0.94, 1],
            }}
            transition={{
              duration: 12 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.25,
          }}
          className="w-full max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{
              opacity: 1,
              letterSpacing: "0.25em",
            }}
            transition={{ duration: 1 }}
            className="text-xs uppercase text-[#D4AF37]"
          >
            دنیایی که برای تو ساخته شد
          </motion.div>

          <h1 className="mt-7 text-5xl font-semibold leading-tight text-[#F8F3E9] sm:text-7xl">
            {world.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-9 text-white/70 sm:text-lg">
            {world.subtitle}
          </p>

          {/* EMOTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
            }}
            className="mx-auto mt-12 max-w-xl rounded-3xl border border-white/10 bg-black/25 p-6 backdrop-blur-xl"
          >
            <div className="text-4xl">
              {emotion?.emoji}
            </div>

            <div className="mt-4 text-xl text-white">
              {emotion?.title}
            </div>

            <div className="mt-2 text-sm text-white/45">
              {emotion?.description}
            </div>
          </motion.div>

          {/* SYMBOLS */}
          {selectedSymbols.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.1,
              }}
              className="mt-10 flex justify-center gap-4"
            >
              {selectedSymbols.map((symbol) => (
                <div
                  key={symbol?.id}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-black/30 text-2xl backdrop-blur-xl"
                >
                  {symbol?.emoji}
                </div>
              ))}
            </motion.div>
          )}

          {/* COLORS */}
          <div className="mt-12 flex justify-center gap-3">
            {selectedColorValues.map((color) => (
              <div
                key={color?.id}
                className="h-3 w-16 rounded-full"
                style={{
                  background: color?.value,
                  boxShadow: `0 0 20px ${color?.value}`,
                }}
              />
            ))}
          </div>

          {/* FOOTER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              delay: 1.5,
            }}
            className="mt-14 text-sm text-white/35"
          >
            {lighting.emoji} {lighting.title}
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}