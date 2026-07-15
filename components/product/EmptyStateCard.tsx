import Link from "next/link";

type EmptyStateCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  className?: string;
};

export function EmptyStateCard({
  eyebrow,
  title,
  description,
  href,
  actionLabel,
  className = "",
}: EmptyStateCardProps) {
  return (
    <div
      className={`rounded-3xl bg-soft-pink p-10 text-center ring-1 ring-black/[0.04] sm:p-14 ${className}`.trim()}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
          {eyebrow}
        </p>
      ) : null}
      <p className="font-serif text-2xl text-charcoal sm:text-3xl">{title}</p>
      <p className="mx-auto mt-3 max-w-[34ch] text-sm text-zinc-500 sm:text-base">
        {description}
      </p>
      <Link
        href={href}
        className="mt-8 inline-flex h-12 items-center rounded-full bg-charcoal px-7 text-sm font-medium text-white transition hover:opacity-90"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
