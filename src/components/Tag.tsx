type TagProps = {
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<TagProps["size"]>, string> = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

/** Small pill label for a piece of content metadata (a genre, a category,
 * a requirement) — not to be confused with NavPill's numeric count badge. */
export default function Tag({ children, size = "sm", className = "" }: TagProps) {
  return (
    <span
      className={`shrink-0 whitespace-nowrap rounded-full bg-bg-tertiary font-body text-text-secondary ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </span>
  );
}
