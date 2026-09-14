type IconSvgProps = {
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

/** ai_search — Material Symbols Rounded (magnifying glass + spark),
 * downloaded from fonts.google.com/icons and optimized with SVGO. Fill
 * inherits from CSS (`currentColor`), same as every other icon on the
 * site. Used on the work search input to signal the search is AI-backed. */
export default function AiSearchIcon({
  className = "",
  size = 24,
  "aria-hidden": ariaHidden,
}: IconSvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden={ariaHidden}
      className={className}
    >
      <path d="m15.485.008 2.196 3.674 4.22.725-3.675 2.196-.724 4.219-2.197-3.674-4.218-.725 3.674-2.196z" />
      <path d="M9.5 3q1.4 0 2.578.499L9.565 5.001 9.5 5Q7.625 5 6.313 6.313a4.5 4.5 0 0 0-.836 1.133l-.055.033.035.006A4.4 4.4 0 0 0 5 9.5q0 1.875 1.313 3.188Q7.625 14 9.5 14t3.188-1.312T14 9.5q0-.283-.031-.553l.09.016 1.58 2.642A6 6 0 0 1 14.7 13.3l6.3 6.3-1.4 1.4-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612Q6.775 3 9.5 3" />
      <path d="m8.912 6.543 1.182 1.979 2.272.39-1.978 1.182-.39 2.272-1.183-1.978-2.272-.39 1.979-1.183z" />
    </svg>
  );
}
