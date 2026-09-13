type IconSvgProps = {
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

/** music_note — Material Symbols Rounded, downloaded from
 * fonts.google.com/icons and optimized with SVGO. Fill inherits from CSS
 * (`currentColor`), same as every other icon on the site. */
export default function MusicNoteIcon({
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
      <path d="M287-167q-47-47-47-113t47-113 113-47q23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47-113-47" />
    </svg>
  );
}
