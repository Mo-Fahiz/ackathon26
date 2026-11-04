'use client';

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { links, onePager } from '@/content/site';
import { ease, useFinePointer } from '@/lib/motion';
import styles from './OnePager.module.css';

// One page, floating in the dark.
export default function OnePager() {
  const ref = useRef<HTMLElement>(null);
  const [flavour, setFlavour] = useState(0);
  const fine = useFinePointer();
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const rotY = useTransform(mx, (v) => v * 8);
  const rotX = useTransform(my, (v) => v * -6);

  const onMove = (e: React.PointerEvent) => {
    if (!fine) return;
    mx.set((e.clientX / window.innerWidth) * 2 - 1);
    my.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  const f = onePager.flavours[flavour];

  return (
    <section id="one-pager" ref={ref} className={`${styles.op} snap-screen`} onPointerMove={onMove}>
      <div className={`container ${styles.inner}`}>
        <motion.div
          className={styles.copy}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease }}
        >
          <h2 className="display">{onePager.heading}</h2>
          <p className="muted">{onePager.line}</p>
        </motion.div>

        <motion.div
          className={styles.page}
          style={{ rotateX: rotX, rotateY: rotY }}
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 1.1, ease, delay: 0.15 }}
        >
          <ol className={styles.parts}>
            {onePager.parts.map((p, i) => (
              <li key={p}>
                <span className="mono">0{i + 1}</span>
                {p}
              </li>
            ))}
          </ol>

          <div className={styles.flavours} role="radiogroup" aria-label="Flavour">
            {onePager.flavours.map((x, i) => (
              <button
                key={x.id}
                role="radio"
                aria-checked={flavour === i}
                className={flavour === i ? styles.on : undefined}
                onClick={() => setFlavour(i)}
              >
                {flavour === i && <motion.span layoutId="flavour" className={styles.pill} transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className={styles.name}>{x.name}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={f.id}
              className={styles.flavourLine}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
            >
              {f.line}
            </motion.p>
          </AnimatePresence>

          <a href={links.template} className={styles.template}>
            {onePager.template} <span aria-hidden>↗</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
