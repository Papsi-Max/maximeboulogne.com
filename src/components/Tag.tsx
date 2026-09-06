type TagProps = {
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<TagProps["size"]>, string> = {
  // sm: one short word (a genre), stays on one line as a true pill.
  sm: "shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs",
  // md: can hold a longer phrase (a requirement) — wraps instead of being
  // clipped by an ancestor's overflow-hidden, so a softer rounding instead
  // of a full pill once it grows past one line.
  md: "block w-full rounded-xl px-3 py-1.5 text-sm",
};

/** Small pill label for a piece of content metadata (a genre, a category,
 * a requirement) — not to be confused with NavPill's numeric count badge. */
export default function Tag({ children, size = "sm", className = "" }: TagProps) {
  return (
    <span
      className={`bg-bg-tertiary font-body text-text-secondary ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </span>
  );
}
