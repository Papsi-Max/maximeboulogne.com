type IconProps = {
  name: string;
  className?: string;
  size?: number;
  variant?: "rounded" | "outlined";
  "aria-hidden"?: boolean | "true" | "false";
};

export default function Icon({
  name,
  className = "",
  size,
  variant = "rounded",
  "aria-hidden": ariaHidden,
}: IconProps) {
  return (
    <span
      aria-hidden={ariaHidden}
      className={`material-symbols-${variant} ${className}`}
      style={size ? { fontSize: size, width: size, height: size } : undefined}
    >
      {name}
    </span>
  );
}
