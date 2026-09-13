type IconSvgProps = {
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

/** expand_more — Material Symbols Rounded, downloaded from
 * fonts.google.com/icons and optimized with SVGO. Fill inherits from CSS
 * (`currentColor`), same as every other icon on the site. */
export default function ExpandMoreIcon({
  className = "",
  size = 24,
  "aria-hidden": ariaHidden,
}: IconSvgProps) {
  return (
    <svg
      viewBox="0 -960 960 960"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden={ariaHidden}
      className={className}
    >
      <path d="M480-344 240-584l56-56 184 184 184-184 56 56z" />
    </svg>
  );
}
