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
 * it stays active. The widget's effect comes from a genuine repaint: a new
 * DOM node with border-radius/box-shadow being created and painted, not
 * merely a transform tick on an already-stable layer. A pure `transform`
 * change on a stable layer is exactly the path WebRender optimizes to
 * *avoid* repainting — so it does not reproduce the effect (confirmed: an
 * earlier version of this component only changed `transform` per frame and
 * did not help).
 *
 * This component forces a genuine, cheap repaint on a fixed interval: it
 * toggles a layout-affecting property (`clipPath` on/off) on a tiny,
 * always-mounted, off-screen element, which forces the browser to
 * recompute and repaint that element's clip — the same class of paint work
 * that CustomCursor and the music widget both do, but harmless here since
 * the element is 1x1px and invisible.
 *
 * Safe to remove entirely once the underlying WebRender bug is fixed
 * upstream — this is a mitigation, not a real fix.
 */
export default function WebRenderKeepAlive() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isFirefox =
      typeof navigator !== "undefined" &&
      navigator.userAgent.toLowerCase().includes("firefox");
    if (!isFirefox) return;

    const id = window.setInterval(() => {
      on.current = !on.current;
      el.style.clipPath = on.current ? "circle(50%)" : "circle(49.9%)";
      // Force a synchronous style/layout flush so the repaint actually
      // happens now, rather than getting batched away.
      void el.getBoundingClientRect();
    }, 500);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 h-px w-px opacity-0"
    />
  );
}
