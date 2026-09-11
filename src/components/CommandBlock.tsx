"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

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

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border-primary bg-bg-secondary">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-4 py-3 font-body text-base text-text-accent underline underline-offset-2 transition-colors hover:bg-bg-tertiary"
      >
        {linkText}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        data-cursor="hover"
        aria-label={copied ? "Command copied" : "Copy command"}
        className="flex w-full items-center justify-between gap-3 border-t border-border-primary px-4 py-3 text-left transition-colors hover:bg-bg-tertiary"
      >
        <code className="whitespace-pre-wrap break-words font-mono text-base text-text-primary">
          {command}
        </code>
        <Icon
          name={copied ? "check" : "content_copy"}
          aria-hidden
          size={20}
          className="shrink-0 text-text-secondary"
        />
      </button>
    </div>
  );
}
