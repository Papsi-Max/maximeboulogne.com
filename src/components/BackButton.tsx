import Link from "next/link";
import Icon from "@/components/Icon";

export default function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Back"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-bg-tertiary"
    >
      <Icon name="arrow_back" aria-hidden size={36} />
    </Link>
  );
}
