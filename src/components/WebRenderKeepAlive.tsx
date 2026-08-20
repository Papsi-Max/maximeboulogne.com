"use client";

import { useEffect, useRef } from "react";

/**
 * Firefox/WebRender workaround.
 *
 * On Firefox, a `position: fixed` element that is clipped (border-radius or
 * clip-path) and moved via `transform` on every frame — like CustomCursor —
 * can leave ghost pixels behind along its path ("ghosting trail"). This is a
 * known class of WebRender tiling/compositing bug: stale tiles aren't always
 * invalidated when a clipped layer moves without any other layer changing.
 *
 * We observed that mounting/animating an unrelated element elsewhere on the
 * page (the music player widget) reliably stops the ghosting for as long as
 * it stays active. That confirms the trigger is layer *invalidation*, not
 * anything specific to the widget itself.
 *
 * This component reproduces that side effect deliberately and cheaply: a
 * tiny, always-mounted, off-screen element that nudges a compositor-only
 * property (`transform`) at a low, fixed interval. It never becomes visible
 * and has no layout/paint cost beyond a single GPU layer tick.
 *
 * Safe to remove entirely once the underlying WebRender bug is fixed
 * upstream — this is a mitigation, not a real fix.
 */
export default function WebRenderKeepAlive() {
  const ref = useRef<HTMLDivElement>(null);
  const flipped = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isFirefox =
      typeof navigator !== "undefined" &&
      navigator.userAgent.toLowerCase().includes("firefox");
    if (!isFirefox) return;

    const id = window.setInterval(() => {
      flipped.current = !flipped.current;
      el.style.transform = flipped.current
        ? "translate3d(0, 0, 0) scale(1.0001)"
        : "translate3d(0, 0, 0) scale(1)";
    }, 2000);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 h-px w-px opacity-0"
      style={{ willChange: "transform" }}
    />
  );
}
