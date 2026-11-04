'use client';

import { useEffect, useRef } from 'react';
import { MotionValue, useInView, useReducedMotion } from 'framer-motion';

type Grain = {
  sx: number; // scattered start
  sy: number;
  tx: number; // home in the icon
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  node: boolean; // one of the logo's coloured nodes
  s: number;
  delay: number;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Star dust that spirals in and settles into the shape of an SVG (the ACKATHON icon) as `progress`
// goes 0 → 1 with scroll. Once fully formed, grains scatter from the pointer and fall back into place.
export default function DustIcon({ src, progress, className }: { src: string; progress: MotionValue<number>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const inView = useInView(ref, { margin: '200px 0px' });
  const reduced = useReducedMotion();
  const inViewRef = useRef(false);
  inViewRef.current = inView;

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    let raf = 0;
    let grains: Grain[] = [];
    let size = 0;
    const pointer = { x: -9999, y: -9999 };
    let alive = true;

    const build = (img: HTMLImageElement) => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      size = c.clientWidth;
      c.width = size * dpr;
      c.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rasterise the icon into the middle ~62% of the canvas and read back its pixels.
      const off = document.createElement('canvas');
      off.width = off.height = Math.round(size);
      const o = off.getContext('2d')!;
      const box = size * 0.62;
      const ratio = img.naturalWidth / img.naturalHeight || 195 / 152;
      const w = ratio >= 1 ? box : box * ratio;
      const h = ratio >= 1 ? box / ratio : box;
      o.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const step = size > 260 ? 2.4 : 2;
      const pts: Grain[] = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          const i = (Math.floor(y) * off.width + Math.floor(x)) * 4;
          if (data[i + 3] < 120) continue;
          const node = data[i + 1] > data[i] * 1.3; // the icon's nodes are drawn in colour
          const a = Math.random() * Math.PI * 2;
          const r = size * (0.4 + Math.random() * 0.45);
          const sx = size / 2 + Math.cos(a) * r;
          const sy = size / 2 + Math.sin(a) * r;
          pts.push({
            sx,
            sy,
            tx: x + (Math.random() - 0.5),
            ty: y + (Math.random() - 0.5),
            x: sx,
            y: sy,
            vx: 0,
            vy: 0,
            node,
            s: node ? 2.2 : 0.8 + Math.random() * 0.7,
            delay: Math.random(),
          });
        }
      }
      grains = pts;
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const p = reduced ? 1 : Math.min(1, Math.max(0, progress.get()));
      const formed = p > 0.995;
      const cx = size / 2;
      const cy = size / 2;
      for (const g of grains) {
        if (!formed) {
          // Scroll-driven: each grain spirals from its scattered start to its home.
          const local = Math.min(1, Math.max(0, (p - g.delay * 0.35) / 0.65));
          const e = easeOut(local);
          const spin = (1 - e) * 1.4;
          const ox = g.sx - cx;
          const oy = g.sy - cy;
          const rx = cx + ox * Math.cos(spin) - oy * Math.sin(spin);
          const ry = cy + ox * Math.sin(spin) + oy * Math.cos(spin);
          g.x = rx + (g.tx - rx) * e;
          g.y = ry + (g.ty - ry) * e;
          g.vx = 0;
          g.vy = 0;
        } else {
          // Formed: spring home, pushed away near the pointer.
          const dx = g.x - pointer.x;
          const dy = g.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 900) {
            const f = (900 - d2) / 900;
            g.vx += (dx / Math.sqrt(d2 + 1)) * f * 1.4;
            g.vy += (dy / Math.sqrt(d2 + 1)) * f * 1.4;
          }
          g.vx += (g.tx - g.x) * 0.02;
          g.vy += (g.ty - g.y) * 0.02;
          g.vx *= 0.86;
          g.vy *= 0.86;
          g.x += g.vx;
          g.y += g.vy;
        }
        const settle = Math.max(0, 1 - Math.hypot(g.tx - g.x, g.ty - g.y) / 40);
        ctx.globalAlpha = (0.25 + 0.75 * settle) * Math.min(1, p * 3 + 0.15);
        ctx.fillStyle = g.node ? '#8f6ff2' : '#f5f4fa';
        ctx.shadowBlur = g.node ? 6 : 0;
        ctx.shadowColor = '#8f6ff2';
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.s * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (!alive) return;
      if (inViewRef.current) draw();
      raf = requestAnimationFrame(loop);
    };

    const img = new Image();
    img.onload = () => {
      if (!alive) return;
      build(img);
      draw();
      raf = requestAnimationFrame(loop);
    };
    img.src = src;

    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * size;
      pointer.y = ((e.clientY - r.top) / r.height) * size;
    };
    const leave = () => {
      pointer.x = pointer.y = -9999;
    };
    c.addEventListener('pointermove', move);
    c.addEventListener('pointerleave', leave);
    const onResize = () => img.complete && build(img);
    window.addEventListener('resize', onResize);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      c.removeEventListener('pointermove', move);
      c.removeEventListener('pointerleave', leave);
      window.removeEventListener('resize', onResize);
    };
  }, [src, reduced, progress]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
