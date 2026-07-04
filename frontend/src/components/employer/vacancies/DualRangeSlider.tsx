import { useCallback, useRef } from "react";

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
}

/** Two-thumb range slider (native range inputs layered on a shared track). */
export function DualRangeSlider({ min, max, step = 1, from, to, onChange }: DualRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = useCallback((value: number) => ((value - min) / (max - min)) * 100, [min, max]);

  return (
    <div className="relative h-5" ref={trackRef}>
      <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-grey-200" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-500"
        style={{ left: `${pct(from)}%`, right: `${100 - pct(to)}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={from}
        onChange={(e) => onChange(Math.min(Number(e.target.value), to - step), to)}
        className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={to}
        onChange={(e) => onChange(from, Math.max(Number(e.target.value), from + step))}
        className="range-thumb pointer-events-none absolute inset-0 w-full appearance-none bg-transparent"
      />
    </div>
  );
}
