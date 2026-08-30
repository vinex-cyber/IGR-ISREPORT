// src/pages/klik/components/AnimatedNumber.tsx
"use client";

import { useAnimeCounter } from "@/hooks/animation/useAnimeCounter";

export function AnimatedNumber({
  value,
  prefix = "",
}: {
  value: number;
  prefix?: string;
}) {
  const rounded = Math.round(Number(value));
  const { value: animated } = useAnimeCounter({ to: rounded });
  return (
    <span className="tabular-nums">
      {prefix}
      {Math.round(animated).toLocaleString("id-ID")}
    </span>
  );
}
