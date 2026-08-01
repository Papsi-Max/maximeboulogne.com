import Link from "next/link";
import { ArrowRight } from "lucide-react";

type NavPillProps = {
  href: string;
  label: string;
  count: string;
  variant?: "accent" | "muted";
};

export default function NavPill({
  href,
  label,
  count,
  variant = "muted",
}: NavPillProps) {
  const isAccent = variant === "accent";

  return (
    <Link
      href={href}
      className={`group flex items-center justify-center gap-3 rounded-full px-6 py-3 transition-colors duration-200 ${
        isAccent
          ? "bg-bg-accent hover:bg-text-primary"
          : "bg-bg-tertiary hover:bg-[#525252]"
      }`}
    >
      <span className="flex items-center gap-1.5">
        <span
          className={`font-body font-semibold text-lg ${
            isAccent ? "text-text-inverse" : "text-text-primary"
          }`}
        >
          {label}
        </span>
        <span
          className={`flex items-center justify-center rounded-full px-1.5 py-0.5 text-sm font-semibold ${
            isAccent
              ? "bg-bg-inverse text-text-accent"
              : "bg-bg-accent text-text-inverse"
          }`}
        >
          {count}
        </span>
      </span>
      <ArrowRight
        aria-hidden
        className={`h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 ${
          isAccent ? "text-text-inverse" : "text-text-primary"
        }`}
        strokeWidth={2}
      />
    </Link>
  );
}
