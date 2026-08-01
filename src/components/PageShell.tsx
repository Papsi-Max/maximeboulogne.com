"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import MusicWidget from "@/components/MusicWidget";
import CustomCursor from "@/components/CustomCursor";
import FocusIndicator from "@/components/FocusIndicator";
import {
  MusicWidgetProvider,
  useMusicWidget,
} from "@/components/MusicWidgetContext";

function MusicWidgetOverlay() {
  const { showMusic, closeMusic } = useMusicWidget();

  useEffect(() => {
    if (!showMusic) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMusic();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showMusic, closeMusic]);

  return (
    <AnimatePresence>
      {showMusic && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 right-6 sm:right-10"
        >
          <MusicWidget onClose={closeMusic} autoFocus />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <MusicWidgetProvider>
        <main className="relative flex min-h-screen w-full overflow-hidden bg-bg-primary py-24">
          <div className="grid-columns w-full">
            <div className="relative col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-3">
              {children}
            </div>
          </div>

          <MusicWidgetOverlay />
        </main>
        <CustomCursor />
        <FocusIndicator />
      </MusicWidgetProvider>
    </MotionConfig>
  );
}
