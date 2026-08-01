"use client";

export default function HoverWord({
  children,
  onClick,
  as = "span",
  bold = true,
  className = "",
  "data-cursor": dataCursor,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  as?: "span" | "button";
  bold?: boolean;
  className?: string;
  "data-cursor"?: string;
  "aria-label"?: string;
}) {
  const Comp = as;
  return (
    <Comp
      type={as === "button" ? "button" : undefined}
      onClick={onClick}
      data-cursor={dataCursor}
      aria-label={ariaLabel}
      className={`group relative isolate inline-flex items-center px-2.5 pb-1.5 pt-2 font-display text-4xl text-text-primary sm:px-4 sm:text-6xl ${
        bold ? "font-semibold" : "font-normal"
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-xl bg-text-accent transition-transform duration-300 ease-out origin-left scale-x-0 group-hover:scale-x-100"
      />
      <span className="transition-colors duration-300 group-hover:text-text-inverse">
        {children}
      </span>
    </Comp>
  );
}
