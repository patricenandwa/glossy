import { Star } from "lucide-react";

export function Rating({
  value,
  count,
  size = "sm",
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const px = size === "md" ? "size-4" : "size-3";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5 text-rose-gold">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={px}
            fill={i < Math.round(value) ? "currentColor" : "none"}
            strokeWidth={1.25}
          />
        ))}
      </div>
      <span className="text-xs text-zinc-500 tabular-nums">
        {value.toFixed(1)}
        {count !== undefined && ` · ${count}`}
      </span>
    </div>
  );
}
