"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { symbols } from "@/data/symbols";

type SymbolGalleryProps = {
  selectedSymbols: string[];
  onChange: (symbolIds: string[]) => void;
  onComplete: (symbolIds: string[]) => void;
};

export default function SymbolGallery({
  selectedSymbols,
  onChange,
  onComplete,
}: SymbolGalleryProps) {
  const selectedSymbol = selectedSymbols[0] ?? null;

  function selectSymbol(symbolId: string) {
    if (selectedSymbol === symbolId) {
      onChange([]);
      return;
    }

    onChange([symbolId]);
  }

  function handleContinue() {
    if (!selectedSymbol) {
      return;
    }

    onComplete([selectedSymbol]);
  }

  const isComplete = selectedSymbol !== null;

  return (
    <main dir="rtl" className="symbol-experience">
      {/* BACKGROUND */}
      <div className="symbol-background" aria-hidden="true">
        <div className="symbol-background-glow symbol-glow-one" />
        <div className="symbol-background-glow symbol-glow-two" />
      </div>

      <section className="symbol-shell">
        {/* TOP BAR */}
        <div className="symbol-topbar">
          <div className="symbol-chapter">
            <span>انتخاب ششم</span>
            <strong>نشانه‌ی این دنیا</strong>
          </div>

          <div className="symbol-counter">
            <span className={isComplete ? "active" : ""}>
              {isComplete ? "01" : "00"}
            </span>

            <i>/</i>

            <span>01</span>
          </div>
        </div>

        {/* HEADER */}
        <motion.header
          className="symbol-heading"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
            ease: "easeOut",
          }}
        >
          <span className="symbol-eyebrow">
            بعضی نشانه‌ها اتفاقی وارد داستان نمی‌شوند...
          </span>

          <h1>
            یک نشونه
            <br />
            <em>برای این دنیا انتخاب کن.</em>
          </h1>

          <p>
            یکی از این هشت نماد را انتخاب کن.
            <br />
            شاید بعدتر، جایی میان این تجربه دوباره پیدایش کنی.
          </p>

          <div className="symbol-hint">
            <span />
            فقط یک نماد
            <span />
          </div>
        </motion.header>

        {/* SYMBOL GRID */}
        <div className="symbol-grid">
          {symbols.map((symbol, index) => {
            const selected = selectedSymbol === symbol.id;

            return (
              <motion.button
                key={symbol.id}
                type="button"
                onClick={() => selectSymbol(symbol.id)}
                className={[
                  "symbol-card",
                  selected ? "is-selected" : "",
                ].join(" ")}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.045,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -5,
                }}
                whileTap={{
                  scale: 0.985,
                }}
              >
                {/* CARD NUMBER */}
                <span className="symbol-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* SELECTED MARK */}
                <span
                  className={[
                    "symbol-check",
                    selected ? "visible" : "",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  ✓
                </span>

                {/* IMAGE AREA */}
                <div className="symbol-art">
                  <div className="symbol-art-glow" />

                  <Image
                    src={symbol.image}
                    alt={symbol.title}
                    fill
                    sizes="(max-width: 760px) 70vw, 220px"
                    className="symbol-image"
                    priority={index < 4}
                  />

                  <div className="symbol-ring symbol-ring-one" />
                  <div className="symbol-ring symbol-ring-two" />
                </div>

                {/* CONTENT */}
                <div className="symbol-content">
                  <span className="symbol-mini">
                    {symbol.emoji}
                  </span>

                  <h2>{symbol.title}</h2>

                  <span className="symbol-action">
                    {selected
                      ? "این نشانه انتخاب شد"
                      : "برای انتخاب لمس کن"}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* BOTTOM MESSAGE */}
        <motion.div
          className="symbol-bottom"
          animate={{
            opacity: isComplete ? 1 : 0.55,
          }}
        >
          <div className="symbol-line" />

          <div className="symbol-bottom-content">
            <span>
              {isComplete
                ? "نشانه پیدا شد"
                : "هنوز انتخابی نکرده‌ای"}
            </span>

            <strong>
              {isComplete
                ? "این نماد حالا بخشی از داستان توست."
                : "بگذار یکی از این نشانه‌ها تو را انتخاب کند."}
            </strong>
          </div>

          <div className="symbol-line reverse" />
        </motion.div>

        {/* CONTINUE */}
        <motion.button
          type="button"
          disabled={!isComplete}
          onClick={handleContinue}
          className="symbol-continue"
          animate={{
            opacity: isComplete ? 1 : 0.3,
            y: isComplete ? 0 : 5,
          }}
          whileHover={
            isComplete
              ? {
                  scale: 1.025,
                }
              : undefined
          }
          whileTap={
            isComplete
              ? {
                  scale: 0.975,
                }
              : undefined
          }
        >
          <span>
            {isComplete
              ? "این نشانه را با خودم می‌برم"
              : "یک نماد انتخاب کن"}
          </span>

          <b>←</b>
        </motion.button>
      </section>
    </main>
  );
}