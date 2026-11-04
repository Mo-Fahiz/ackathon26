'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

// From the end of "Everyone's in" onward, the page moves one full screen at a time.
const SNAP_SECTIONS = ['one-pager', 'scoring', 'footer'];

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function snapPoints(): number[] {
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  const at = (el: Element | null, edge: 'top' | 'bottom') => (el ? el.getBoundingClientRect()[edge] + window.scrollY : null);
  // Entry point: the last frame of the pinned "Everyone's in" screen.
  const entry = at(document.getElementById('horizon'), 'bottom');
  const pts = [entry === null ? null : entry - vh, ...SNAP_SECTIONS.map((id) => at(document.getElementById(id), 'top'))];
  return pts.filter((p): p is number => p !== null).map((p) => Math.min(Math.round(p), max));
}

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animating = false;
    let gestureUsed = false; // one snap per wheel/trackpad gesture, including its inertia tail
    let lastWheel = 0;
    let settleTimer = 0;

    const lenis: Lenis = new Lenis({
      lerp: 0.1,
      anchors: true,
      virtualScroll: ({ deltaY, event }) => {
        if (!(event instanceof WheelEvent) || deltaY === 0) return true; // touch scrolls natively
        const now = performance.now();
        if (now - lastWheel > 220) gestureUsed = false;
        lastWheel = now;

        const pts = snapPoints();
        if (!pts.length) return true;
        const y = lenis.targetScroll;
        const first = pts[0];

        if (deltaY > 0) {
          if (y < first - 2) return true; // still in the scroll-driven story above
          if (animating || gestureUsed) return false;
          const next = pts.find((p) => p > y + 2);
          if (next !== undefined) go(next);
          return false;
        }
        if (y <= first + 2) return true; // heading back up into the story
        if (animating || gestureUsed) return false;
        go([...pts].reverse().find((p) => p < y - 2) ?? first);
        return false;
      },
    });
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    function go(target: number) {
      animating = true;
      gestureUsed = true;
      lenis.scrollTo(target, {
        duration: 1.1,
        easing: easeInOut,
        lock: true,
        onComplete: () => {
          animating = false;
        },
      });
    }

    // If scrolling comes to rest between two screens (keyboard, scrollbar, momentum), settle on the nearest.
    // Touch devices use native CSS scroll-snap instead (see globals.css).
    const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    lenis.on('scroll', () => {
      if (touch) return;
      window.clearTimeout(settleTimer);
      if (animating) return;
      settleTimer = window.setTimeout(() => {
        const pts = snapPoints();
        const y = lenis.scroll;
        if (!pts.length || y <= pts[0] + 2 || animating) return;
        const nearest = pts.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));
        if (Math.abs(nearest - y) > 2) go(nearest);
      }, 200);
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
      lenis.destroy();
    };
  }, []);
  return null;
}
