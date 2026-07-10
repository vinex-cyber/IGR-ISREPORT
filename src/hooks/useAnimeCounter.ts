import { useState, useEffect, useRef } from "react";
import { animate } from "animejs";

interface CounterOptions {
  from?: number;
  to: number;
  duration?: number;
  ease?: string;
  autoplay?: boolean;
  delay?: number;
}

export function useAnimeCounter(opts: CounterOptions) {
  const {
    from = 0,
    to,
    duration = 1000,
    ease = "outExpo",
    autoplay = true,
    delay = 0,
  } = opts;

  const [value, setValue] = useState(from);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  const start = () => {
    if (animRef.current) animRef.current.cancel();
    const obj = { v: from };
    animRef.current = animate(obj, {
      v: to,
      duration,
      ease,
      delay,
      onUpdate: () => setValue(Math.round(obj.v)),
    });
  };

  useEffect(() => {
    if (autoplay) start();
    return () => { animRef.current?.cancel(); };
  }, [to, duration, ease, autoplay]);

  return { value, start };
}
