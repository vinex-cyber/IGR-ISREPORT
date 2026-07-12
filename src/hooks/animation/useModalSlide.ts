// src/hooks/animation/useModalSlide.ts
import { useRef, useEffect, useState, useCallback } from "react";
import { animate } from "animejs";

type CloseAnimation = "shatter" | "spin" | "bounce" | "dissolve" | "flyRight";

interface UseModalSlideOptions {
  isOpen: boolean;
  direction?: "right" | "left" | "bottom";
  openDuration?: number;
  closeDuration?: number;
  closeAnimation?: CloseAnimation;
}

const CLOSE_ANIMATIONS: Record<
  CloseAnimation,
  { properties: Record<string, unknown>; ease: string }
> = {
  shatter: {
    properties: {
      scale: [1, 0.3],
      rotate: [0, 15],
      opacity: [1, 0],
    },
    ease: "inBack",
  },
  spin: {
    properties: {
      rotate: [0, 360],
      scale: [1, 0],
      opacity: [1, 0],
    },
    ease: "inQuad",
  },
  bounce: {
    properties: {
      translateY: [0, -100],
      scale: [1, 0.5],
      opacity: [1, 0],
    },
    ease: "inBack",
  },
  dissolve: {
    properties: {
      scale: [1, 1.1],
      opacity: [1, 0],
      filter: ["blur(0px)", "blur(8px)"],
    },
    ease: "inQuad",
  },
  flyRight: {
    properties: {
      translateX: ["0%", "100%"],
      opacity: [1, 0],
    },
    ease: "inExpo",
  },
};

export function useModalSlide({
  isOpen,
  direction = "right",
  openDuration = 400,
  closeDuration = 300,
  closeAnimation = "shatter",
}: UseModalSlideOptions) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(
    function animateModalOpen() {
      if (!isOpen || !overlayRef.current || !contentRef.current) return;

      animate(overlayRef.current, {
        opacity: [0, 1],
        duration: 300,
        ease: "outQuad",
      });

      const translateMap = {
        right: ["100%", "0%"],
        left: ["-100%", "0%"],
        bottom: ["100%", "0%"],
      };

      const translateAxis = direction === "bottom" ? "translateY" : "translateX";

      animate(contentRef.current, {
        [translateAxis]: translateMap[direction],
        opacity: [0, 1],
        duration: openDuration,
        ease: "outExpo",
      });
    },
    [isOpen, direction, openDuration],
  );

  const handleClose = useCallback(
    (onClose: () => void) => {
      if (!overlayRef.current || !contentRef.current) {
        onClose();
        return;
      }

      setIsClosing(true);

      animate(overlayRef.current, {
        opacity: [1, 0],
        duration: closeDuration,
        ease: "inQuad",
      });

      const anim = CLOSE_ANIMATIONS[closeAnimation];

      animate(contentRef.current, {
        ...anim.properties,
        duration: closeDuration,
        ease: anim.ease,
        onComplete: () => {
          setIsClosing(false);
          onClose();
        },
      });
    },
    [closeDuration, closeAnimation],
  );

  return { overlayRef, contentRef, isClosing, handleClose };
}
