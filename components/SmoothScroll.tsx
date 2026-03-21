"use client";

import { ReactLenis } from 'lenis/react';

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  return (
    // lerp controls the friction. 0.05 is heavy and premium.
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
};