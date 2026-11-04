'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '@/lib/motion';

// Desktop-only follower dot.
export default function Cursor() {
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });
  

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
        zIndex: 100,
        pointerEvents: 'none',
        borderRadius: '50%',
        width: 10,
        height: 10,
        background: '#f5f4fa',
        opacity: 0.8,
      }}
    />
  );
}
