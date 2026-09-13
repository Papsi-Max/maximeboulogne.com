type IconSvgProps = {
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

/** sentiment_satisfied — Material Symbols Rounded, downloaded from
 * fonts.google.com/icons and optimized with SVGO. Fill inherits from CSS
 * (`currentColor`), same as every other icon on the site. */
export default function SentimentSatisfiedIcon({
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
      <path d="M620-520q25 0 42.5-17.5T680-580t-17.5-42.5T620-640t-42.5 17.5T560-580t17.5 42.5T620-520m-280 0q25 0 42.5-17.5T400-580t-17.5-42.5T340-640t-42.5 17.5T280-580t17.5 42.5T340-520m263.5 221.5Q659-337 684-400h-66q-22 37-58.5 58.5T480-320t-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260t123.5-38.5M324-111.5Q251-143 197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880t156 31.5T763-763t85.5 127T880-480t-31.5 156T763-197t-127 85.5T480-80t-156-31.5" />
    </svg>
  );
}
