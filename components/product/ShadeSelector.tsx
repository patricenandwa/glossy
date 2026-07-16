import type { DbShade } from "@/lib/db/schema";

export function ShadeSelector({
  shades,
  selected,
  onSelect,
  size = "md",
}: {
  shades: DbShade[];
  selected: DbShade | null;
  onSelect: (s: DbShade) => void;
  size?: "sm" | "md" | "lg";
}) {
  const sz = size === "sm" ? "size-4" : size === "lg" ? "size-7" : "size-5";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {shades.map((s) => {
        const isActive = s.name === selected?.name;
        return (
          <button
            key={s.name}
            type="button"
            aria-label={s.name}
            title={s.name}
            onClick={() => onSelect(s)}
            style={{ backgroundColor: s.hex }}
            className={`${sz} rounded-full ring-1 ring-black/10 transition ${
              isActive ? "ring-offset-2 ring-offset-white ring-charcoal" : ""
            }`}
          />
        );
      })}
    </div>
  );
}
