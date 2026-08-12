import { motion } from "motion/react";

type SelectionCounterProps = {
  selected: number;
  max: number;
};

export default function SelectionCounter({
  selected,
  max,
}: SelectionCounterProps) {
  return (
    <motion.div
      key={selected}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="selection-counter"
    >
      <span>{selected}</span>
      <span className="selection-counter-divider">/</span>
      <span>{max}</span>
    </motion.div>
  );
}