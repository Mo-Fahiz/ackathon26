'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { crew, eyebrows, links } from '@/content/site';
import styles from './Horizon.module.css';

const REVEAL_RADIUS = 280; // px, radius of the cursor's light

// Past the horizon: nothing but black, a line about who gets to build now, and the crew behind it.
// The team photo sits at 10% visibility; the cursor carries a soft light that reveals it at 80%.
export default function Horizon() {
  const ref = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // The scene keeps zooming in underneath while this veil slowly takes it to black.
  const veil = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.5, 0.68], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.5, 0.68], [24, 0]);

  // Ease the light toward the pointer so it trails like it has a little mass.
  useEffect(() => {
    const sticky = stickyRef.current;
    const reveal = revealRef.current;
    if (!sticky || !reveal) return;
    const target = { x: 0.5, y: 0.5, r: 0 };
    const cur = { x: 0.5, y: 0.5, r: 0 };
    let raf = 0;
    let running = false;

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.12;
      cur.y += (target.y - cur.y) * 0.12;
      cur.r += (target.r - cur.r) * 0.1;
      reveal.style.setProperty('--x', `${cur.x * 100}%`);
      reveal.style.setProperty('--y', `${cur.y * 100}%`);
      reveal.style.setProperty('--r', `${cur.r.toFixed(1)}px`);
      const settled = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) < 0.0005 && Math.abs(target.r - cur.r) < 0.5;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      const b = sticky.getBoundingClientRect();
      target.x = (e.clientX - b.left) / b.width;
      target.y = (e.clientY - b.top) / b.height;
      target.r = REVEAL_RADIUS;
      kick();
    };
    const leave = () => {
      target.r = 0;
      kick();
    };
    sticky.addEventListener('pointermove', move);
    sticky.addEventListener('pointerleave', leave);
    sticky.addEventListener('pointercancel', leave);
    return () => {
      cancelAnimationFrame(raf);
      sticky.removeEventListener('pointermove', move);
      sticky.removeEventListener('pointerleave', leave);
      sticky.removeEventListener('pointercancel', leave);
    };
  }, []);

  return (
    <section id="horizon" ref={ref} className={styles.horizon}>
      <div className={styles.sticky} ref={stickyRef}>
        <motion.div className={styles.veil} style={{ opacity: veil }} aria-hidden />

        <motion.div className={styles.photo} style={{ opacity: textOpacity }} aria-hidden>
          <div className={styles.base} style={{ backgroundImage: `url("${crew.image}")` }} />
          <div ref={revealRef} className={styles.reveal} style={{ backgroundImage: `url("${crew.image}")` }} />
        </motion.div>

        <motion.div className={`container ${styles.inner}`} style={{ opacity: textOpacity, y: textY }}>
          <span className="eyebrow">{eyebrows.crew}</span>
          <figure className={styles.quote}>
            <blockquote>
              <p>“{crew.quote}”</p>
            </blockquote>
            <figcaption>
              <strong>{crew.quoteBy}</strong>
              <span>{crew.quoteWhere}</span>
            </figcaption>
          </figure>
          <div className={styles.newbie}>
            <div>
              <strong>{crew.newbie}</strong>
              <span>{crew.newbieLine}</span>
            </div>
            <a href={links.buildSessions} className="btn btn-secondary">
              {crew.newbieCta} <span className="btn-arrow" aria-hidden>→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
