'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cta, hero, links } from '@/content/site';
import { ease } from '@/lib/motion';
import CtaButton from '@/components/ui/CtaButton';
import Countdown from '@/components/ui/Countdown';
import styles from './Hero.module.css';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section id="top" ref={ref} className={styles.hero}>
      <motion.div className={`container ${styles.inner}`} style={{ opacity, y }}>
        <motion.h1
          className="display"
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease, delay: 0.4 }}
        >
          {hero.tagline}
        </motion.h1>
        <motion.div
          className={styles.when}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.9 }}
        >
          <p className={styles.dates}>{hero.dates}</p>
          <p className={`${styles.meta} caps`}>{hero.meta}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 1.2 }}>
          <CtaButton href={links.register}>{cta}</CtaButton>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.6 }}>
          <Countdown showLabel={false} />
        </motion.div>
      </motion.div>
    </section>
  );
}
