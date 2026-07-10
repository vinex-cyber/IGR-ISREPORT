// src/components/animation/Reveal.tsx
import { useRef, useEffect, type ReactNode } from "react";
import { animate } from "animejs";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

export default function Reveal({ children, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(function revealOnScroll() {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animate(el, {
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 500,
            ease: "outQuad",
          });
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return function disconnectReveal() {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}
