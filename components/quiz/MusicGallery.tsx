"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "motion/react";

import { musicOptions } from "@/data/music";

import {
  useExperienceAudio,
} from "@/src/components/audio/ExperienceAudioManager";

type MusicGalleryProps = {
  selectedMusic: string[];
  onComplete: (
    musicIds: string[]
  ) => void;
};

export default function MusicGallery({
  selectedMusic,
  onComplete,
}: MusicGalleryProps) {
  const [selectedTrack, setSelectedTrack] =
    useState<string | null>(
      selectedMusic[0] ?? null
    );

  const [playingTrack, setPlayingTrack] =
    useState<string | null>(null);

  /*
   * =======================================================
   * BACKGROUND AUDIO
   * =======================================================
   */

  const {
    pauseForPreview,
    resumeAfterPreview,
  } = useExperienceAudio();

  /*
   * =======================================================
   * PREVIEW AUDIO
   * =======================================================
   *
   * فقط یک Audio برای Preview داریم.
   * =======================================================
   */

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null
    );

  /*
   * جلوگیری از Race Condition
   *
   * اگر کاربر سریع بین کاورها حرکت کند،
   * Preview قبلی نباید دوباره شروع شود.
   */

  const previewRequestRef =
    useRef(0);

  /*
   * مشخص می‌کند که Background Music
   * به خاطر Preview متوقف شده است.
   */

  const backgroundPausedRef =
    useRef(false);

  /*
   * =======================================================
   * CREATE PREVIEW AUDIO
   * =======================================================
   */

  useEffect(() => {
    const audio =
      new Audio();

    audio.preload = "none";

    audioRef.current =
      audio;

    const handleEnded =
      () => {
        setPlayingTrack(null);

        if (
          backgroundPausedRef.current
        ) {
          backgroundPausedRef.current =
            false;

          void resumeAfterPreview();
        }
      };

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.pause();
      audio.src = "";

      audio.removeEventListener(
        "ended",
        handleEnded
      );

      audioRef.current =
        null;
    };
  }, [
    resumeAfterPreview,
  ]);

  /*
   * =======================================================
   * STOP PREVIEW
   * =======================================================
   */

  async function stopPreview(
    trackId?: string
  ) {
    const currentTrack =
      playingTrack;

    /*
     * اگر درخواست مربوط به کارت
     * فعلی نیست، کاری نکن.
     */

    if (
      trackId &&
      currentTrack &&
      trackId !== currentTrack
    ) {
      return;
    }

    /*
     * درخواست‌های قبلی را invalidate می‌کنیم.
     */

    previewRequestRef.current += 1;

    const audio =
      audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setPlayingTrack(null);

    /*
     * Background Music را برگردان.
     */

    if (
      backgroundPausedRef.current
    ) {
      backgroundPausedRef.current =
        false;

      await resumeAfterPreview();
    }
  }

  /*
   * =======================================================
   * START PREVIEW
   * =======================================================
   */

  async function startPreview(
    trackId: string
  ) {
    const requestId =
      ++previewRequestRef.current;

    /*
     * اگر همان Track در حال پخش است،
     * دوباره از اول اجرا نکن.
     */

    if (
      playingTrack === trackId
    ) {
      return;
    }

    const track =
      musicOptions.find(
        (item) =>
          item.id === trackId
      );

    if (!track) {
      return;
    }

    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    /*
     * اگر Preview دیگری در حال پخش است،
     * اول آن را قطع کن.
     */

    audio.pause();
    audio.currentTime = 0;

    /*
     * Background Music را موقتاً Pause کن.
     */

    if (
      !backgroundPausedRef.current
    ) {
      backgroundPausedRef.current =
        true;

      await pauseForPreview();
    }

    /*
     * ممکن است کاربر در زمان Fade
     * از کارت خارج شده باشد.
     */

    if (
      requestId !==
      previewRequestRef.current
    ) {
      return;
    }

    /*
     * مسیر Preview جدید
     */

    audio.src =
      track.audio;

    try {
      await audio.play();

      /*
       * ممکن است در زمان await
       * کاربر کارت را ترک کرده باشد.
       */

      if (
        requestId !==
        previewRequestRef.current
      ) {
        audio.pause();
        audio.currentTime = 0;

        return;
      }

      setPlayingTrack(
        trackId
      );
    } catch {
      if (
        requestId ===
        previewRequestRef.current
      ) {
        setPlayingTrack(
          null
        );

        if (
          backgroundPausedRef.current
        ) {
          backgroundPausedRef.current =
            false;

          await resumeAfterPreview();
        }
      }
    }
  }

  /*
   * =======================================================
   * SELECT TRACK
   * =======================================================
   */

  function handleSelect(
    trackId: string
  ) {
    setSelectedTrack(
      (current) =>
        current === trackId
          ? null
          : trackId
    );
  }

  /*
   * =======================================================
   * CONTINUE
   * =======================================================
   */

  async function handleContinue() {
    if (!selectedTrack) {
      return;
    }

    await stopPreview();

    onComplete([
      selectedTrack,
    ]);
  }

  const isComplete =
    selectedTrack !== null;

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <main
      dir="rtl"
      className="music-experience"
    >
      <div className="music-atmosphere" />

      <div className="music-orbit music-orbit-one" />

      <div className="music-orbit music-orbit-two" />

      <section className="music-shell">

        {/* TOP BAR */}

        <div className="music-topbar">
          <div>
            <span className="music-step-label">
              فصل چهارم
            </span>

            <span className="music-step-title">
              صدای این داستان
            </span>
          </div>

          <div className="music-counter">
            <span
              className={
                isComplete
                  ? "active"
                  : ""
              }
            >
              {isComplete
                ? "01"
                : "00"}
            </span>

            <i>/</i>

            <span>
              01
            </span>
          </div>
        </div>

        {/* HEADER */}

        <motion.header
          className="music-heading"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <span className="music-eyebrow">
            بعضی انتخاب‌ها را نمی‌شود دید...
          </span>

          <h1>
            باید
            <br />
            <em>
              گوششان کنی.
            </em>
          </h1>

          <p>
            ۱۸ قطعه اینجا پنهان شده.
            <br />
            روی هرکدام برو، چند ثانیه از دنیایش را بشنو
            <br />
            و فقط یکی را با خودت به مرحله‌ی بعد ببر.
          </p>

          <div className="music-secret-hint">
            <span />

            شاید موسیقی‌ای که انتخاب می‌کنی،
            بیشتر از چیزی که فکر می‌کنی درباره‌ات بگوید.

            <span />
          </div>
        </motion.header>

        {/* TRACK GRID */}

        <div className="music-grid">
          {musicOptions.map(
            (music, index) => {
              const selected =
                selectedTrack ===
                music.id;

              const playing =
                playingTrack ===
                music.id;

              return (
                <motion.button
                  key={music.id}
                  type="button"

                  /*
                   * انتخاب واقعی Track
                   */

                  onClick={() =>
                    handleSelect(
                      music.id
                    )
                  }

                  /*
                   * =================================================
                   * DESKTOP
                   * =================================================
                   */

                  onMouseEnter={() =>
                    startPreview(
                      music.id
                    )
                  }

                  onMouseLeave={() =>
                    void stopPreview(
                      music.id
                    )
                  }

                  /*
                   * =================================================
                   * TOUCH / MOBILE
                   * =================================================
                   *
                   * لمس و نگه داشتن:
                   * Preview
                   *
                   * رها کردن:
                   * Resume Background
                   * =================================================
                   */

                  onPointerDown={(
                    event
                  ) => {
                    if (
                      event.pointerType ===
                      "touch"
                    ) {
                      void startPreview(
                        music.id
                      );
                    }
                  }}

                  onPointerUp={(
                    event
                  ) => {
                    if (
                      event.pointerType ===
                      "touch"
                    ) {
                      void stopPreview(
                        music.id
                      );
                    }
                  }}

                  onPointerCancel={(
                    event
                  ) => {
                    if (
                      event.pointerType ===
                      "touch"
                    ) {
                      void stopPreview(
                        music.id
                      );
                    }
                  }}

                  /*
                   * Keyboard accessibility
                   */

                  onFocus={() =>
                    startPreview(
                      music.id
                    )
                  }

                  onBlur={() =>
                    void stopPreview(
                      music.id
                    )
                  }

                  className={[
                    "music-card",
                    selected
                      ? "is-selected"
                      : "",
                    playing
                      ? "is-playing"
                      : "",
                  ].join(" ")}

                  initial={{
                    opacity: 0,
                    y: 25,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay:
                      index *
                      0.025,
                    duration: 0.4,
                  }}

                  whileHover={{
                    y: -6,
                  }}

                  whileTap={{
                    scale: 0.985,
                  }}
                >
                  {/* IMAGE */}

                  <div className="music-image-wrap">
                    <div
                      className="music-image"
                      style={{
                        backgroundImage:
                          `url("${music.image}")`,
                      }}
                      aria-hidden="true"
                    />

                    <div className="music-image-overlay" />

                    {/* PLAY STATE */}

                    <div className="music-play-indicator">
                      {playing ? (
                        <div className="music-equalizer">
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                      ) : (
                        <span className="music-play-icon">
                          ▶
                        </span>
                      )}
                    </div>

                    {/* SELECTION */}

                    <div
                      className={[
                        "music-selection",
                        selected
                          ? "visible"
                          : "",
                      ].join(" ")}
                    >
                      {selected
                        ? "✓"
                        : ""}
                    </div>
                  </div>

                  {/* INFO */}

                  <div className="music-card-content">
                    <h2>
                      {music.title}
                    </h2>

                    <p>
                      {music.subtitle}
                    </p>

                    <span className="music-card-action">
                      {selected
                        ? "این قطعه را انتخاب کردی"
                        : playing
                          ? "در حال شنیدن..."
                          : "برای شنیدن لمس یا روی کاور حرکت کن"}
                    </span>
                  </div>
                </motion.button>
              );
            }
          )}
        </div>

        {/* BOTTOM */}

        <motion.div
          className="music-bottom"
          animate={{
            opacity:
              isComplete
                ? 1
                : 0.5,
          }}
        >
          <div className="music-bottom-line" />

          <div>
            <span className="music-bottom-kicker">
              {isComplete
                ? "انتخاب ثبت شد"
                : "هنوز صدای درست را پیدا نکردی"}
            </span>

            <strong>
              {isComplete
                ? "این قطعه حالا بخشی از داستان توست..."
                : "۱۸ دنیا منتظرند تا شنیده شوند."}
            </strong>
          </div>

          <div className="music-bottom-line" />
        </motion.div>

        {/* CONTINUE */}

        <motion.button
          type="button"
          disabled={!isComplete}
          onClick={() =>
            void handleContinue()
          }
          className="music-continue"
          animate={{
            opacity:
              isComplete
                ? 1
                : 0.3,

            y:
              isComplete
                ? 0
                : 8,
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
              ? "این صدا را با خودم می‌برم"
              : "یک قطعه را انتخاب کن"}
          </span>

          <b>
            ←
          </b>
        </motion.button>

      </section>
    </main>
  );
}