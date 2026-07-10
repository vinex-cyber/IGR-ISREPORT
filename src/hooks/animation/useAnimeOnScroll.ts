import { useEffect, useRef } from "react";
import { animate, stagger, type AnimationParams } from "animejs";

type Target = string | HTMLElement | NodeListOf<HTMLElement>;

interface ScrollAnimOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  staggerDelay?: number;
  childSelector?: string;
}

export function useAnimeOnScroll(
  target: Target,
  params: AnimationParams,
  opts: ScrollAnimOptions = {},
) {
  const triggered = useRef(new Set<HTMLElement>());

  useEffect(function observeViewport() {
    const els =
      typeof target === "string"
        ? document.querySelectorAll<HTMLElement>(target)
        : target instanceof HTMLElement
          ? [target]
          : target;

    if (!els.length) return;

    const {
      threshold = 0.2,
      rootMargin = "0px",
      triggerOnce = true,
      staggerDelay,
      childSelector = ".anim-item",
    } = opts;

    const animParams = staggerDelay
      ? { ...params, delay: stagger(staggerDelay) }
      : params;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;

          if (triggerOnce && triggered.current.has(el)) return;
          triggered.current.add(el);

          const targets =
            el.querySelectorAll<HTMLElement>(childSelector);
          if (!targets.length) return;

          animate(targets, animParams);

          if (triggerOnce) observer.unobserve(el);
        });
      },
      { threshold, rootMargin },
    );

    els.forEach((el) => observer.observe(el));
    return function disconnectObserver() { observer.disconnect(); };
  }, [target, params, opts.threshold, opts.rootMargin, opts.triggerOnce, opts.staggerDelay]);
}
