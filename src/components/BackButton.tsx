import Link from "next/link";
import Icon from "@/components/Icon";

/** `label` names the destination ("Back to notes") so the link makes sense
 * out of context, e.g. in a screen reader's list of links. */
export default function BackButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex shrink-0 items-center justify-center rounded-full p-1 text-text-primary transition-colors hover:bg-bg-tertiary"
    >
      <Icon name="arrow_back" aria-hidden size={36} />
    </Link>
  );
}
