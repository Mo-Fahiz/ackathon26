'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

export default function CountUp({
  to,
  duration = 1.6,
  delay = 0,
  decimals = 0,
}: {
  to: number;
  duration?: number;
  delay?: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Number(v.toFixed(decimals))),
    });
    return () => controls.stop();
  }, [inView, to, duration, delay, decimals]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      <span aria-hidden>{val.toFixed(decimals).replace(/\.0+$/, '')}</span>
      <span className="sr-only">{to}</span>
    </span>
  );
}
