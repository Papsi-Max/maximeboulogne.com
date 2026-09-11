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
    <div className="flex w-full flex-col items-start gap-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-body text-lg leading-relaxed text-text-accent underline underline-offset-2 transition-colors hover:text-text-primary"
      >
        <Icon name="open_in_new" aria-hidden size={16} className="shrink-0" />
        {linkText}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        data-cursor="hover"
        aria-label={copied ? "Command copied" : "Copy command"}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border-primary bg-bg-tertiary px-4 py-3 text-left transition-colors hover:bg-[#525252]"
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
