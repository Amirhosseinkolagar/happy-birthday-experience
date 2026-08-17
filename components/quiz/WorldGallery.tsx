"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

import { useExperience } from "@/hooks/useExperience";
import { visualWorlds } from "@/data/worlds";

type WorldGalleryProps = {
  onComplete: (worldIds: string[]) => void;
};

export default function WorldGallery({
  onComplete,
}: WorldGalleryProps) {
  const { preferences, setWorlds } = useExperience();

  /*
   * این آزمون فقط یک انتخاب دارد.
   * اگر قبلاً چند مقدار داخل state مانده باشد،
   * فقط اولین مورد استفاده می‌شود.
   */
  const selectedWorldId =
    preferences.worlds?.[0] ?? visualWorlds[0]?.id ?? "";

  const [activeWorldId, setActiveWorldId] =
    useState(selectedWorldId);

  const activeWorld =
    visualWorlds.find(
      (world) => world.id === activeWorldId
    ) ?? visualWorlds[0];

  /*
   * انتخاب دنیا
   *
   * مهم:
   * دیگر toggle یا انتخاب چندتایی نداریم.
   * هر بار فقط همان یک دنیا انتخاب می‌شود.
   */
  function handleWorldSelect(id: string) {
    setActiveWorldId(id);

    // فقط یک ID ذخیره می‌شود
    setWorlds([id]);
  }

  /*
   * فقط وقتی یک دنیا انتخاب شده باشد
   * دکمه ادامه فعال است.
   */
  const isComplete =
    Boolean(activeWorldId) &&
    Boolean(
      preferences.worlds?.length
    );

  if (!activeWorld) {
    return null;
  }

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-black text-white"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWorld.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image
              src={activeWorld.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* خوانایی متن بدون تار کردن تصویر */}
        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/75" />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-10 sm:px-8 lg:px-12">
        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-8 text-center">
          <motion.span
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-xs tracking-[0.35em] text-[#D4AF37]"
          >
            انتخاب دوم
          </motion.span>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.08,
            }}
            className="mt-4 text-4xl font-semibold tracking-tight text-[#F8F3E9] sm:text-5xl lg:text-6xl"
          >
            اگر می‌توانستی
            <br />

            <span className="text-[#D4AF37]">
              امشب جایی باشی...
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.2,
            }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/65 sm:text-base"
          >
            فقط یک دنیا را انتخاب کن.
            <br />
            جایی را انتخاب کن که بیشتر از همه
            با حال دلت جور است.
          </motion.p>
        </div>

        {/* =================================================
            MAIN IMAGE
        ================================================== */}

        <div className="relative mx-auto w-full max-w-6xl">
          <motion.div
            layout
            className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-black/20 p-2 shadow-2xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWorld.id}
                  initial={{
                    opacity: 0,
                    scale: 1.02,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeWorld.image}
                    alt={activeWorld.title}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1200px"
                    className="object-cover object-center"
                  />
                </motion.div>
              </AnimatePresence>

              {/* فقط برای خوانایی پایین تصویر */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

              {/* اطلاعات تصویر */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWorld.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.45,
                  }}
                  className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10"
                >
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <div className="mb-3 text-3xl">
                        {activeWorld.emoji}
                      </div>

                      <h2 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
                        {activeWorld.title}
                      </h2>

                      <p className="mt-2 text-sm text-white/70 sm:text-base">
                        {activeWorld.subtitle}
                      </p>
                    </div>

                    {/* انتخاب شده */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-black/40 text-[#D4AF37] shadow-xl backdrop-blur-md">
                      ✓
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* =================================================
            SELECTED INDICATOR
        ================================================== */}

        <div className="mt-7 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-5 py-2.5 text-sm text-white/70 backdrop-blur-md">
            <span className="text-[#D4AF37]">
              ✓
            </span>

            <span>
              یک دنیا انتخاب شده
            </span>
          </div>
        </div>

        {/* =================================================
            WORLD STRIP
        ================================================== */}

        <div className="mt-7 overflow-x-auto pb-4">
          <div className="mx-auto flex w-max gap-3 px-2">
            {visualWorlds.map((world) => {
              const selected =
                activeWorld.id === world.id;

              return (
                <motion.button
                  key={world.id}
                  type="button"
                  onClick={() =>
                    handleWorldSelect(world.id)
                  }
                  whileHover={{
                    y: -5,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  className={`group relative h-24 w-36 shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 sm:h-28 sm:w-44 ${
                    selected
                      ? "border-[#D4AF37]/80 shadow-[0_0_35px_rgba(212,175,55,0.22)]"
                      : "border-white/15"
                  }`}
                >
                  <Image
                    src={world.image}
                    alt={world.title}
                    fill
                    sizes="176px"
                    className={`object-cover transition duration-500 ${
                      selected
                        ? "scale-105"
                        : "scale-100 group-hover:scale-105"
                    }`}
                  />

                  <div
                    className={`absolute inset-0 transition ${
                      selected
                        ? "bg-black/20"
                        : "bg-black/45 group-hover:bg-black/25"
                    }`}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-2 text-right">
                    <div className="text-xs font-medium text-white">
                      {world.title}
                    </div>
                  </div>

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
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-[#D4AF37]/70 bg-black/50 text-xs text-[#D4AF37] backdrop-blur-md"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* =================================================
            NEXT
        ================================================== */}

        <motion.div
          initial={false}
          animate={{
            opacity: isComplete ? 1 : 0.4,
            y: isComplete ? 0 : 5,
          }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            type="button"
            disabled={!isComplete}
            onClick={() => {
              if (!activeWorldId) return;

              /*
               * تضمین می‌کنیم فقط یک world
               * به مرحله بعد ارسال شود.
               */
              onComplete([activeWorldId]);
            }}
            whileHover={
              isComplete
                ? {
                    scale: 1.04,
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
            className="rounded-full border border-[#D4AF37]/55 bg-black/30 px-8 py-3.5 text-sm font-medium text-[#D4AF37] shadow-xl backdrop-blur-md transition hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed"
          >
            این دنیا را انتخاب کردم

            <span className="mr-3">
              ←
            </span>
          </motion.button>
        </motion.div>
      </section>
    </main>
  );
}