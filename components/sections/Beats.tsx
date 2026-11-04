'use client';

import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { beats } from '@/content/site';
import styles from './Beats.module.css';

function Beat({ text, i, n, progress }: { text: string; i: number; n: number; progress: MotionValue<number> }) {
  const a = i / n;
  const b = (i + 1) / n;
  const pad = 0.06;
  const last = i === n - 1;
  const opacity = useTransform(progress, [a, a + pad, b - pad, b], [0, 1, 1, last ? 1 : 0]);
  const scale = useTransform(progress, [a, b], [0.94, 1.04]);
  const blur = useTransform(progress, [a, a + pad, b - pad, b], ['blur(10px)', 'blur(0px)', 'blur(0px)', last ? 'blur(0px)' : 'blur(10px)']);
  return (
    <motion.p className={`display ${styles.beat}`} style={{ opacity, scale, filter: blur }}>
      {text}
    </motion.p>
  );
}

// Three lines, one at a time, while the camera starts to fall.
export default function Beats() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <section id="beats" ref={ref} className={styles.beats}>
      <div className={styles.sticky}>
        <div className={styles.scrim} aria-hidden />
        <h2 className="sr-only">{beats.join(' ')}</h2>
        {beats.map((t, i) => (
          <Beat key={t} text={t} i={i} n={beats.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
