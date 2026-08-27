type IconProps = {
  name: string;
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

export default function Icon({
  name,
  className = "",
  size,
  "aria-hidden": ariaHidden,
}: IconProps) {
  return (
    <span
      aria-hidden={ariaHidden}
      className={`material-symbols-rounded ${className}`}
      style={size ? { fontSize: size, width: size, height: size } : undefined}
    >
      {name}
    </span>
  );
}
