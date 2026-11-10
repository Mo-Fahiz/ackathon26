'use client';

import { motion, MotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { eyebrows, timeline } from '@/content/site';
import MorphStar from '@/components/ui/MorphStar';
import styles from './Descent.module.css';

type Chapter = (typeof timeline.chapters)[number];
const N = timeline.chapters.length;

// Where a card sits relative to the one in focus (d = its index minus the scroll position).
// Cards ahead wait below in a loose column; cards already passed tuck in behind, stacked and fading.
const AHEAD = 34; // vh between upcoming cards
const BEHIND = 7; // vh each passed card peeks above the current one

function Card({ c, i, pos, active }: { c: Chapter; i: number; pos: MotionValue<number>; active: boolean }) {
  const y = useTransform(pos, (p) => {
    const d = i - p;
    return `${d > 0 ? d * AHEAD : d * BEHIND}vh`;
  });
  const scale = useTransform(pos, (p) => {
    const d = i - p;
    return d > 0 ? 1 - 0.08 * Math.min(d, 2) : Math.max(0.82, 1 + 0.07 * d);
  });
  const opacity = useTransform(pos, (p) => {
    const d = i - p;
    if (d > 0) return d < 1 ? 1 - 0.6 * d : Math.max(0, 0.4 - (d - 1) * 0.4);
    return d >= -1 ? 1 + 0.6 * d : Math.max(0, 0.4 + (d + 1) * 0.4);
  });
  // A passed card's words leave quickly, so only its date tile peeks out of the stack.
  const textOpacity = useTransform(pos, (p) => {
    const d = i - p;
    return d >= 0 ? 1 : Math.max(0, 1 + d * 3);
  });
  const zIndex = useTransform(pos, (p) => 20 - Math.round(Math.abs(i - p) * 2));
  const finale = 'finale' in c && c.finale;

  return (
    <motion.li
      className={[styles.card, active ? styles.active : '', finale ? styles.finale : ''].join(' ')}
      style={{ y, scale, opacity, zIndex }}
      aria-current={active ? 'step' : undefined}
    >
      <div className={styles.date}>
        {'day' in c && <span className={`${styles.day} ${c.day.length > 3 ? styles.dayRange : ''}`}>{c.day}</span>}
        <span className={styles.num}>{c.num}</span>
        <span className={styles.month}>{c.month}</span>
      </div>
      <motion.div className={styles.text} style={{ opacity: textOpacity }}>
        <h3>{c.title}</h3>
        <p>{c.line}</p>
        {'rows' in c && c.rows && (
          <ul className={styles.rows}>
            {c.rows.map((r) => (
              <li key={r.label}>
                <span className={styles.rowDate}>{r.date}</span> {r.label}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.li>
  );
}

// The timeline: five date cards stacking as you scroll, beside one star that gains a point per
// stage (3 → 7) and lights up on the finale.
export default function Descent() {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  // A short hold at both ends so the first and last cards get a moment on their own.
  const pos = useTransform(scrollYProgress, [0.06, 0.94], [0, N - 1], { clamp: true });
  const [active, setActive] = useState(0);
  useMotionValueEvent(pos, 'change', (p) => setActive(Math.round(p)));

  return (
    <section id="descent" ref={section} className={styles.descent} style={{ height: `${N * 90}vh` }}>
      <div className={styles.sticky}>
        <div className={styles.veil} aria-hidden />
        <header className={`container ${styles.head}`}>
          <span className="eyebrow">{eyebrows.timeline}</span>
          <h2 className={styles.kicker}>{timeline.heading}</h2>
        </header>

        <div className={`container ${styles.stage}`}>
          <ol className={styles.cards}>
            {timeline.chapters.map((c, i) => (
              <Card key={c.title} c={c} i={i} pos={pos} active={i === active} />
            ))}
          </ol>
          <div className={styles.star}>
            <MorphStar progress={pos} stages={N} />
          </div>
        </div>
      </div>
    </section>
  );
}
