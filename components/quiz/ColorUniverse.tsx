"use client";

import { motion } from "motion/react";
import { colors } from "@/data/colors";

type ColorUniverseProps = {
  selectedColors: string[];
  onChange: (colors: string[]) => void;
};

export default function ColorUniverse({
  selectedColors,
  onChange,
}: ColorUniverseProps) {
  const MAX_SELECTIONS = 4;

  const toggleColor = (colorId: string) => {
    const alreadySelected = selectedColors.includes(colorId);

    if (alreadySelected) {
      onChange(
        selectedColors.filter((id) => id !== colorId)
      );

      return;
    }

    if (selectedColors.length >= MAX_SELECTIONS) {
      return;
    }

    onChange([...selectedColors, colorId]);
  };

  return (
    <div className="color-universe">
      <div className="color-universe-grid">
        {colors.map((color, index) => {
          const selectedIndex =
            selectedColors.indexOf(color.id);

          const isSelected = selectedIndex !== -1;

          const isLocked =
            !isSelected &&
            selectedColors.length >= MAX_SELECTIONS;

          return (
            <motion.button
              key={color.id}
              type="button"
              className={[
                "color-orb",
                isSelected ? "is-selected" : "",
                isLocked ? "is-locked" : "",
              ].join(" ")}
              style={{
                "--color": color.value,
                "--soft-color": color.softValue,
              } as React.CSSProperties}
              onClick={() => toggleColor(color.id)}
              whileHover={
                isLocked
                  ? undefined
                  : {
                      scale: 1.08,
                    }
              }
              whileTap={
                isLocked
                  ? undefined
                  : {
                      scale: 0.94,
                    }
              }
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: isLocked ? 0.28 : 1,
                scale: isSelected ? 1.12 : 1,
              }}
              transition={{
                duration: 0.35,
                delay: index * 0.025,
              }}
              aria-label={color.name}
              aria-pressed={isSelected}
            >
              <span className="color-orb-inner" />

              {isSelected && (
                <motion.span
                  className="color-selection-number"
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                >
                  {String(selectedIndex + 1).padStart(2, "0")}
                </motion.span>
              )}

              <span className="color-name">
                {color.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}