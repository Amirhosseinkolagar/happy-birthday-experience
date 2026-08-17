"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useExperienceAudio,
} from "@/src/components/audio/ExperienceAudioManager";

type PixoraWelcomeProps = {
  onComplete: () => void;
};

export default function PixoraWelcome({
  onComplete,
}: PixoraWelcomeProps) {
  const [leaving, setLeaving] =
    useState(false);

  const [starting, setStarting] =
    useState(false);

  const [permissionError, setPermissionError] =
    useState(false);

  const {
    fadeIn,
  } = useExperienceAudio();

  /*
   * =======================================================
   * LOCK BODY SCROLL
   * =======================================================
   */

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  /*
   * =======================================================
   * START EXPERIENCE
   * =======================================================
   *
   * IMPORTANT:
   *
   * fadeIn() دقیقاً داخل onClick اجرا می‌شود.
   *
   * این موضوع برای Browser Autoplay Policy
   * بسیار مهم است.
   *
   * اگر audio.play() موفق شود:
   *
   *   Background Music
   *          ↓
   *       Fade In
   *          ↓
   *       Experience
   *
   * =======================================================
   */

  async function handleStart() {
    if (
      starting ||
      leaving
    ) {
      return;
    }

    setPermissionError(false);
    setStarting(true);

    /*
     * Start background music.
     *
     * این Promise تا پایان Fade In منتظر می‌ماند.
     */
    const started =
      await fadeIn();

    /*
     * اگر Browser اجازه‌ی پخش نداد،
     * Welcome را ترک نمی‌کنیم.
     */
    if (!started) {
      setStarting(false);
      setPermissionError(true);

      return;
    }

    /*
     * Music successfully started.
     *
     * حالا Welcome را خارج می‌کنیم.
     */
    setLeaving(true);

    window.setTimeout(() => {
      onComplete();
    }, 550);
  }

  return (
    <main
      className={`pixora-welcome ${
        leaving
          ? "is-leaving"
          : ""
      }`}
      aria-label="Welcome to Pixora"
    >
      <div className="pixora-welcome-glow pixora-welcome-glow-one" />

      <div className="pixora-welcome-glow pixora-welcome-glow-two" />

      <div className="pixora-welcome-particles">
        {Array.from({
          length: 10,
        }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${
                8 +
                ((index * 31) %
                  84)
              }%`,
              top: `${
                12 +
                ((index * 43) %
                  76)
              }%`,
              animationDelay: `${
                index * 0.3
              }s`,
            }}
          />
        ))}
      </div>

      <div className="pixora-welcome-frame" />

      <section className="pixora-welcome-content">
        <div className="pixora-welcome-eyebrow">
          <span />
          PIXORA EXPERIENCE
          <span />
        </div>

        <h1>
          YOUR STORY
          <br />
          <em>
            IS ABOUT TO BEGIN
          </em>
        </h1>

        <p>
          یک تجربه‌ی مخصوص تو،
          <br />
          از همین لحظه شروع می‌شود.
        </p>

        <button
          type="button"
          className="pixora-start-button"
          onClick={handleStart}
          disabled={
            starting ||
            leaving
          }
        >
          <span className="pixora-button-border" />

          <span className="pixora-button-glow" />

          <span className="pixora-button-content">
            <span className="pixora-button-text">
              {starting
                ? "در حال آماده‌سازی..."
                : "شروع"}
            </span>

            {!starting &&
              !leaving && (
                <span className="pixora-button-arrow">
                  ↗
                </span>
              )}
          </span>
        </button>

        {permissionError && (
          <p
            style={{
              marginTop: 18,
              color:
                "rgba(255,180,180,0.85)",
              fontSize: 13,
              lineHeight: 2,
            }}
          >
            پخش موسیقی شروع نشد.
            <br />
            دوباره روی «شروع» بزن.
          </p>
        )}

        <div className="pixora-welcome-hint">
          <span className="pixora-hint-line" />

          ENTER YOUR WORLD

          <span className="pixora-hint-line" />
        </div>
      </section>

      <div className="pixora-welcome-exit" />
    </main>
  );
}