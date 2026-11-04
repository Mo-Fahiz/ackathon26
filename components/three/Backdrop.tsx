'use client';

import dynamic from 'next/dynamic';
import { useCalmMode, useWebGL } from '@/lib/motion';

const Universe = dynamic(() => import('./Universe'), { ssr: false });

// Live black hole when the device can take it; otherwise a still poster.
export default function Backdrop() {
  const calm = useCalmMode();
  const webgl = useWebGL();
  if (webgl === null) return null;
  if (webgl && !calm) return <Universe />;
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <picture>
        <source media="(max-width: 760px)" srcSet="/media/blackhole-tall.jpg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/blackhole-wide.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </picture>
    </div>
  );
}
