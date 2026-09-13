import { icons, type IconName } from "./icons";

type IconProps = {
  name: IconName;
  className?: string;
  size?: number;
  /** Unused now that every icon is its own SVG (the outlined/rounded split
   * lived in the old font's two @font-face families). Kept so existing call
   * sites (e.g. GameLibraryExample's `variant="outlined"`) don't need to
   * change — each icon simply is whichever style it was downloaded as. */
  variant?: "rounded" | "outlined";
  "aria-hidden"?: boolean | "true" | "false";
};

export default function Icon({
  name,
  className = "",
  size,
  "aria-hidden": ariaHidden,
}: IconProps) {
  const IconSvg = icons[name];
  return <IconSvg aria-hidden={ariaHidden} className={className} size={size} />;
}
