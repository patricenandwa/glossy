import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center gap-0 rounded-full ring-1 ring-black/[0.08]">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
        className="grid size-10 place-items-center rounded-full text-charcoal hover:bg-blush/60"
      >
        <Minus className="size-4" strokeWidth={1.5} />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
        className="grid size-10 place-items-center rounded-full text-charcoal hover:bg-blush/60"
      >
        <Plus className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
