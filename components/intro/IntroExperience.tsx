"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import PixoraCinematicIntro from "./PixoraCinematicIntro";

type IntroExperienceProps = {
  onComplete: () => void;
};

export default function IntroExperience({
  onComplete,
}: IntroExperienceProps) {
  const [started, setStarted] = useState(false);
  const [musicError, setMusicError] = useState(false);

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const audioStartedRef =
    useRef(false);

  /*
   * =====================================================
   * START INTRO MUSIC
   * =====================================================
   */

  async function startMusic() {
    if (audioStartedRef.current) {
      return true;
    }

    const audio = new Audio(
      "/audio/PixoraCinematicIntro.mp3"
    );

    audio.preload = "auto";
    audio.loop = false;
    audio.volume = 0.45;

    audioRef.current = audio;

    try {
      await audio.play();

      audioStartedRef.current = true;

      return true;
    } catch {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.removeAttribute("src");
        audio.load();
      } catch {
        // ignore
      }

      audioRef.current = null;
      audioStartedRef.current = false;

      return false;
    }
  }

  /*
   * =====================================================
   * STOP INTRO MUSIC
   * =====================================================
   */

  function stopMusic() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
    } catch {
      // ignore
    }

    audioRef.current = null;
    audioStartedRef.current = false;
  }

  /*
   * =====================================================
   * START EXPERIENCE
   * =====================================================
   */

  async function handleStart() {
    setMusicError(false);

    const musicStarted =
      await startMusic();

    if (!musicStarted) {
      setMusicError(true);
    }

    /*
     * مهم:
     *
     * حتی اگر browser موسیقی را block کند،
     * cinematic باید اجرا شود.
     */

    setStarted(true);
  }

  /*
   * =====================================================
   * CLEANUP
   * =====================================================
   */

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  /*
   * =====================================================
   * START SCREEN
   * =====================================================
   */

  if (!started) {
    return (
      <main
        dir="ltr"
        aria-label="Start PIXORA experience"
        className="pixora-intro flex min-h-screen items-center justify-center overflow-hidden"
      >
        <div className="pixora-bg" />

        <div className="pixora-grain" />

        <div className="pixora-vignette" />

        <div className="pixora-ambient pixora-ambient-one" />

        <div className="pixora-ambient pixora-ambient-two" />

        <section className="relative z-50 flex w-full max-w-xl flex-col items-center px-6 text-center">
          <div className="mb-8 text-xs font-medium tracking-[0.45em] text-white/45">
            PIXORA
          </div>

          <h1
            className="text-4xl font-semibold tracking-[0.08em] text-white sm:text-6xl"
            style={{
              textShadow:
                "0 0 35px rgba(255,255,255,0.12)",
            }}
          >
            A WORLD
            <br />
            MADE FOR YOU
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-white/55 sm:text-base">
            آماده‌ای وارد دنیای
            <br />
            PIXORA بشی؟
          </p>

          <button
            type="button"
            onClick={handleStart}
            className="group relative mt-10 overflow-hidden rounded-full border border-white/20 bg-white/[0.06] px-9 py-4 text-sm font-medium tracking-[0.12em] text-white backdrop-blur-md transition-all duration-500 hover:border-white/40 hover:bg-white/[0.12] hover:shadow-[0_0_45px_rgba(255,255,255,0.12)] active:scale-[0.97]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

            <span className="relative z-10 flex items-center gap-3">
              <span>شروع تجربه</span>

              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </button>

          {musicError && (
            <p className="mt-5 text-xs leading-6 text-red-200/70">
              موسیقی شروع نشد، اما تجربه ادامه پیدا می‌کند.
            </p>
          )}

          <p className="mt-5 text-[10px] tracking-[0.12em] text-white/30">
            برای تجربه کامل، صدا را روشن کنید
          </p>
        </section>
      </main>
    );
  }

  /*
   * =====================================================
   * CINEMATIC INTRO
   * =====================================================
   */

  return (
    <PixoraCinematicIntro
      onComplete={async () => {
        const audio = audioRef.current;

        /*
         * اگر موزیک اجرا نشده،
         * مستقیم برو Welcome.
         */

        if (!audio) {
          stopMusic();
          onComplete();
          return;
        }

        /*
         * Fade out موسیقی
         */

        const startVolume = audio.volume;

        const duration = 2000;

        const startedAt =
          performance.now();

        await new Promise<void>(
          (resolve) => {
            const animate = (
              now: number
            ) => {
              const elapsed =
                now - startedAt;

              const progress =
                Math.min(
                  1,
                  elapsed / duration
                );

              const eased =
                1 -
                Math.pow(
                  1 - progress,
                  3
                );

              audio.volume =
                Math.max(
                  0,
                  startVolume *
                    (1 - eased)
                );

              if (progress >= 1) {
                resolve();
                return;
              }

              requestAnimationFrame(
                animate
              );
            };

            requestAnimationFrame(
              animate
            );
          }
        );

        stopMusic();

        onComplete();
      }}
    />
  );
}