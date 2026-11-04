'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { crew, links } from '@/content/site';
import styles from './Horizon.module.css';

// Past the horizon: nothing but black, and the first words on the other side.
export default function Horizon() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // The scene keeps zooming in underneath while this veil slowly takes it to black.
  const veil = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.5, 0.68], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.5, 0.68], [24, 0]);

  return (
    <section id="horizon" ref={ref} className={styles.horizon}>
      <div className={styles.sticky}>
        <motion.div className={styles.veil} style={{ opacity: veil }} aria-hidden />
        <motion.div className={`container ${styles.inner}`} style={{ opacity: textOpacity, y: textY }}>
          <h2 className="display">{crew.heading}</h2>
          <p className={styles.line}>{crew.line}</p>
          <a href={links.buildSessions} className={styles.link}>
            {crew.newbie} <span aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
