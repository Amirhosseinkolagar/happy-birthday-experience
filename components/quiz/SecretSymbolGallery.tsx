"use client";

import { motion } from "motion/react";
import { symbols } from "@/data/symbols";

type SecretSymbolGalleryProps = {
  selectedSymbol: string | null;
  onComplete: (symbolId: string) => void;
};

export default function SecretSymbolGallery({
  selectedSymbol,
  onComplete,
}: SecretSymbolGalleryProps) {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_55%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-12 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-14 text-center"
        >
          <span className="text-xs tracking-[0.35em] text-[#D4AF37]">
            انتخاب نهایی
          </span>

          <h1 className="mt-5 text-4xl font-semibold text-[#F8F3E9] sm:text-5xl">
            یک راز برای این دنیا انتخاب کن
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/50 sm:text-base">
            یکی از نمادها را انتخاب کن.
            <br />
            این یکی قرار نیست فقط دیده شود؛
            قرار است جایی در قلب این تجربه پنهان بماند.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {symbols.map((symbol, index) => {
            const selected = selectedSymbol === symbol.id;

            return (
              <motion.button
                key={symbol.id}
                type="button"
                onClick={() => onComplete(symbol.id)}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.55,
                }}
                whileHover={{
                  y: -8,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className={`group relative min-h-56 overflow-hidden rounded-[2rem] border p-7 text-right transition-all duration-500 ${
                  selected
                    ? "border-[#D4AF37]/80 bg-[#D4AF37]/10 shadow-[0_0_55px_rgba(212,175,55,0.16)]"
                    : "border-white/10 bg-white/[0.035] hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(212,175,55,0.12),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

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
                    className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/10 text-sm text-[#D4AF37]"
                  >
                    ✓
                  </motion.div>
                )}

                <div className="relative z-10">
                  <div className="mb-8 text-5xl">
                    {symbol.emoji}
                  </div>

                  <h2 className="text-xl font-medium text-white">
                    {symbol.title}
                  </h2>

                  <p className="mt-4 text-xs tracking-wide text-white/35">
                    {selected
                      ? "این نماد راز تو شد."
                      : "انتخابش کن"}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={false}
          animate={{
            opacity: selectedSymbol ? 1 : 0.3,
            y: selectedSymbol ? 0 : 8,
          }}
          className="mt-14 flex justify-center"
        >
          <button
            type="button"
            disabled={!selectedSymbol}
            onClick={() => {
              if (selectedSymbol) {
                onComplete(selectedSymbol);
              }
            }}
            className="rounded-full border border-[#D4AF37]/50 bg-black/20 px-9 py-3.5 text-sm text-[#D4AF37] backdrop-blur-xl transition hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed"
          >
            ساخت دنیای من
            <span className="mr-3">→</span>
          </button>
        </motion.div>
      </section>
    </main>
  );
}