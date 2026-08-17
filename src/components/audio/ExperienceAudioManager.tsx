"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/*
 * =========================================================
 * PIXORA — EXPERIENCE AUDIO MANAGER
 * =========================================================
 *
 * Global background music manager for the whole experience.
 *
 * EXPERIENCE FLOW
 *
 * Welcome
 *   ↓
 * Profile
 *   ↓
 * Select Color
 *   ↓
 * World
 *   ↓
 * Emotion
 *   ↓
 * Music
 *   ↓
 * Lighting
 *   ↓
 * Symbol
 *   ↓
 * FinalExperience
 *
 * Background music:
 *
 *   Welcome
 *      ↓
 *   Fade In
 *      ↓
 *   plays continuously
 *      ↓
 *   all experience steps
 *      ↓
 *   2 seconds before FinalExperience
 *      ↓
 *   Fade Out
 *      ↓
 *   Stop
 *
 * IMPORTANT:
 *
 * There is only ONE HTMLAudioElement instance.
 * =========================================================
 */

const BACKGROUND_AUDIO =
  "/audio/ExperienceBackground.mp3";

const DEFAULT_VOLUME = 0.32;

/*
 * Normal fade duration.
 */
const FADE_DURATION = 700;

/*
 * FinalExperience transition:
 *
 * این مقدار مشخص می‌کند چند میلی‌ثانیه قبل از
 * ورود به FinalExperience موزیک fade out شود.
 */
const FINAL_FADE_LEAD_TIME = 2000;

/*
 * Fade out itself.
 *
 * چون کاربر گفته 2 ثانیه قبل قطع شود،
 * کل این بازه را برای fade-out استفاده می‌کنیم.
 */
const FINAL_FADE_DURATION =
  FINAL_FADE_LEAD_TIME;

type ExperienceAudioContextValue = {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;

  /*
   * Normal playback controls
   */
  play: () => Promise<boolean>;
  pause: () => void;
  resume: () => Promise<boolean>;

  /*
   * Fade controls
   */
  fadeIn: () => Promise<boolean>;
  fadeOut: (
    stopAfter?: boolean
  ) => Promise<void>;

  /*
   * Complete stop
   */
  stop: () => void;

  /*
   * Volume controls
   */
  mute: () => void;
  unmute: () => Promise<boolean>;
  setVolume: (
    volume: number
  ) => void;

  /*
   * Music preview controls
   */
  pauseForPreview: () => Promise<void>;
  resumeAfterPreview: () => Promise<void>;

  /*
   * FinalExperience transition
   *
   * Call this exactly 2 seconds before
   * FinalExperience becomes visible.
   */
  prepareForFinalExperience: () => Promise<void>;

  /*
   * Cancel a pending final transition.
   *
   * Useful if FinalExperience transition
   * gets cancelled before the 2 second window.
   */
  cancelFinalTransition: () => void;
};

const ExperienceAudioContext =
  createContext<
    ExperienceAudioContextValue | undefined
  >(undefined);

/*
 * =========================================================
 * PROVIDER
 * =========================================================
 */

type ExperienceAudioProviderProps = {
  children: ReactNode;
};

