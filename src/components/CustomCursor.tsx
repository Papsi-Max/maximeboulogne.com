"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

type CursorKind =
  | "default"
  | "hover"
  | "smile"
  | "play"
  | "disabled"
  | "drag"
  | "copy"
  | "copied";

const SIZE: Record<CursorKind, number> = {
  default: 40,
  hover: 80,
  smile: 80,
  play: 80,
  disabled: 40,
  drag: 80,
  copy: 80,
  copied: 80,
};

const BASE_SIZE = 80;
// Pressing on "hover" (80px) shrinks it to 60px; every other kind scales
// by that same ratio. "disabled" never reacts to press — it's not
// interactive.
const PRESSED_SCALE = 60 / 80;

function kindFromTarget(eventTarget: EventTarget | null): CursorKind {
  const target = (eventTarget as HTMLElement)?.closest<HTMLElement>(
    "[data-cursor], a, button"
  );
  const dataCursor = target?.dataset.cursor as CursorKind | undefined;
  return dataCursor ?? (target ? "hover" : "default");
}

export default function CustomCursor() {
  const pathname = usePathname();
  const [kind, setKind] = useState<CursorKind>("default");
  const [pressed, setPressed] = useState(false);
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

  // Re-check whatever's currently under the cursor's last known position,
  // for whenever the DOM changes without the mouse moving.
  const recheckKindAtCursor = () => {
    const el = document.elementFromPoint(x.get(), y.get());
    setKind(kindFromTarget(el));
  };

  // A route change swaps the DOM under a cursor that hasn't moved, so the
  // kind picked up on the old page (hover, drag, dragging…) would otherwise
  // stick until the next mousemove. Re-check what's now under the cursor
  // once the new page has painted.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      recheckKindAtCursor();
      setPressed(false);
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // A button can flip to/from disabled (attribute change, or the whole
  // element getting swapped) while the cursor sits still on top of it —
  // no mousemove fires to trigger a recheck, so the stale kind would
  // otherwise linger. Watch the DOM for that and recheck.
  useEffect(() => {
    let frame: number | null = null;
    const scheduleRecheck = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        recheckKindAtCursor();
      });
    };

    const observer = new MutationObserver(scheduleRecheck);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["disabled", "aria-disabled", "data-cursor"],
    });

    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setKind(kindFromTarget(e.target));
    };

    // React to press/release right away rather than waiting for the next
    // mousemove, so the shrink starts exactly at the click.
    const onDown = (e: MouseEvent) => {
      setKind(kindFromTarget(e.target));
      setPressed(true);
    };
    const onUp = (e: MouseEvent) => {
      setKind(kindFromTarget(e.target));
      setPressed(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [x, y]);

  if (isTouch) return null;

  const isPressed = pressed && kind !== "disabled";
  const scale = (SIZE[kind] / BASE_SIZE) * (isPressed ? PRESSED_SCALE : 1);
  const scaleTransition = isPressed
    ? { type: "tween" as const, duration: 0.2, ease: "easeOut" as const }
    : { type: "spring" as const, damping: 25, stiffness: 350 };

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
        borderRadius: "50%",
        overflow: "hidden",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      animate={{ scale, opacity: visible ? 1 : 0 }}
      transition={scaleTransition}
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
        {kind === "drag" && (
          <motion.span
            key="drag"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="material-symbols-rounded absolute inset-0 m-auto text-text-accent"
          >
            arrow_range
          </motion.span>
        )}
        {kind === "copy" && (
          <motion.span
            key="copy"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="material-symbols-rounded absolute inset-0 m-auto text-text-accent"
          >
            content_copy
          </motion.span>
        )}
        {kind === "copied" && (
          <motion.span
            key="copied"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="material-symbols-rounded absolute inset-0 m-auto text-text-accent"
          >
            check
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
