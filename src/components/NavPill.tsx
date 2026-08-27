import Link from "next/link";
import Icon from "@/components/Icon";

type NavPillProps = {
  href: string;
  label: string;
  count: string;
  variant?: "accent" | "muted";
  disabled?: boolean;
};

export default function NavPill({
  href,
  label,
  count,
  variant = "muted",
  disabled = false,
}: NavPillProps) {
  const isAccent = variant === "accent";

  const className = `group relative flex items-center justify-center gap-3 rounded-full px-6 py-3 transition-colors duration-200 ${
    disabled ? "focus-visible:outline-none" : ""
  } ${isAccent ? "bg-bg-accent" : "bg-bg-tertiary"} ${
    disabled
      ? "cursor-not-allowed opacity-50"
      : isAccent
        ? "hover:bg-[#FFE37C]"
        : "hover:bg-[#525252]"
  }`;

  const content = (
    <>
      <span className="flex items-center gap-1.5">
        <span
          className={`font-body font-semibold text-lg ${
            isAccent ? "text-text-inverse" : "text-text-primary"
          }`}
        >
          {label}
        </span>
        <span
          className={`flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-sm font-semibold ${
            isAccent
              ? "bg-bg-inverse text-text-accent"
              : "bg-bg-accent text-text-inverse"
          }`}
        >
          {count}
        </span>
      </span>
      {!disabled && (
        <Icon
          name="arrow_forward"
          aria-hidden
          size={20}
          className={`transition-transform duration-200 group-hover:translate-x-1 ${
            isAccent ? "text-text-inverse" : "text-text-primary"
          }`}
        />
      )}
    </>
  );

  if (disabled) {
    return (
      <div
        data-cursor="disabled"
        role="link"
        aria-disabled
        tabIndex={0}
        className={className}
      >
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
