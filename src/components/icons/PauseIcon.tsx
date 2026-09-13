type IconSvgProps = {
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

/** pause — Material Symbols Rounded, downloaded from
 * fonts.google.com/icons and optimized with SVGO. Fill inherits from CSS
 * (`currentColor`), same as every other icon on the site. */
export default function PauseIcon({
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
      <path d="M560-200v-560h160v560zm-320 0v-560h160v560z" />
    </svg>
  );
}
