"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

export default function FocusIndicator() {
  const [state, setState] = useState<{
    kind: FocusKind;
    top: number;
    left: number;
  } | null>(null);

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
        setState(null);
        return;
      }

      setState(readState(target));
    };

    const onFocusOut = () => setState(null);

    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);

    // A focused element's own data-cursor can change without the focus
    // moving (e.g. a copy button flipping to its "copied" state) — keep
    // the dot in sync with it instead of freezing on the value it had
    // when focus first landed.
    const observer = new MutationObserver(() => {
      const active = document.activeElement as HTMLElement | null;
      const target = active?.closest<HTMLElement>("[data-cursor]");
      if (!target || !target.matches(":focus-visible")) return;
      setState(readState(target));
    });
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-cursor"],
    });

    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
      observer.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          key={state.kind}
          aria-hidden
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.15, 1] }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="pointer-events-none fixed z-[999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg-inverse"
          style={{
            top: state.top,
            left: state.left,
            width: SIZE[state.kind],
            height: SIZE[state.kind],
          }}
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
      )}
    </AnimatePresence>
  );
}
