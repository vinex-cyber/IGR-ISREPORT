import { useState, useEffect, useRef, useCallback } from "react";
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

  const start = useCallback(() => {
    if (animRef.current) animRef.current.cancel();
    const obj = { v: from };
    animRef.current = animate(obj, {
      v: to,
      duration,
      ease,
      delay,
      onUpdate: () => setValue(Math.round(obj.v)),
    });
  }, [from, to, duration, ease, delay]);

  useEffect(
    function autoStartAnimation() {
      if (autoplay) start();
      return function cancelAnimation() {
        animRef.current?.cancel();
      };
    },
    [to, duration, ease, autoplay, start],
  );

  return { value, start };
}
