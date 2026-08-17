"use client";

import { motion } from "motion/react";
import {
  colors,
  colorGroups,
} from "@/data/colors";

type ColorUniverseProps = {
  selectedColors: string[];
  onChange: (colors: string[]) => void;
};

export default function ColorUniverse({
  selectedColors,
  onChange,
}: ColorUniverseProps) {
  const MAX_SELECTIONS = 3;

  const toggleColor = (colorId: string) => {
    const alreadySelected =
      selectedColors.includes(colorId);

    if (alreadySelected) {
      onChange(
        selectedColors.filter(
          (id) => id !== colorId
        )
      );

      return;
    }

    if (
      selectedColors.length >=
      MAX_SELECTIONS
    ) {
      return;
    }

    onChange([
      ...selectedColors,
      colorId,
    ]);
  };

  return (
    <div className="color-universe">
      <div className="color-universe-intro">
        
        <p>
          هر خانواده، یک حس.
          <br />
          ببین کدام رنگ، قبل از اینکه
          انتخابش کنی، تو را انتخاب می‌کند.
        </p>
      </div>

      <div className="color-family-list">
        {colorGroups.map(
          (group, groupIndex) => {
            const groupColors =
              colors.filter(
                (color) =>
                  color.group === group.id
              );

            return (
              <motion.section
                key={group.id}
                className="color-family"
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                  delay:
                    groupIndex * 0.045,
                }}
              >
                <div className="color-family-header">
                  <div>
                    <span className="color-family-index">
                      {String(
                        groupIndex + 1
                      ).padStart(2, "0")}
                    </span>

                    <h2>
                      {group.name}
                    </h2>
                  </div>

                  <p>
                    {group.description}
                  </p>
                </div>

                <div className="color-family-grid">
                  {groupColors.map(
                    (
                      color,
                      index
                    ) => {
                      const selectedIndex =
                        selectedColors.indexOf(
                          color.id
                        );

                      const isSelected =
                        selectedIndex !== -1;

                      const isLocked =
                        !isSelected &&
                        selectedColors.length >=
                          MAX_SELECTIONS;

                      return (
                        <motion.button
                          key={color.id}
                          type="button"
                          className={[
                            "color-orb",
                            isSelected
                              ? "is-selected"
                              : "",
                            isLocked
                              ? "is-locked"
                              : "",
                          ].join(" ")}
                          style={
                            {
                              "--color":
                                color.value,
                              "--soft-color":
                                color.softValue,
                            } as React.CSSProperties
                          }
                          onClick={() =>
                            toggleColor(
                              color.id
                            )
                          }
                          whileHover={
                            isLocked
                              ? undefined
                              : {
                                  scale: 1.1,
                                  y: -3,
                                }
                          }
                          whileTap={
                            isLocked
                              ? undefined
                              : {
                                  scale: 0.93,
                                }
                          }
                          initial={{
                            opacity: 0,
                            scale: 0.75,
                          }}
                          animate={{
                            opacity: isLocked
                              ? 0.22
                              : 1,
                            scale:
                              isSelected
                                ? 1.13
                                : 1,
                          }}
                          transition={{
                            duration: 0.3,
                            delay:
                              index * 0.018,
                          }}
                          aria-label={
                            color.name
                          }
                          aria-pressed={
                            isSelected
                          }
                        >
                          <span className="color-orb-inner" />

                          <span className="color-name">
                            {color.name}
                          </span>

                          {isSelected && (
                            <motion.span
                              className="color-selection-number"
                              initial={{
                                opacity: 0,
                                scale: 0.4,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 16,
                              }}
                            >
                              {String(
                                selectedIndex +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </motion.span>
                          )}
                        </motion.button>
                      );
                    }
                  )}
                </div>
              </motion.section>
            );
          }
        )}
      </div>
    </div>
  );
}