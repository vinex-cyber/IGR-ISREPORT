import { useState, useEffect, useRef, useCallback } from "react";
import { animate } from "animejs";

interface CounterOptions {
  from?: number;
  to: number;
  duration?: number;
  ease?: string;
  decimals?: number;
  autoplay?: boolean;
  delay?: number;
}

export function useAnimeCounter(opts: CounterOptions) {
  const {
    from = 0,
    to,
    duration = 1000,
    ease = "outExpo",
    decimals = 0,
    autoplay = true,
    delay = 0,
  } = opts;

  const [value, setValue] = useState(from);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  const start = useCallback(() => {
    if (animRef.current) animRef.current.cancel();
    const obj = { v: from };
    const factor = 10 ** decimals;
    animRef.current = animate(obj, {
      v: to,
      duration,
      ease,
      delay,
      onUpdate: () => setValue(Math.round(obj.v * factor) / factor),
    });
  }, [from, to, duration, ease, delay, decimals]);

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
