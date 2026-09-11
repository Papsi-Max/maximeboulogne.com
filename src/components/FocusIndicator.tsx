"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { CURSOR_PULSE_EVENT } from "@/lib/cursor-events";

type FocusKind = "smile" | "play" | "disabled" | "copy" | "copied";

const SIZE: Record<FocusKind, number> = {
  smile: 80,
  play: 80,
  disabled: 40,
  copy: 80,
  copied: 80,
};

const ICON_SIZE: Record<FocusKind, number> = {
  smile: 48,
  play: 48,
  disabled: 24,
  copy: 48,
  copied: 48,
};

// Same shrink ratio CustomCursor uses for its own click feedback (80px ->
// 60px), reused here so the keyboard dot "presses" the same way the mouse
// cursor does.
const PRESSED_SCALE = 60 / 80;

export default function FocusIndicator() {
  const [state, setState] = useState<{
    kind: FocusKind;
    top: number;
    left: number;
    id: number;
  } | null>(null);

  const targetRef = useRef<HTMLElement | null>(null);
  const nextId = useRef(0);
  const circle = useAnimationControls();

  useEffect(() => {
    const readState = (target: HTMLElement) => {
      const dataCursor = target.dataset.cursor as FocusKind | undefined;
      if (!dataCursor) return null;

      const rect = target.getBoundingClientRect();
      return { kind: dataCursor, top: rect.top, left: rect.right };
    };

    const onFocusIn = (e: FocusEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      if (!target || !target.matches(":focus-visible")) {
        targetRef.current = null;
        setState(null);
        return;
      }

      const next = readState(target);
      targetRef.current = next ? target : null;
      nextId.current += 1;
      setState(next ? { ...next, id: nextId.current } : null);
      if (next) {
        circle.set({ scale: 0 });
        circle.start({
          scale: [0, 1.15, 1],
          transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
        });
      }
    };

    const onFocusOut = () => {
      targetRef.current = null;
      setState(null);
    };

    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);

    // The focused element's own data-cursor can change without the focus
    // moving (e.g. a copy button flipping to its "copied" state) — keep
    // the dot's icon in sync with it.
    const observer = new MutationObserver(() => {
      const target = targetRef.current;
      if (!target || !target.matches(":focus-visible")) return;

      const next = readState(target);
      if (!next) return;

      setState((prev) => (prev ? { ...next, id: prev.id } : null));
    });
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-cursor"],
    });

    // Icon updates alone miss a re-activation that doesn't change the
    // resulting data-cursor value (e.g. clicking "copy" again while it's
    // still showing "copied") — controls dispatch this explicitly on
    // every activation so the press-shrink always replays, mouse or
    // keyboard.
    const onPulse = (e: Event) => {
      const target = targetRef.current;
      if (!target || !target.matches(":focus-visible")) return;
      if (e.target !== target) return;

      circle.start({
        scale: [1, PRESSED_SCALE, 1],
        transition: { duration: 0.2, ease: "easeOut" },
      });
    };
    window.addEventListener(CURSOR_PULSE_EVENT, onPulse);

    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
      window.removeEventListener(CURSOR_PULSE_EVENT, onPulse);
      observer.disconnect();
    };
  }, [circle]);

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          key={state.id}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed z-[999] -translate-x-1/2 -translate-y-1/2"
          style={{
            top: state.top,
            left: state.left,
            width: SIZE[state.kind],
            height: SIZE[state.kind],
          }}
        >
          <motion.div
            animate={circle}
            className="flex h-full w-full items-center justify-center rounded-full bg-bg-inverse"
          >
            {state.kind === "smile" && (
              <span
                className="material-symbols-rounded text-text-accent"
                style={{
                  width: ICON_SIZE.smile,
                  height: ICON_SIZE.smile,
                  fontSize: ICON_SIZE.smile,
                }}
              >
                sentiment_satisfied
              </span>
            )}
            {state.kind === "play" && (
              <span
                className="material-symbols-rounded text-text-accent"
                style={{
                  width: ICON_SIZE.play,
                  height: ICON_SIZE.play,
                  fontSize: ICON_SIZE.play,
                }}
              >
                play_arrow
              </span>
            )}
            {state.kind === "disabled" && (
              <span
                className="material-symbols-rounded text-text-accent"
                style={{
                  width: ICON_SIZE.disabled,
                  height: ICON_SIZE.disabled,
                  fontSize: ICON_SIZE.disabled,
                }}
              >
                block
              </span>
            )}
            {state.kind === "copy" && (
              <span
                className="material-symbols-rounded text-text-accent"
                style={{
                  width: ICON_SIZE.copy,
                  height: ICON_SIZE.copy,
                  fontSize: ICON_SIZE.copy,
                }}
              >
                content_copy
              </span>
            )}
            {state.kind === "copied" && (
              <span
                className="material-symbols-rounded text-text-accent"
                style={{
                  width: ICON_SIZE.copied,
                  height: ICON_SIZE.copied,
                  fontSize: ICON_SIZE.copied,
                }}
              >
                check
              </span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
