'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { brand, cta, links } from '@/content/site';
import CtaButton from './CtaButton';
import styles from './Nav.module.css';

// Fixed header with the one CTA, plus a sticky bottom bar on phones once the hero is passed.
export default function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useMotionValueEvent(scrollY, 'change', (v) => {
    setSolid(v > 40);
    setPastHero(v > window.innerHeight * 0.8);
  });

  return (
    <>
      <header className={`${styles.nav} ${solid ? styles.solid : ''}`}>
        <a href="#top" className={styles.brand} aria-label="ACKATHON 2026, back to top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={brand.header} alt="ACKATHON" width={150} height={29} />
        </a>
        <CtaButton href={links.register} arrow={false} className={`${styles.cta} ${pastHero ? styles.ctaDocked : ''}`}>
          {cta}
        </CtaButton>
      </header>

      <AnimatePresence>
        {pastHero && (
          <motion.div
            className={styles.bar}
            initial={{ y: '120%' }}
            animate={{ y: 0 }}
            exit={{ y: '120%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <CtaButton href={links.register}>{cta}</CtaButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
