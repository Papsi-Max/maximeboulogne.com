"use client";

import { createContext, useContext, useState } from "react";

const MusicWidgetContext = createContext<{
  showMusic: boolean;
  openMusic: () => void;
} | null>(null);

export function MusicWidgetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMusic, setShowMusic] = useState(false);
  return (
    <MusicWidgetContext.Provider
      value={{ showMusic, openMusic: () => setShowMusic(true) }}
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
