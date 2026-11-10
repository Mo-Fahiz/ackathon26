'use client';

import { motion } from 'framer-motion';
import { brand, eyebrows, prizes } from '@/content/site';
import { ease } from '@/lib/motion';
import CountUp from '@/components/ui/CountUp';
import styles from './Prizes.module.css';

const inView = { once: true, margin: '-10% 0px' } as const;

// What you win: three cash tiers, then the two things money can't buy, a path to production and the kit.
export default function Prizes() {
  return (
    <section id="prizes" className={`${styles.prizes} snap-screen`}>
      <div className="container">
        <motion.header
          className={styles.head}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.9, ease }}
        >
          <span className="eyebrow">{eyebrows.prizes}</span>
          <h2 className="display">{prizes.heading}</h2>
        </motion.header>

        <ol className={styles.tiers}>
          {prizes.tiers.map((t, i) => (
            <motion.li
              key={t.place}
              className={`${styles.tier} ${i === 0 ? styles.winner : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.12 }}
            >
              {i === 0 && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.ring} alt="" aria-hidden className={styles.ring} width={240} height={240} />
              )}
              <span className={styles.place}>{t.place}</span>
              <span className={styles.amount}>
                ₹<CountUp to={t.amount} decimals={1} delay={0.2 + i * 0.12} />L
              </span>
              <span className={styles.note}>{t.note}</span>
            </motion.li>
          ))}
        </ol>

        <div className={styles.extras}>
          <motion.div
            className={`${styles.extra} ${styles.ackelerator}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
          >
            <h3>{prizes.ackelerator.title}</h3>
            <p>{prizes.ackelerator.line}</p>
          </motion.div>
          <motion.div
            className={styles.extra}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.9, ease, delay: 0.32 }}
          >
            <h3>{prizes.kit.title}</h3>
            <p>{prizes.kit.line}</p>
          </motion.div>
        </div>

        <p className={styles.footnote}>{prizes.note}</p>
      </div>
    </section>
  );
}
