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
 * page (the music player widget, animating via Framer Motion on every frame
 * for ~0.3s) reliably stops the ghosting for as long as it stays active.
 * That confirms the trigger is continuous, per-frame layer invalidation —
 * not anything specific to the widget itself, and not a one-off nudge every
 * couple of seconds (an earlier version of this component used a slow
 * setInterval toggle, which was not enough).
 *
 * This component reproduces that side effect deliberately and cheaply: a
 * tiny, always-mounted, off-screen element that nudges a compositor-only
 * property (`transform`) on every animation frame, continuously, for as
 * long as the page is open. It never becomes visible and has no
 * layout/paint cost beyond a single GPU layer tick per frame.
 *
 * Safe to remove entirely once the underlying WebRender bug is fixed
 * upstream — this is a mitigation, not a real fix.
 */
export default function WebRenderKeepAlive() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isFirefox =
      typeof navigator !== "undefined" &&
      navigator.userAgent.toLowerCase().includes("firefox");
    if (!isFirefox) return;

    let frame: number;
    const tick = (t: number) => {
      // Sub-pixel oscillation: visually a no-op, but a real transform
      // change on every frame, matching what the music widget's
      // animation does while it's mounted.
      const s = 1 + Math.sin(t / 500) * 0.0001;
      el.style.transform = `translate3d(0, 0, 0) scale(${s})`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
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
