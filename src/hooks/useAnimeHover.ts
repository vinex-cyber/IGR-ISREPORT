import { useEffect } from "react";
import { animate } from "animejs";

interface HoverOptions {
  scale?: number;
  duration?: number;
  ease?: string;
}

export function useAnimeHover(
  selector: string,
  opts: HoverOptions = {},
) {
  const { scale = 1.06, duration = 200, ease = "outQuad" } = opts;

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(selector);
    if (!els.length) return;

    const onEnter = (e: Event) => {
      animate(e.currentTarget as HTMLElement, { scale, duration, ease });
    };
    const onLeave = (e: Event) => {
      animate(e.currentTarget as HTMLElement, { scale: 1, duration, ease });
    };

    els.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [selector, scale, duration, ease]);
}