export function ExperienceAudioProvider({
  children,
}: ExperienceAudioProviderProps) {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const fadeFrameRef =
    useRef<number | null>(null);

  const finalTimerRef =
    useRef<number | null>(null);

  const previewPausedRef =
    useRef(false);

  const targetVolumeRef =
    useRef(DEFAULT_VOLUME);

  const mountedRef =
    useRef(true);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(false);

  const [volume, setVolumeState] =
    useState(DEFAULT_VOLUME);

  /*
   * =======================================================
   * CREATE SINGLE AUDIO INSTANCE
   * =======================================================
   */

  useEffect(() => {
    mountedRef.current = true;

    const audio =
      new Audio(BACKGROUND_AUDIO);

    audio.preload = "auto";
    audio.loop = true;
    audio.volume = DEFAULT_VOLUME;

    audioRef.current = audio;

    const handlePlay = () => {
      if (mountedRef.current) {
        setIsPlaying(true);
      }
    };

    const handlePause = () => {
      if (mountedRef.current) {
        setIsPlaying(false);
      }
    };

    const handleEnded = () => {
      if (mountedRef.current) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener(
      "play",
      handlePlay
    );

    audio.addEventListener(
      "pause",
      handlePause
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      mountedRef.current = false;

      /*
       * Cancel fade animation
       */
      if (
        fadeFrameRef.current !== null
      ) {
        cancelAnimationFrame(
          fadeFrameRef.current
        );

        fadeFrameRef.current = null;
      }

      /*
       * Cancel final timer
       */
      if (
        finalTimerRef.current !== null
      ) {
        window.clearTimeout(
          finalTimerRef.current
        );

        finalTimerRef.current = null;
      }

      audio.removeEventListener(
        "play",
        handlePlay
      );

      audio.removeEventListener(
        "pause",
        handlePause
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );

      try {
        audio.pause();
        audio.currentTime = 0;
        audio.removeAttribute("src");
        audio.load();
      } catch {
        // Ignore cleanup errors.
      }

      audioRef.current = null;
    };
  }, []);

  /*
   * =========================================================
   * CANCEL FADE
   * =========================================================
   */

  const cancelFade =
    useCallback(() => {
      if (
        fadeFrameRef.current !== null
      ) {
        cancelAnimationFrame(
          fadeFrameRef.current
        );

        fadeFrameRef.current = null;
      }
    }, []);

  /*
   * =========================================================
   * PLAY
   * =========================================================
   *
   * Important:
   *
   * Browser autoplay policy اجازه نمی‌دهد
   * ما بدون user gesture صدا را تضمینی اجرا کنیم.
   *
   * بنابراین Welcome باید play/fadeIn را
   * داخل onClick صدا بزند.
   * =========================================================
   */

  const play =
    useCallback(
      async (): Promise<boolean> => {
        const audio =
          audioRef.current;

        if (!audio) {
          return false;
        }

        try {
          await audio.play();

          return true;
        } catch {
          return false;
        }
      },
      []
    );

  /*
   * =========================================================
   * PAUSE
   * =========================================================
   */

  const pause =
    useCallback(() => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      try {
        audio.pause();
      } catch {
        // Ignore.
      }
    }, []);

  /*
   * =========================================================
   * RESUME
   * =========================================================
   */

  const resume =
    useCallback(async (): Promise<boolean> => {
      return play();
    }, [play]);

  /*
   * =========================================================
   * SET VOLUME
   * =========================================================
   */

  const setVolume =
    useCallback(
      (nextVolume: number) => {
        const safeVolume =
          Math.min(
            1,
            Math.max(
              0,
              nextVolume
            )
          );

        targetVolumeRef.current =
          safeVolume;

        setVolumeState(
          safeVolume
        );

        const audio =
          audioRef.current;

        if (!audio) {
          return;
        }

        if (!audio.muted) {
          audio.volume =
            safeVolume;
        }
      },
      []
    );

  /*
   * =========================================================
   * FADE TO
   * =========================================================
   */

  const fadeTo =
    useCallback(
      (
        target: number,
        duration: number
      ): Promise<void> => {
        const audio =
          audioRef.current;

        if (!audio) {
          return Promise.resolve();
        }

        cancelFade();

        const safeTarget =
          Math.min(
            1,
            Math.max(
              0,
              target
            )
          );

        const start =
          audio.volume;

        const difference =
          safeTarget - start;

        if (
          duration <= 0 ||
          Math.abs(difference) <
            0.001
        ) {
          audio.volume =
            safeTarget;

          return Promise.resolve();
        }

        return new Promise(
          (resolve) => {
            const startedAt =
              performance.now();

            const animate =
              (now: number) => {
                if (
                  !audioRef.current
                ) {
                  fadeFrameRef.current =
                    null;

                  resolve();

                  return;
                }

                const elapsed =
                  now -
                  startedAt;

                const progress =
                  Math.min(
                    1,
                    elapsed /
                      duration
                  );

                /*
                 * Smoothstep easing
                 */
                const eased =
                  progress *
                  progress *
                  (3 -
                    2 *
                      progress);

                audio.volume =
                  Math.min(
                    1,
                    Math.max(
                      0,
                      start +
                        difference *
                          eased
                    )
                  );

                if (
                  progress >= 1
                ) {
                  fadeFrameRef.current =
                    null;

                  resolve();

                  return;
                }

                fadeFrameRef.current =
                  requestAnimationFrame(
                    animate
                  );
              };

            fadeFrameRef.current =
              requestAnimationFrame(
                animate
              );
          }
        );
      },
      [cancelFade]
    );

  /*
   * =========================================================
   * FADE IN
   * =========================================================
   */

  const fadeIn =
    useCallback(
      async (): Promise<boolean> => {
        const audio =
          audioRef.current;

        if (!audio) {
          return false;
        }

        /*
         * If FinalExperience transition
         * was scheduled, cancel it.
         */
        if (
          finalTimerRef.current !==
          null
        ) {
          window.clearTimeout(
            finalTimerRef.current
          );

          finalTimerRef.current = null;
        }

        cancelFade();

        const target =
          isMuted
            ? 0
            : targetVolumeRef.current;

        audio.volume = 0;

        const started =
          await play();

        if (!started) {
          return false;
        }

        await fadeTo(
          target,
          FADE_DURATION
        );

        return true;
      },
      [
        cancelFade,
        fadeTo,
        isMuted,
        play,
      ]
    );

  /*
   * =========================================================
   * FADE OUT
   * =========================================================
   */

  const fadeOut =
    useCallback(
      async (
        stopAfter = false
      ): Promise<void> => {
        const audio =
          audioRef.current;

        if (!audio) {
          return;
        }

        cancelFade();

        /*
         * اگر موزیک از قبل pause باشد،
         * fade معنی ندارد.
         */
        if (audio.paused) {
          if (stopAfter) {
            try {
              audio.currentTime = 0;

              audio.volume =
                isMuted
                  ? 0
                  : targetVolumeRef.current;
            } catch {
              // Ignore.
            }
          }

          return;
        }

        await fadeTo(
          0,
          FADE_DURATION
        );

        if (
          stopAfter
        ) {
          try {
            audio.pause();

            audio.currentTime = 0;

            audio.volume =
              isMuted
                ? 0
                : targetVolumeRef.current;
          } catch {
            // Ignore.
          }
        }
      },
      [
        cancelFade,
        fadeTo,
        isMuted,
      ]
    );

  /*
   * =========================================================
   * STOP
   * =========================================================
   */

  const stop =
    useCallback(() => {
      const audio =
        audioRef.current;

      if (!audio) {
        return;
      }

      cancelFade();

      if (
        finalTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          finalTimerRef.current
        );

        finalTimerRef.current = null;
      }

      try {
        audio.pause();

        audio.currentTime = 0;

        audio.volume =
          isMuted
            ? 0
            : targetVolumeRef.current;
      } catch {
        // Ignore.
      }

      previewPausedRef.current =
        false;
    }, [
      cancelFade,
      isMuted,
    ]);

  /*
   * =========================================================
   * MUTE
   * =========================================================
   */

  const mute =
    useCallback(() => {
      const audio =
        audioRef.current;

      setIsMuted(true);

      if (!audio) {
        return;
      }

      audio.muted = true;
    }, []);

  /*
   * =========================================================
   * UNMUTE
   * =========================================================
   */

  const unmute =
    useCallback(
      async (): Promise<boolean> => {
        const audio =
          audioRef.current;

        setIsMuted(false);

        if (!audio) {
          return false;
        }

        audio.muted = false;

        audio.volume =
          targetVolumeRef.current;

        if (audio.paused) {
          return play();
        }

        return true;
      },
      [play]
    );

  /*
   * =========================================================
   * MUSIC PREVIEW
   * =========================================================
   *
   * Used inside Music Experience.
   *
   * Background:
   *
   *     Fade Out
   *        ↓
   *      Pause
   *
   * After preview:
   *
   *      Resume
   *        ↓
   *      Fade In
   *
   * currentTime is preserved.
   * =========================================================
   */

  const pauseForPreview =
    useCallback(
      async (): Promise<void> => {
        const audio =
          audioRef.current;

        if (!audio) {
          return;
        }

        if (audio.paused) {
          previewPausedRef.current =
            false;

          return;
        }

        previewPausedRef.current =
          true;

        await fadeTo(
          0,
          FADE_DURATION
        );

        try {
          /*
           * Do NOT reset currentTime.
           */
          audio.pause();
        } catch {
          // Ignore.
        }
      },
      [fadeTo]
    );

  /*
   * =========================================================
   * RESUME AFTER PREVIEW
   * =========================================================
   */

  const resumeAfterPreview =
    useCallback(
      async (): Promise<void> => {
        const audio =
          audioRef.current;

        if (!audio) {
          return;
        }

        if (
          !previewPausedRef.current
        ) {
          return;
        }

        previewPausedRef.current =
          false;

        if (isMuted) {
          return;
        }

        audio.volume = 0;

        const started =
          await play();

        if (!started) {
          return;
        }

        await fadeTo(
          targetVolumeRef.current,
          FADE_DURATION
        );
      },
      [
        fadeTo,
        isMuted,
        play,
      ]
    );

  /*
   * =========================================================
   * PREPARE FOR FINAL EXPERIENCE
   * =========================================================
   *
   * IMPORTANT:
   *
   * This method is the official transition
   * from Symbol → FinalExperience.
   *
   * We don't simply call stop().
   *
   * Instead:
   *
   *      Symbol
   *        ↓
   *   prepareForFinalExperience()
   *        ↓
   *      2 seconds
   *        ↓
   *    Fade Out
   *        ↓
   *      Stop
   *        ↓
   *  FinalExperience
   *
   * The actual FinalExperience component
   * should appear AFTER this Promise resolves.
   *
   * Therefore there is no race condition.
   * =========================================================
   */

  const prepareForFinalExperience =
    useCallback(
      async (): Promise<void> => {
        const audio =
          audioRef.current;

        if (!audio) {
          return;
        }

        /*
         * Cancel any previous scheduled
         * final transition.
         */
        if (
          finalTimerRef.current !==
          null
        ) {
          window.clearTimeout(
            finalTimerRef.current
          );

          finalTimerRef.current = null;
        }

        /*
         * If already stopped, nothing to do.
         */
        if (audio.paused) {
          try {
            audio.currentTime = 0;

            audio.volume =
              isMuted
                ? 0
                : targetVolumeRef.current;
          } catch {
            // Ignore.
          }

          return;
        }

        /*
         * We intentionally use the entire
         * 2-second window for the fade.
         *
         * This means:
         *
         * T - 2.0s  → fade starts
         * T - 1.0s  → almost silent
         * T         → completely stopped
         *
         * FinalExperience enters exactly
         * when the music is finished.
         */

        await fadeTo(
          0,
          FINAL_FADE_DURATION
        );

        /*
         * Stop completely.
         */
        try {
          audio.pause();

          audio.currentTime = 0;

          audio.volume =
            isMuted
              ? 0
              : targetVolumeRef.current;
        } catch {
          // Ignore.
        }

        previewPausedRef.current =
          false;
      },
      [
        fadeTo,
        isMuted,
      ]
    );

  /*
   * =========================================================
   * CANCEL FINAL TRANSITION
   * =========================================================
   */

  const cancelFinalTransition =
    useCallback(() => {
      if (
        finalTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          finalTimerRef.current
        );

        finalTimerRef.current = null;
      }

      cancelFade();
    }, [cancelFade]);

  /*
   * =========================================================
   * CONTEXT VALUE
   * =========================================================
   */

  const value:
    ExperienceAudioContextValue = {
    isPlaying,
    isMuted,
    volume,

    play,
    pause,
    resume,

    fadeIn,
    fadeOut,
    stop,

    mute,
    unmute,
    setVolume,

    pauseForPreview,
    resumeAfterPreview,

    prepareForFinalExperience,
    cancelFinalTransition,
  };

  return (
    <ExperienceAudioContext.Provider
      value={value}
    >
      {children}
    </ExperienceAudioContext.Provider>
  );
}

/*
 * =========================================================
 * HOOK
 * =========================================================
 */

export function useExperienceAudio() {
  const context =
    useContext(
      ExperienceAudioContext
    );

  if (!context) {
    throw new Error(
      "useExperienceAudio must be used inside ExperienceAudioProvider"
    );
  }

  return context;
}