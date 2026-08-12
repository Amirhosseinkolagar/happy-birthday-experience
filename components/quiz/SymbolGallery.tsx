"use client";

import { motion } from "motion/react";
import { symbols } from "@/data/symbols";

type SymbolGalleryProps = {
  selectedSymbols: string[];
  onChange: (symbolIds: string[]) => void;
  onComplete: (symbolIds: string[]) => void;
};

const MAX_SELECTIONS = 2;

export default function SymbolGallery({
  selectedSymbols,
  onChange,
  onComplete,
}: SymbolGalleryProps) {
  const isComplete =
    selectedSymbols.length === MAX_SELECTIONS;

  function toggleSymbol(symbolId: string) {
    if (selectedSymbols.includes(symbolId)) {
      onChange(
        selectedSymbols.filter((id) => id !== symbolId)
      );
      return;
    }

    if (selectedSymbols.length >= MAX_SELECTIONS) {
      return;
    }

    onChange([...selectedSymbols, symbolId]);
  }

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
            انتخاب ششم
          </span>

          <h1 className="mt-4 text-4xl font-semibold text-[#F8F3E9] sm:text-5xl">
            یک نشونه برای این دنیا انتخاب کن
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/50 sm:text-base">
            دو نماد انتخاب کن؛ چیزهایی که دوست داری جایی در این تجربه پنهان باشند.
          </p>

          <div className="mt-6 text-sm text-[#D4AF37]">
            {selectedSymbols.length} از {MAX_SELECTIONS}
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {symbols.map((symbol, index) => {
            const selected =
              selectedSymbols.includes(symbol.id);

            const disabled =
              !selected &&
              selectedSymbols.length >= MAX_SELECTIONS;

            const selectionIndex =
              selectedSymbols.indexOf(symbol.id);

            return (
              <motion.button
                key={symbol.id}
                type="button"
                disabled={disabled}
                onClick={() => toggleSymbol(symbol.id)}
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
                    : { y: -6 }
                }
                whileTap={
                  disabled
                    ? undefined
                    : { scale: 0.97 }
                }
                className={`group relative min-h-48 overflow-hidden rounded-3xl border p-6 text-right transition-all duration-300 ${
                  selected
                    ? "border-[#D4AF37]/70 bg-[#D4AF37]/10 shadow-[0_0_40px_rgba(212,175,55,0.12)]"
                    : "border-white/10 bg-white/[0.035] hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
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

                <div className="mb-7 text-5xl">
                  {symbol.emoji}
                </div>

                <h2 className="text-xl font-medium text-white">
                  {symbol.title}
                </h2>
              </motion.button>
            );
          })}
        </div>

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
            onClick={() => onComplete(selectedSymbols)}
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