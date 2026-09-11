"use client";

import { useState } from "react";
import GitHubIcon from "@/components/GitHubIcon";

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

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
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
        className="-ml-4 flex items-center gap-1.5 rounded-full px-4 py-1.5 font-body text-base text-text-secondary underline decoration-from-font transition-colors hover:bg-bg-tertiary hover:text-text-primary"
      >
        <GitHubIcon aria-hidden className="h-4 w-4" />
        {linkText}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        onKeyDown={handleKeyDown}
        data-cursor={copied ? "copied" : "copy"}
        aria-label={copied ? "Command copied" : "Copy command"}
        className="inline-flex max-w-full items-center rounded-xl border border-border-primary bg-bg-tertiary px-4 py-3 text-left transition-colors hover:bg-[#525252]"
      >
        <code className="whitespace-pre-wrap break-words font-mono text-base text-text-primary">
          {command}
        </code>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Command copied to clipboard" : ""}
      </span>
    </div>
  );
}
