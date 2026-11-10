'use client';

import { motion } from 'framer-motion';
import { eyebrows, links, onePager } from '@/content/site';
import { ease } from '@/lib/motion';
import styles from './OnePager.module.css';

const inView = { once: true, margin: '-12% 0px' } as const;

// How you register: one page. Just the ask and the template to write it in.
export default function OnePager() {
  const { file } = onePager;

  return (
    <section id="one-pager" className={`${styles.op} snap-screen`}>
      <div className={`container ${styles.inner}`}>
        <motion.div
          className={styles.copy}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.9, ease }}
        >
          <span className="eyebrow">{eyebrows.onePager}</span>
          <h2 className="display">{onePager.heading}</h2>
          <p className="muted">{onePager.line}</p>
        </motion.div>

        <motion.a
          href={links.template}
          download
          className={styles.file}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 1, ease, delay: 0.15 }}
        >
          <span className={styles.thumb}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={file.thumb} alt="Preview of the one-pager template" width={900} height={632} />
          </span>
          <span className={styles.fileText}>
            <strong>{file.name}</strong>
            <span className="mono">{file.meta}</span>
            <span className={`btn btn-secondary ${styles.fileBtn}`}>
              {file.cta} <span className="btn-arrow" aria-hidden>↓</span>
            </span>
          </span>
        </motion.a>
      </div>
    </section>
  );
}
