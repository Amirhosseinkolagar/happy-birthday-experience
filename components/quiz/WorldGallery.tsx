"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useExperience } from "@/hooks/useExperience";
import Image from "next/image";

import { visualWorlds } from "@/data/worlds";

type WorldGalleryProps = {
  onComplete: (worldIds: string[]) => void;
};

export default function WorldGallery({
  onComplete,
}: WorldGalleryProps) {
  const { preferences, setWorlds } = useExperience();

  const selectedWorlds = preferences.worlds;

  const [activeWorldId, setActiveWorldId] = useState(
    visualWorlds[0]?.id ?? ""
  );

  const activeWorld =
    visualWorlds.find((world) => world.id === activeWorldId) ??
    visualWorlds[0];

  const isSelected = (id: string) =>
    selectedWorlds.includes(id);

  const canSelectMore = selectedWorlds.length < 3;

  const selectedWorldData = useMemo(
    () =>
      selectedWorlds
        .map((id) =>
          visualWorlds.find((world) => world.id === id)
        )
        .filter(Boolean),
    [selectedWorlds]
  );

  function handleWorldClick(id: string) {
    setActiveWorldId(id);

    if (selectedWorlds.includes(id)) {
        setWorlds(
          selectedWorlds.filter((worldId) => worldId !== id)
        );

      return;
    }

    if (!canSelectMore) {
      return;
    }

    setWorlds([
      ...selectedWorlds,
      id,
    ]);
  }

  const isComplete = selectedWorlds.length === 3;

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#070707] text-white"
    >
      {/* BACKGROUND */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background:
            activeWorld?.gradient ??
            "linear-gradient(145deg, #090909, #17130A, #33270C)",
        }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
        }}
        style={{
          opacity: 0.38,
        }}
      />

      {/* DARK OVERLAY */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.55)_75%)]" />

      {/* CONTENT */}
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-10 sm:px-8 lg:px-12">
        
        {/* TOP LABEL */}
        <div className="mb-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs tracking-[0.35em] text-[#D4AF37]"
          >
            انتخاب دوم
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 text-4xl font-semibold tracking-tight text-[#F8F3E9] sm:text-5xl lg:text-6xl"
          >
            اگر می‌توانستی
            <br />
            <span className="text-[#D4AF37]">
              امشب جایی باشی...
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/55 sm:text-base"
          >
            سه دنیا را انتخاب کن.
            <br />
            لازم نیست به چیزی فکر کنی؛
            فقط ببین کدام تصویر بیشتر با حال دلت جور است.
          </motion.p>
        </div>

        {/* MAIN VISUAL */}
        <div className="relative mx-auto w-full max-w-5xl">
          <motion.div
            layout
            className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.05] p-2 shadow-2xl backdrop-blur-xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem]">
              <AnimatePresence mode="wait">
                <motion.div
                 key={activeWorld?.id}
                 initial={{
                    opacity: 0,
                    scale: 1.08,
                 }}
                 animate={{
                    opacity: 1,
                    scale: 1,
                 }}
                 exit={{
                    opacity: 0,
                    scale: 0.98,
                 }}
                 transition={{
                    duration: 0.8,
                    ease: "easeOut",
                 }}
                 className="absolute inset-0"
                >
                <Image
                 src={activeWorld?.image ?? ""}
                 alt={activeWorld?.title ?? ""}
                 fill
                 priority
                 sizes="(max-width: 768px) 100vw, 1200px"
                 className="object-cover"
                />
               </motion.div>
              </AnimatePresence>

              {/* IMAGE GRADIENT */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />

              {/* WORLD INFO */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWorld?.id}
                  initial={{
                    opacity: 0,
                    y: 20,
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
                    duration: 0.5,
                  }}
                  className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10"
                >
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <div className="mb-3 text-3xl">
                        {activeWorld?.emoji}
                      </div>

                      <h2 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
                        {activeWorld?.title}
                      </h2>

                      <p className="mt-2 text-sm text-white/65 sm:text-base">
                        {activeWorld?.subtitle}
                      </p>
                    </div>

                    {activeWorld &&
                      isSelected(activeWorld.id) && (
                        <motion.div
                          initial={{
                            scale: 0,
                            opacity: 0,
                          }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                          }}
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-sm backdrop-blur-md"
                        >
                          ✓
                        </motion.div>
                      )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* COUNTER */}
        <div className="mt-7 text-center">
          <span className="text-sm text-white/45">
            دنیای انتخاب‌شده
          </span>

          <div className="mt-2 text-xl font-medium">
            <span className="text-[#D4AF37]">
              {selectedWorlds.length}
            </span>
            <span className="mx-1 text-white/25">
              /
            </span>
            <span className="text-white/60">
              ۳
            </span>
          </div>
        </div>

        {/* WORLD STRIP */}
        <div className="mt-7 overflow-x-auto pb-4">
          <div className="mx-auto flex w-max gap-3 px-2">
            {visualWorlds.map((world) => {
              const selected = isSelected(world.id);
              const active = activeWorld?.id === world.id;

              return (
                <motion.button
                  key={world.id}
                  type="button"
                  onClick={() =>
                    handleWorldClick(world.id)
                  }
                  whileHover={{
                    y: -5,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  className={`group relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 sm:h-28 sm:w-40 ${
                    active
                      ? "border-white/60 shadow-[0_0_30px_rgba(255,255,255,0.12)]"
                      : "border-white/10"
                  }`}
                >
                <Image
                    src={world.image}
                    alt={world.title}
                    fill
                    sizes="(max-width: 768px) 128px, 160px"
                    className={`object-cover transition duration-500 ${
                        active
                        ? "scale-110"
                        : "scale-100 group-hover:scale-110"
                    }`}
                />

                  <div className="absolute inset-0 bg-black/40 transition group-hover:bg-black/25" />

                  <div className="absolute inset-x-0 bottom-0 p-2 text-right">
                    <div className="text-xs font-medium text-white">
                      {world.title}
                    </div>
                  </div>

                  {selected && (
                    <motion.div
                      layoutId={`selected-${world.id}`}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-black/35 text-xs backdrop-blur-md"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* SELECTED WORLDS */}
        <div className="mt-5 flex min-h-10 justify-center gap-2">
          {selectedWorldData.map((world, index) => (
            <motion.div
              key={world?.id}
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/65 backdrop-blur-md"
            >
              <span>
                {world?.emoji}
              </span>

              <span>
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.div>
          ))}
        </div>

        {/* NEXT */}
        <motion.div
          initial={false}
          animate={{
            opacity: isComplete ? 1 : 0.35,
            y: isComplete ? 0 : 5,
          }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            type="button"
            disabled={!isComplete}
            onClick={() =>
              onComplete(selectedWorlds)
            }
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
            className="rounded-full border border-[#D4AF37]/50 bg-black/20 px-8 py-3.5 text-sm text-[#D4AF37] backdrop-blur-xl transition hover:bg-[#D4AF37]/10 disabled:cursor-not-allowed"
          >
            {isComplete
              ? "این سه دنیا را انتخاب کردم"
              : `هنوز ${3 - selectedWorlds.length} انتخاب باقی مانده`}

            <span className="mr-3">
              ←
            </span>
          </motion.button>
        </motion.div>

      </section>
    </main>
  );
}