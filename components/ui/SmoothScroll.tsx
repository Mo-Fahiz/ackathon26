'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

// Smooth, free scrolling for the whole page. No snapping or scroll lock: the full-screen
// sections after "Everyone's in" are sized to the viewport, but the reader scrolls freely.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
