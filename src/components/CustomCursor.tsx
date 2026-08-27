"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

type CursorKind = "default" | "hover" | "smile" | "play" | "disabled";

const SIZE: Record<CursorKind, number> = {
  default: 40,
  hover: 80,
  smile: 80,
  play: 80,
  disabled: 40,
};

const BASE_SIZE = 80;

export default function CustomCursor() {
  const [kind, setKind] = useState<CursorKind>("default");
  const [isTouch] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
  );

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 30, stiffness: 400, mass: 0.4 });
  const springY = useSpring(y, { damping: 30, stiffness: 400, mass: 0.4 });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.fonts?.load('48px "Material Symbols Rounded"');
  }, []);

  useEffect(() => {
    if (isTouch) return;
    document.body.classList.add("custom-cursor-active");
    return () => document.body.classList.remove("custom-cursor-active");
  }, [isTouch]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor], a, button"
      );
      const dataCursor = target?.dataset.cursor as CursorKind | undefined;
      setKind(dataCursor ?? (target ? "hover" : "default"));
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (isTouch) return null;

  const scale = SIZE[kind] / BASE_SIZE;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[999] flex items-center justify-center bg-bg-inverse"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        width: BASE_SIZE,
        height: BASE_SIZE,
        clipPath: "circle(50%)",
      }}
      animate={{ scale, opacity: visible ? 1 : 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 350 }}
    >
      <AnimatePresence>
        {kind === "smile" && (
          <motion.span
            key="smile"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="material-symbols-rounded absolute inset-0 m-auto text-text-accent"
          >
            sentiment_satisfied
          </motion.span>
        )}
        {kind === "play" && (
          <motion.span
            key="play"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="material-symbols-rounded absolute inset-0 m-auto text-text-accent"
          >
            play_arrow
          </motion.span>
        )}
        {kind === "disabled" && (
          <motion.span
            key="disabled"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="material-symbols-rounded absolute inset-0 m-auto text-text-accent"
          >
            block
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
