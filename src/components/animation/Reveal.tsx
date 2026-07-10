// src/components/animation/Reveal.tsx
import { useRef, useEffect, type ReactNode } from "react";
import { animate } from "animejs";

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  duration?: number;
  ease?: string;
}

export default function Reveal({
  children,
  className = "",
  direction = "up",
  duration = 500,
  ease = "outQuad",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(function revealOnScroll() {
    const el = ref.current;
    if (!el) return;

    const translateY = direction === "up" ? [40, 0] : [0, 0];
    const translateX =
      direction === "left" ? [-60, 0] : direction === "right" ? [60, 0] : [0, 0];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animate(el, {
            opacity: [0, 1],
            translateY,
            translateX,
            duration,
            ease,
          });
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return function disconnectReveal() {
      observer.disconnect();
    };
  }, [direction, duration, ease]);

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}
