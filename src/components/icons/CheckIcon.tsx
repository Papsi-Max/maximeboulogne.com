type IconSvgProps = {
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

/** check — Material Symbols Rounded, downloaded from
 * fonts.google.com/icons and optimized with SVGO. Fill inherits from CSS
 * (`currentColor`), same as every other icon on the site. */
export default function CheckIcon({
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
      <path d="M382-240 154-468l57-57 171 171 367-367 57 57z" />
    </svg>
  );
}
