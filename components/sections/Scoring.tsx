'use client';

import { motion, MotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { brand, scoring } from '@/content/site';
import CountUp from '@/components/ui/CountUp';
import DustIcon from '@/components/ui/DustIcon';
import styles from './Scoring.module.css';

const colors = ['var(--accent)', 'var(--white)', '#c4b5ff', 'var(--grey)'];
const glows = ['rgba(104, 65, 230,0.55)', 'rgba(245,244,250,0.4)', 'rgba(196,181,255,0.45)', 'rgba(154,152,168,0.35)'];
const GAP = 0.012; // share of the circle left empty between segments

// One ring cut into four segments, one per criterion, sized by weight.
function Segment({ i, start, share, progress }: { i: number; start: number; share: number; progress: MotionValue<number> }) {
  // Segments draw in one after another as the section scrolls into place.
  const from = start * 0.85;
  const to = from + share * 0.85 + 0.05;
  const length = useTransform(progress, [from, to], [0, share - GAP]);
  return (
    <motion.circle
      cx="170"
      cy="170"
      r="150"
      stroke={colors[i]}
      className={styles.arc}
      style={{ pathLength: length, rotate: start * 360 - 90, filter: `drop-shadow(0 0 6px ${glows[i]})` }}
    />
  );
}

// The badge forms with scroll: the score ring draws in, the lettered ring fades up and turns,
// and star dust gathers into the icon. Fully formed, the dust reacts to the pointer.
export default function Scoring() {
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start end', 'center center'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const ringOpacity = useTransform(progress, [0.25, 0.7], [0, 1]);
  const ringScale = useTransform(progress, [0.25, 0.8], [1.35, 1]);

  let acc = 0;
  const segments = scoring.criteria.map((c) => {
    const start = acc;
    acc += c.weight / 100;
    return { start, share: c.weight / 100 };
  });

  return (
    <section id="scoring" className={`${styles.scoring} snap-screen`}>
      <div className={`container ${styles.inner}`}>
        <div ref={stage} className={styles.rings}>
          <svg viewBox="0 0 340 340" aria-hidden>
            <circle cx="170" cy="170" r="150" className={styles.track} />
            {segments.map((s, i) => (
              <Segment key={i} i={i} start={s.start} share={s.share} progress={progress} />
            ))}
          </svg>
          <motion.div className={styles.badge} style={{ opacity: ringOpacity, scale: ringScale }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.ring} alt="" className={styles.ring} />
          </motion.div>
          <div className={styles.badge}>
            <DustIcon src={brand.icon} progress={progress} className={styles.icon} />
          </div>
          <span className="sr-only">ACKATHON 2026</span>
        </div>

        <div className={styles.copy}>
          <h2 className="display">{scoring.heading}</h2>
          <ul className={styles.list}>
            {scoring.criteria.map((c, i) => (
              <li key={c.name}>
                <span className={styles.num} style={{ color: colors[i] }}>
                  <CountUp to={c.weight} delay={0.15 * i} />
                  <small>%</small>
                </span>
                <span className={styles.name}>{c.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
