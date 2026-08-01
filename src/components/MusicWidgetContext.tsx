"use client";

import { createContext, useContext, useRef, useState } from "react";

const MusicWidgetContext = createContext<{
  showMusic: boolean;
  openMusic: () => void;
  closeMusic: () => void;
} | null>(null);

export function MusicWidgetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMusic, setShowMusic] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <MusicWidgetContext.Provider
      value={{
        showMusic,
        openMusic: () => {
          triggerRef.current = document.activeElement as HTMLElement | null;
          setShowMusic(true);
        },
        closeMusic: () => {
          setShowMusic(false);
          triggerRef.current?.focus();
        },
      }}
    >
      {children}
    </MusicWidgetContext.Provider>
  );
}

export function useMusicWidget() {
  const ctx = useContext(MusicWidgetContext);
  if (!ctx) {
    throw new Error("useMusicWidget must be used within MusicWidgetProvider");
  }
  return ctx;
}
