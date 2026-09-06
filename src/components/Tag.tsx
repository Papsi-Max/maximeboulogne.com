type TagProps = {
  children: string;
  size?: "sm" | "md";
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<TagProps["size"]>, string> = {
  // sm: one short word (a genre), always fits on one line.
  sm: "shrink-0 px-2.5 py-0.5 text-xs",
  // md: can hold a longer phrase (a requirement) that may not fit — stays
  // on one line and ellipsizes rather than being wrapped or clipped by an
  // ancestor's overflow-hidden.
  md: "block w-full px-3 py-1.5 text-sm",
};

/** Small pill label for a piece of content metadata (a genre, a category,
 * a requirement) — not to be confused with NavPill's numeric count badge.
 *
 * `children` must be plain text: it doubles as the `title` tooltip so a
 * sighted mouse/trackpad user can still read a label truncated by the
 * ellipsis. Screen readers are unaffected either way — CSS truncation only
 * clips the visual box, the full text node is still read out in full. */
export default function Tag({ children, size = "sm", className = "" }: TagProps) {
  return (
    <span
      title={children}
      className={`truncate rounded-full bg-bg-tertiary font-body text-text-secondary ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </span>
  );
}
