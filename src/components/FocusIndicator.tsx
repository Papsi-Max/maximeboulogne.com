"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FocusKind = "smile" | "play";

export default function FocusIndicator() {
  const [state, setState] = useState<{
    kind: FocusKind;
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      if (!target || !target.matches(":focus-visible")) {
        setState(null);
        return;
      }

      const dataCursor = target.dataset.cursor as FocusKind | undefined;
      if (!dataCursor) {
        setState(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      setState({
        kind: dataCursor,
        top: rect.top,
        left: rect.right,
      });
    };

    const onFocusOut = () => setState(null);

    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);
    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
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
          className="pointer-events-none fixed z-[999] flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg-inverse"
          style={{ top: state.top, left: state.left }}
        >
          {state.kind === "smile" && (
            <span className="material-symbols-rounded text-text-accent">
              sentiment_satisfied
            </span>
          )}
          {state.kind === "play" && (
            <span className="material-symbols-rounded text-text-accent">
              play_arrow
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
