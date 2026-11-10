'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { getCountdownTarget, useNow } from '@/lib/dates';
import styles from './Countdown.module.css';

function Digit({ d }: { d: string }) {
  return (
    <span className={styles.digit}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={d}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {d}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  const s = String(value).padStart(2, '0');
  return (
    <div className={styles.unit}>
      <div className={styles.digits}>
        {s.split('').map((d, i) => (
          <Digit key={i} d={d} />
        ))}
      </div>
      <span className={styles.unitLabel}>{label}</span>
    </div>
  );
}

export default function Countdown({ showLabel = true }: { showLabel?: boolean }) {
  const now = useNow();
  const target = now === null ? null : getCountdownTarget(now);
  if (now === null) return <div className={styles.wrap} aria-hidden style={{ visibility: 'hidden' }} />;
  if (!target) return null;

  const diff = Math.max(0, target.at - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return (
    <div className={styles.wrap} role="timer" aria-label={`${days} days, ${hours} hours to ${target.label}`}>
      {showLabel && (
        <span className={styles.label}>
          <span className={styles.pulse} aria-hidden /> {target.label}
        </span>
      )}
      <div className={styles.units} aria-hidden>
        <Unit value={days} label="days" />
        <span className={styles.sep}>:</span>
        <Unit value={hours} label="hrs" />
        <span className={styles.sep}>:</span>
        <Unit value={mins} label="min" />
        <span className={styles.sep}>:</span>
        <Unit value={secs} label="sec" />
      </div>
    </div>
  );
}
