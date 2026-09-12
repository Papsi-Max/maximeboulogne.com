"use client";

import { useEffect, useRef, useState } from "react";
import GitHubIcon from "@/components/GitHubIcon";
import { CURSOR_PULSE_EVENT } from "@/lib/cursor-events";

export default function CommandBlock({
  linkText,
  href,
  command,
}: {
  linkText: string;
  href: string;
  command: string;
}) {
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      // Re-clicking while still showing "copied" must push the reset
      // out again, not race against the first click's timer.
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
      resetTimeout.current = setTimeout(() => setCopied(false), 1500);
      // Tell FocusIndicator to (re)play its press-shrink, even if this
      // click lands while already showing "copied" and data-cursor's
      // value won't actually change.
      buttonRef.current?.dispatchEvent(
        new CustomEvent(CURSOR_PULSE_EVENT, { bubbles: true })
      );
    } catch {
      // Clipboard unavailable (no permission, insecure context) — ignore.
    }
  }

  // Belt and suspenders: a native <button> already fires "click" on
  // Enter/Space, but don't rely on that alone for something as central
  // as the copy action — handle the keys directly too, and stop Space
  // from scrolling the page while we're at it.
  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      handleCopy();
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full px-4 py-1.5 font-body text-base text-text-secondary underline decoration-from-font transition-colors hover:bg-bg-tertiary hover:text-text-primary"
      >
        <GitHubIcon aria-hidden className="h-4 w-4" />
        {linkText}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleCopy}
        onKeyDown={handleKeyDown}
        data-cursor={copied ? "copied" : "copy"}
        aria-label={copied ? "Command copied" : "Copy command"}
        className="inline-flex max-w-full items-center rounded border border-[#4a4a4a] bg-bg-primary py-1 px-1.5 text-left transition-colors hover:bg-bg-secondary"
      >
        <code className="whitespace-pre-wrap break-words font-body text-base text-text-accent">
          {command}
        </code>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Command copied to clipboard" : ""}
      </span>
    </div>
  );
}
