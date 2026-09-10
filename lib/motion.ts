import type { TargetAndTransition, Variants } from "framer-motion";

/**
 * Sistema de movimiento centralizado.
 *
 * Dirección: elegante y discreta. Reveal suave hacia arriba (24px),
 * fades lentos y stagger corto. Nada vuela, nada rebota.
 *
 * Reduced motion: MotionConfig reducedMotion="user" envuelve la app
 * (components/motion/MotionProvider.tsx), por lo que Framer Motion
 * degrada a cambios de opacidad cuando el usuario pide menos movimiento.
 */

/** Curva expo-out: entrada rápida, asentamiento suave. */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Duraciones base en segundos. */
export const DURATION = {
  fast: 0.4,
  base: 0.7,
  slow: 1,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT_EXPO },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

/**
 * Devuelve una copia de las variantes con `delay` aplicado a `visible`.
 * Si delay es 0, devuelve la referencia original (sin objetos nuevos).
 */
export function withDelay(variants: Variants, delay = 0): Variants {
  if (!delay) return variants;
  const visible = variants.visible as TargetAndTransition;
  return {
    ...variants,
    visible: {
      ...visible,
      transition: { ...visible.transition, delay },
    },
  };
}
