"use client";

import { AnimatePresence, motion } from "framer-motion";
import MusicWidget from "@/components/MusicWidget";
import CustomCursor from "@/components/CustomCursor";
import FocusIndicator from "@/components/FocusIndicator";
import {
  MusicWidgetProvider,
  useMusicWidget,
} from "@/components/MusicWidgetContext";

function MusicWidgetOverlay() {
  const { showMusic } = useMusicWidget();
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
          <MusicWidget />
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
    <MusicWidgetProvider>
      <main className="relative flex min-h-screen w-full overflow-hidden bg-bg-primary py-24">
        <div className="grid-columns w-full">
          <div className="relative col-start-3 col-span-8 -mx-4">{children}</div>
        </div>

        <MusicWidgetOverlay />
      </main>
      <CustomCursor />
      <FocusIndicator />
    </MusicWidgetProvider>
  );
}
