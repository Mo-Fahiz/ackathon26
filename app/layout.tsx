import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, JetBrains_Mono } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'ACKATHON 2026 · Imagination is the only limit',
  description:
    'Ackathon and Acknovation are one event this year. Pick a real problem, build the answer in five days, and pitch it to the people who can make it real. 4–9 Dec, ACKO Tech building, HSR, Bengaluru.',
  icons: { icon: '/brand/Logo/Badge/primaryBadge.svg' },
  openGraph: {
    title: 'ACKATHON 2026',
    description: 'Imagination is the only limit. 4–9 Dec · ACKO Tech building, HSR, Bengaluru.',
    type: 'website',
    images: ['/media/og.jpg'],
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
