"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollAnimateProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export const ScrollAnimate = ({ 
  children, 
  delay = 0, 
  className = "",
  direction = "up" 
}: ScrollAnimateProps) => {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for a premium, heavy easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};