"use client";

import { motion } from "motion/react";

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 61) % 100}%`,
  delay: (index % 8) * 0.45,
  duration: 5 + (index % 6),
  size: 1 + (index % 3),
}));

export default function IntroExperience() {
  return (
    <main className="intro relative min-h-screen overflow-hidden">
      {/* نور مخفی مرداد */}
      <div className="sun-glow" aria-hidden="true" />

      {/* ذرات */}
      <div className="particles" aria-hidden="true">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -24, 0],
              opacity: [0.12, 0.55, 0.12],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* هاله مرکزی */}
      <motion.div
        className="center-orb"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        aria-hidden="true"
      />

      {/* محتوای اصلی */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="intro-content text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span className="intro-eyebrow">
              یک تجربه متفاوت
            </span>
          </motion.div>

          <motion.h1
            className="intro-title"
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.3, delay: 0.8, ease: "easeOut" }}
          >
            قبل از اینکه شروع کنیم...
          </motion.h1>

          <motion.p
            className="intro-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.35 }}
          >
            چند انتخاب کوچک دارم؛
            <br />
            شاید بیشتر از چیزی که فکر می‌کنی درباره تو بگن.
          </motion.p>

          <motion.div
            className="intro-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
          />

          <motion.button
            type="button"
            className="start-button"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.15 }}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 45px rgba(212, 175, 55, 0.2)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span>شروع تجربه</span>
            <span className="start-arrow">←</span>
          </motion.button>
        </div>
      </section>

      {/* امضای بسیار ظریف */}
      <motion.div
        className="intro-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.8 }}
      >
        <span>آرام شروع کن...</span>
      </motion.div>
    </main>
  );
}