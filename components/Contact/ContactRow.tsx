export default function ContactRow({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-3xl bg-soft-pink p-5 ring-1 ring-black/[0.04] hover:bg-white">
      <span className="grid size-11 place-items-center rounded-full bg-blush">
        <Icon className="size-5 text-charcoal" strokeWidth={1.5} />
      </span>
      <span>
        <span className="block text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</span>
        <span className="mt-0.5 block text-charcoal">{value}</span>
      </span>
    </a>
  );
}