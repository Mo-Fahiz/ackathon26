'use client';

import dynamic from 'next/dynamic';
import { cta, footer, links } from '@/content/site';
import CtaButton from '@/components/ui/CtaButton';
import Reveal from '@/components/ui/Reveal';
import styles from './Footer.module.css';

const Galaxy = dynamic(() => import('@/components/three/Galaxy'), { ssr: false });

// Out the other side: a whole galaxy, turning.
export default function Footer() {
  return (
    <footer id="footer" className={`${styles.footer} snap-screen`}>
      <Galaxy />
      <div className={`container ${styles.inner}`}>
        <Reveal as="h2" className="display">
          {footer.closing}
        </Reveal>
        <Reveal delay={0.15}>
          <CtaButton href={links.register}>{cta}</CtaButton>
        </Reveal>
        <div className={`${styles.small} caps`}>
          <span>{footer.place}</span>
          <a href={links.help}>{footer.help}</a>
        </div>
      </div>
    </footer>
  );
}
