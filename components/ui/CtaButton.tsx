'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type Spark = { id: number; x: number; dx: number; up: boolean; dur: number; size: number };

type Props = {
  href: string;
  children: React.ReactNode;
  arrow?: boolean;
  className?: string;
};

// White CTA. On hover it picks up the brand purple: a soft glow and a few faint sparks, like matter near the horizon.
export default function CtaButton({ href, children, arrow = true, className = '' }: Props) {
  const reduced = useReducedMotion();
  const [sparks, setSparks] = useState<Spark[]>([]);
  const timer = useRef<number | null>(null);
  const seq = useRef(0);

  const stop = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
  };

  const start = () => {
    if (reduced || timer.current !== null) return;
    const emit = () =>
      setSparks((s) => [
        ...s.slice(-10),
        {
          id: seq.current++,
          x: 8 + Math.random() * 84,
          dx: (Math.random() - 0.5) * 16,
          up: Math.random() > 0.3,
          dur: 0.9 + Math.random() * 0.8,
          size: 1.5 + Math.random() * 1.5,
        },
      ]);
    emit();
    timer.current = window.setInterval(emit, 160);
  };

  useEffect(() => stop, []);

  return (
    <a
      href={href}
      className={`btn btn-primary ${className}`}
      onPointerEnter={start}
      onPointerLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
      <span className="btn-sparks" aria-hidden>
        {sparks.map((p) => (
          <i
            key={p.id}
            className={p.up ? 'up' : 'down'}
            style={
              {
                left: `${p.x}%`,
                width: p.size,
                height: p.size,
                animationDuration: `${p.dur}s`,
                '--dx': `${p.dx}px`,
              } as React.CSSProperties
            }
            onAnimationEnd={() => setSparks((s) => s.filter((x) => x.id !== p.id))}
          />
        ))}
      </span>
      <span className="btn-label">{children}</span>
      {arrow && (
        <span className="btn-arrow" aria-hidden>
          →
        </span>
      )}
    </a>
  );
}
