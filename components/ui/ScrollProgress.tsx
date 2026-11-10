'use client';

import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useState } from 'react';
import styles from './ScrollProgress.module.css';

// A thin vertical track on the right edge that fills as you read. Appears once the hero is behind you.
export default function ScrollProgress() {
  const { scrollY, scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [shown, setShown] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setShown(v > window.innerHeight * 0.6));

  return (
    <div className={`${styles.track} ${shown ? styles.shown : ''}`} aria-hidden>
      <motion.div className={styles.fill} style={{ scaleY: fill }} />
    </div>
  );
}
