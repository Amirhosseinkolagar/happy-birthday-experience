"use client";

import { useState } from "react";
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
  const [localSelection, setLocalSelection] =
    useState<string>(selectedLighting);

  const isComplete = Boolean(localSelection);

  function handleSelect(lightingId: string) {
    setLocalSelection(lightingId);
  }

  function handleContinue() {
    if (!localSelection) {
      return;
    }

    onComplete(localSelection);
  }

  return (
    <main
      dir="rtl"
      className="lighting-experience"
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        className="lighting-bg"
        aria-hidden="true"
      />

      <div
        className="lighting-noise"
        aria-hidden="true"
      />

      <div
        className="lighting-orbit lighting-orbit-one"
        aria-hidden="true"
      />

      <div
        className="lighting-orbit lighting-orbit-two"
        aria-hidden="true"
      />

      {/* =====================================================
          SHELL
          ===================================================== */}

      <section className="lighting-shell">

        {/* ===================================================
            TOP BAR
            =================================================== */}

        <div className="lighting-topbar">

          <div className="lighting-chapter">
            <span>
              فصل پنجم
            </span>

            <strong>
              لایه‌ی نور
            </strong>
          </div>

          <div className="lighting-counter">
            <span
              className={isComplete ? "active" : ""}
            >
              {isComplete ? "01" : "00"}
            </span>

            <i>/</i>

            <span>
              01
            </span>
          </div>

        </div>


        {/* ===================================================
            HEADER
            =================================================== */}

        <motion.header
          className="lighting-heading"
          initial={{
            opacity: 0,
            y: 20,
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

          <span className="lighting-eyebrow">
            نور فقط روشنایی نیست...
          </span>

          <h1>
            اگر این دنیا
            <br />
            <em>نور داشت، چه نوری بود؟</em>
          </h1>

          <p>
            یک نور را انتخاب کن؛
            <br />
            نوری که فکر می‌کنی حال‌وهوای این تجربه را کامل می‌کند.
          </p>

          <div className="lighting-hint">
            <span />
            به اولین حسی که درونت شکل می‌گیرد اعتماد کن.
            <span />
          </div>

        </motion.header>


        {/* ===================================================
            LIGHTING GRID
            =================================================== */}

        <div className="lighting-grid">

          {lightingOptions.map((lighting, index) => {

            const selected =
              localSelection === lighting.id;

            return (
              <motion.button
                key={lighting.id}
                type="button"

                /*
                  مهم:
                  هیچ whileHover نداریم.
                  hover کاملاً توسط CSS انجام می‌شود.
                */

                onClick={() =>
                  handleSelect(lighting.id)
                }

                className={[
                  "lighting-card",
                  selected
                    ? "is-selected"
                    : "",
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
              >

                {/* =================================================
                    IMAGE
                    ================================================= */}

                <div
                  className="lighting-card-image"
                  style={{
                    backgroundImage:
                      `url(${lighting.image})`,
                  }}
                  aria-hidden="true"
                />


                {/* =================================================
                    LIGHT GLOW
                    ================================================= */}

                <div
                  className="lighting-card-glow"
                  style={{
                    background:
                      lighting.gradient,
                  }}
                  aria-hidden="true"
                />


                {/* =================================================
                    OVERLAY
                    ================================================= */}

                <div
                  className="lighting-card-overlay"
                  aria-hidden="true"
                />


                {/* =================================================
                    FRAME
                    ================================================= */}

                <div
                  className="lighting-card-frame"
                  aria-hidden="true"
                />


                {/* =================================================
                    META
                    ================================================= */}

                <div className="lighting-card-meta">

                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>
                    {lighting.emoji}
                  </span>

                </div>


                {/* =================================================
                    SELECT
                    ================================================= */}

                <div
                  className={[
                    "lighting-select",
                    selected
                      ? "visible"
                      : "",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {selected ? "✓" : ""}
                </div>


                {/* =================================================
                    CONTENT
                    ================================================= */}

                <div className="lighting-card-content">

                  <span className="lighting-card-kicker">
                    ATMOSPHERE
                  </span>

                  <h2>
                    {lighting.title}
                  </h2>

                  <p>
                    {lighting.description}
                  </p>

                  <span className="lighting-card-discover">
                    {selected
                      ? "این نور را انتخاب کردی"
                      : "برای کشف این فضا انتخابش کن"}
                  </span>

                </div>

              </motion.button>
            );
          })}

        </div>


        {/* ===================================================
            BOTTOM MESSAGE
            =================================================== */}

        <motion.div
          className="lighting-bottom"
          initial={false}
          animate={{
            opacity: isComplete ? 1 : 0.5,
          }}
          transition={{
            duration: 0.25,
          }}
        >

          <div className="lighting-bottom-line" />

          <div className="lighting-bottom-content">

            <span>
              {isComplete
                ? "انتخاب ثبت شد"
                : "هنوز یک انتخاب باقی مانده"}
            </span>

            <strong>
              {isComplete
                ? "حالا این نور بخشی از دنیای توست..."
                : "بگذار حس اول راهنمایت باشد."}
            </strong>

          </div>

          <div className="lighting-bottom-line" />

        </motion.div>


        {/* ===================================================
            CONTINUE
            =================================================== */}

        <motion.button
          type="button"
          disabled={!isComplete}
          onClick={handleContinue}
          className="lighting-continue"

          initial={false}

          animate={{
            opacity: isComplete ? 1 : 0.35,
            y: isComplete ? 0 : 5,
          }}

          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
        >

          <span>
            {isComplete
              ? "این نور را با خودم می‌برم"
              : "یک نور را انتخاب کن"}
          </span>

          <b>
            ←
          </b>

        </motion.button>

      </section>
    </main>
  );
}