'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { orbits, week } from '@/content/site';
import { getBuildDay, useNow } from '@/lib/dates';
import { holeLift, stage } from '@/lib/universe';
import { ease } from '@/lib/motion';
import styles from './Descent.module.css';

type Link = { d: string; ax: number; ay: number };

const SLOTS = ['a', 'b', 'c', 'd', 'e']; // left pair, right pair, finale below the hole

// The gravity map: every stage sits in orbit around the hole and feeds a line of light into it.
// Scrolling lights the stages in order; the live one pulses into the core.
export default function Descent() {
  const section = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [focus, setFocus] = useState(0);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [links, setLinks] = useState<Link[]>([]);
  const now = useNow(60000);
  const today = now === null ? null : getBuildDay(now);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const f = Math.min(orbits.length - 1, Math.max(0, Math.floor(v * orbits.length)));
    stage.focus = f;
    setFocus(f);
  });

  useEffect(() => () => void (stage.focus = 0), []);

  // Draw each card's light line from its inner edge to the rim of the hole.
  useLayoutEffect(() => {
    const el = sticky.current;
    if (!el) return;
    const measureLinks = () => {
      const r = el.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      const cx = w / 2;
      const cy = h * (0.5 - holeLift(w < 760));
      const rim = Math.min(w, h) * 0.085;
      const next = cards.current.map((card, i) => {
        if (!card) return { d: '', ax: 0, ay: 0 };
        const c = card.getBoundingClientRect();
        const left = c.left - r.left;
        const top = c.top - r.top;
        const finale = i === 4;
        const ax = finale ? left + c.width / 2 : i < 2 ? left + c.width : left;
        const ay = finale ? top : top + c.height / 2;
        const ang = Math.atan2(ay - cy, ax - cx);
        const ex = cx + Math.cos(ang) * rim;
        const ey = cy + Math.sin(ang) * rim;
        const d = finale
          ? `M ${ax} ${ay} C ${ax} ${ay - (ay - ey) * 0.5}, ${ex} ${ey + (ay - ey) * 0.3}, ${ex} ${ey}`
          : `M ${ax} ${ay} C ${ax + (ex - ax) * 0.55} ${ay}, ${ax + (ex - ax) * 0.85} ${ey}, ${ex} ${ey}`;
        return { d, ax, ay };
      });
      setBox({ w, h });
      setLinks(next);
    };
    measureLinks();
    const ro = new ResizeObserver(measureLinks);
    ro.observe(el);
    cards.current.forEach((c) => c && ro.observe(c));
    return () => ro.disconnect();
  }, []);

  return (
    <section id="descent" ref={section} className={styles.descent}>
      <div ref={sticky} className={styles.sticky}>
        <h2 className={styles.kicker}>From problem to podium</h2>

        <svg className={styles.links} viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} aria-hidden>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {links.map((l, i) => {
            const lit = i <= focus;
            const live = i === focus;
            return (
              <g key={i}>
                <path d={l.d} className={styles.base} />
                {lit && (
                  <motion.path
                    d={l.d}
                    className={styles.lit}
                    filter="url(#glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: live ? 1 : 0.35 }}
                    transition={{ duration: 0.9, ease }}
                  />
                )}
                {live && <path d={l.d} className={styles.pulse} />}
                <circle cx={l.ax} cy={l.ay} r={live ? 4 : 3} className={lit ? styles.nodeLit : styles.node} />
              </g>
            );
          })}
        </svg>

        <ol className={styles.cards}>
          {orbits.map((x, i) => (
            <li
              key={x.title}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className={`${styles.card} ${styles[SLOTS[i]]} ${i === focus ? styles.live : i < focus ? styles.past : styles.future}`}
              aria-current={i === focus ? 'step' : undefined}
            >
              <span className={styles.date}>{x.date}</span>
              <h3 className={styles.title}>{x.title}</h3>
              <p className={styles.line}>{x.line}</p>
              {x.week && (
                <ol className={styles.week} aria-label="Build week">
                  {week.map((d) => (
                    <li key={d.day} className={`${d.day === 9 ? styles.finaleDay : ''} ${today === d.day ? styles.today : ''}`}>
                      <span className={styles.day}>{d.day}</span>
                      <span>{d.label}</span>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
