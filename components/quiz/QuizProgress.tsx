"use client";

import { motion } from "motion/react";

type QuizProgressProps = {
  current: number;
  total: number;
};

export default function QuizProgress({
  current,
  total,
}: QuizProgressProps) {
  const progress = (current / total) * 100;

  return (
    <div className="quiz-progress">
      <div className="quiz-progress-meta">
        <span>
          {String(current).padStart(2, "0")}
        </span>

        <span>
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="quiz-progress-track">
        <motion.div
          className="quiz-progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}