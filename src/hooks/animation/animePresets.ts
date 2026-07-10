import { stagger } from "animejs";

export const presets = {
  fadeUp: {
    opacity: [0, 1],
    y: [30, 0],
    duration: 500,
    ease: "outExpo" as const,
  },

  fadeLeft: {
    opacity: [0, 1],
    x: [-20, 0],
    duration: 400,
    ease: "outQuad" as const,
  },

  scaleIn: {
    scale: [0, 1],
    opacity: [0, 1],
    duration: 500,
    ease: "outBack" as const,
  },

  staggerFadeUp: (delay = 80) => ({
    opacity: [0, 1],
    y: [30, 0],
    duration: 500,
    ease: "outExpo" as const,
    delay: stagger(delay),
  }),

  staggerFadeLeft: (delay = 60) => ({
    opacity: [0, 1],
    x: [-15, 0],
    duration: 400,
    ease: "outQuad" as const,
    delay: stagger(delay),
  }),

  staggerScaleIn: (delay = 80) => ({
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 500,
    ease: "outBack" as const,
    delay: stagger(delay),
  }),

  bounceIn: {
    scale: [0, 1],
    opacity: [0, 1],
    duration: 600,
    ease: "outBack" as const,
  },
};
