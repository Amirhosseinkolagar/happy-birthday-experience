"use client";

import { motion } from "motion/react";
import { lightingOptions } from "@/data/lighting";

type LightingGalleryProps = {
  selectedLighting: string;
  onComplete: (lightingId: string) => void;
};

export default function LightingGallery({
  selectedLighting,
  onComplete,
}: LightingGalleryProps) {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#070707] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_55%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-12 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <span className="text-xs tracking-[0.35em] text-[#D4AF37]">
            انتخاب چهارم
          </span>

          <h1 className="mt-4 text-4xl font-semibold text-[#F8F3E9] sm:text-5xl">
            اگر این دنیا نور داشت، چه نوری بود؟
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/50 sm:text-base">
            یک نور را انتخاب کن؛ نوری که حال‌وهوای این تجربه را کامل کند.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {lightingOptions.map((lighting, index) => {
            const selected = selectedLighting === lighting.id;

            return (
              <motion.button
                key={lighting.id}
                type="button"
                onClick={() => onComplete(lighting.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative min-h-56 overflow-hidden rounded-3xl border p-7 text-right transition-all duration-300 ${
                  selected
                    ? "border-[#D4AF37]/70 bg-[#D4AF37]/10 shadow-[0_0_50px_rgba(212,175,55,0.14)]"
                    : "border-white/10 bg-white/[0.035] hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: lighting.gradient }}
                />

                <div className="relative z-10">
                  <div className="mb-7 text-5xl">
                    {lighting.emoji}
                  </div>

                  <h2 className="text-2xl font-medium text-white">
                    {lighting.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/50">
                    {lighting.description}
                  </p>

                  {selected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-sm text-[#D4AF37]"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={false}
          animate={{
            opacity: selectedLighting ? 1 : 0.3,
            y: selectedLighting ? 0 : 6,
          }}
          className="mt-12 flex justify-center"
        >
          <button
            type="button"
            disabled={!selectedLighting}
            onClick={() => onComplete(selectedLighting)}
            className="rounded-full border border-[#D4AF37]/50 bg-black/20 px-8 py-3.5 text-sm text-[#D4AF37] backdrop-blur-xl transition hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed"
          >
            ادامه
            <span className="mr-3">→</span>
          </button>
        </motion.div>
      </section>
    </main>
  );
}
