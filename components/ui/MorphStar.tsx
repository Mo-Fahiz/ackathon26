'use client';

import { MotionValue, useMotionValueEvent } from 'framer-motion';
import { useEffect, useRef } from 'react';
import styles from './MorphStar.module.css';

const MIN = 3; // points on the first card
const R = 44; // outer radius in the 100×100 viewBox

// How deep the valleys are for each point count, matched to the hand-drawn star set
// (3 points is sharp and slim, 6–7 are fuller).
const INNER: Record<number, number> = { 3: 0.4, 4: 0.47, 5: 0.49, 6: 0.58, 7: 0.6, 8: 0.6 };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

// A star with `count` points, where a fractional count grows the next point smoothly:
// the new tip starts folded into a valley and rises while the others fan out to make room.
export function starPath(count: number): string {
  const n = Math.floor(count);
  const t = count - n;
  const tips: { a: number; r: number }[] = [];
  const total = t > 0 ? n + 1 : n;
  for (let i = 0; i < total; i++) {
    const from = i < n ? (i * 2 * Math.PI) / n : 2 * Math.PI; // the new tip waits at the end of the circle
    const to = (i * 2 * Math.PI) / (n + 1);
    tips.push({ a: t > 0 ? lerp(from, to, t) : from, r: i < n ? R : lerp(R * INNER[n], R, t) });
  }
  const inner = R * lerp(INNER[n] ?? 0.6, INNER[n + 1] ?? 0.6, t);
  const pts: string[] = [];
  const off = -Math.PI / 2; // first tip points straight up
  tips.forEach((tip, i) => {
    const next = tips[(i + 1) % tips.length];
    const nextA = i === tips.length - 1 ? next.a + 2 * Math.PI : next.a;
    const mid = (tip.a + nextA) / 2;
    pts.push(`${(50 + Math.cos(tip.a + off) * tip.r).toFixed(2)} ${(50 + Math.sin(tip.a + off) * tip.r).toFixed(2)}`);
    pts.push(`${(50 + Math.cos(mid + off) * inner).toFixed(2)} ${(50 + Math.sin(mid + off) * inner).toFixed(2)}`);
  });
  return `M ${pts.join(' L ')} Z`;
}

// The timeline's star: one star that gains a point per stage. `progress` runs 0 → stages - 1;
// each new point grows in the middle of the scroll between two cards, so it rests whole on each card.
export default function MorphStar({ progress, stages }: { progress: MotionValue<number>; stages: number }) {
  const shape = useRef<SVGPathElement>(null);
  const glow = useRef<SVGPathElement>(null);
  const lit = useRef<SVGPathElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  const draw = (p: number) => {
    const base = Math.floor(p);
    const f = p - base;
    const grow = smooth(Math.min(1, Math.max(0, (f - 0.3) / 0.4)));
    const d = starPath(MIN + Math.min(stages - 1, base) + (base >= stages - 1 ? 0 : grow));
    shape.current?.setAttribute('d', d);
    glow.current?.setAttribute('d', d);
    lit.current?.setAttribute('d', d);
    // The finale star lights up as the last card arrives.
    const on = Math.min(1, Math.max(0, p - (stages - 2) - 0.3) / 0.7);
    wrap.current?.style.setProperty('--lit', on.toFixed(3));
  };

  useEffect(() => draw(progress.get()), []); // eslint-disable-line react-hooks/exhaustive-deps
  useMotionValueEvent(progress, 'change', draw);

  return (
    <div ref={wrap} className={styles.wrap} aria-hidden>
      <svg viewBox="0 0 100 100" className={styles.svg}>
        <defs>
          <linearGradient id="star-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#675377" />
            <stop offset="1" stopColor="#16121F" />
          </linearGradient>
          <linearGradient id="star-edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C3B9F8" />
            <stop offset="1" stopColor="#4D4D4D" />
          </linearGradient>
          <linearGradient id="star-lit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B49BFF" />
            <stop offset="1" stopColor="#3A1E8C" />
          </linearGradient>
          <filter id="star-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <path ref={glow} className={styles.glow} fill="#F45CFF" filter="url(#star-blur)" />
        <path ref={shape} fill="url(#star-fill)" stroke="url(#star-edge)" strokeWidth="0.9" strokeLinejoin="round" />
        <path ref={lit} className={styles.lit} fill="url(#star-lit)" stroke="#E9E2FF" strokeWidth="0.9" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
