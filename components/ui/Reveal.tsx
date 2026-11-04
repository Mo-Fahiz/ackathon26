'use client';

import { motion } from 'framer-motion';
import { ease } from '@/lib/motion';

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'p' | 'h2' | 'span' | 'li';
};

export default function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: Props) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Tag>
  );
}
