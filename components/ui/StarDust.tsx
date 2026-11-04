'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

type Fleck = { x: number; y: number; z: number; r: number; vx: number; vy: number; tw: number };

// Fine dust drifting over the whole page in three depths; nearer flecks move more with scroll.
export default function StarDust() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    let w = 0;
    let h = 0;
    let raf = 0;
    let flecks: Fleck[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 9000);
      flecks = Array.from({ length: n }, () => {
        const z = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.35 + z * z * 1.1,
          vx: (Math.random() - 0.5) * 0.06 * (0.3 + z),
          vy: (Math.random() - 0.5) * 0.06 * (0.3 + z),
          tw: Math.random() * Math.PI * 2,
        };
      });
    };
    resize();
    window.addEventListener('resize', resize);

    let lastY = window.scrollY;
    let t = 0;
    const tick = () => {
      t += 1 / 60;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      ctx.clearRect(0, 0, w, h);
      for (const f of flecks) {
        f.x += f.vx;
        f.y += f.vy - dy * (0.04 + f.z * 0.22);
        if (f.y < -4) f.y += h + 8;
        if (f.y > h + 4) f.y -= h + 8;
        if (f.x < -4) f.x += w + 8;
        if (f.x > w + 4) f.x -= w + 8;
        const a = (0.18 + f.z * 0.55) * (0.7 + 0.3 * Math.sin(t * (0.6 + f.z) + f.tw));
        ctx.globalAlpha = a;
        ctx.fillStyle = '#e9e7f2';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}
    />
  );
}
