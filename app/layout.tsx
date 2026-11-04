import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import { asset } from '@/lib/asset';
import SmoothScroll from '@/components/ui/SmoothScroll';
import './globals.css';

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  axes: ['wdth'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

// Social previews need an absolute URL; the workflow supplies the deployed origin.
const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN;

export const metadata: Metadata = {
  ...(origin ? { metadataBase: new URL(origin) } : {}),
  title: 'ACKATHON 2026 · Imagination is the only limit',
  description:
    'Ackathon and Acknovation are one event this year. Pick a real problem, build the answer in five days, and pitch it to the people who can make it real. 4–9 Dec, ACKO Tech building, HSR, Bengaluru.',
  icons: { icon: asset('/brand/Logo/Badge/primaryBadge.svg') },
  openGraph: {
    title: 'ACKATHON 2026',
    description: 'Imagination is the only limit. 4–9 Dec · ACKO Tech building, HSR, Bengaluru.',
    type: 'website',
    images: [asset('/media/og.jpg')],
  },
};

export const viewport: Viewport = {
  themeColor: '#030306',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
