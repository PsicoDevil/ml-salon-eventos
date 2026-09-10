"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeIn, fadeUp, withDelay } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Retardo en segundos (para entradas escalonadas). */
  delay?: number;
  variant?: "fade-up" | "fade-in";
};

/**
 * Reveal único del sistema: entra una sola vez al entrar en viewport.
 * MotionConfig (reducedMotion="user") degrada a fade en reduced motion.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  variant = "fade-up",
}: RevealProps) {
  const base = variant === "fade-in" ? fadeIn : fadeUp;

  return (
    <motion.div
      className={className}
      variants={withDelay(base, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
    >
      {children}
    </motion.div>
  );
}
