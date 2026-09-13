type IconSvgProps = {
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

/** arrow_back — Material Symbols Rounded, downloaded from
 * fonts.google.com/icons and optimized with SVGO. Fill inherits from CSS
 * (`currentColor`), same as every other icon on the site. */
export default function ArrowBackIcon({
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
      <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80z" />
    </svg>
  );
}
