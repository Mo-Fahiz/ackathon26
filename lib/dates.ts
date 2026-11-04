'use client';

import { useEffect, useState } from 'react';
import { dates } from '@/content/site';

const t = (iso: string) => new Date(iso).getTime();

// ?now=2026-11-20 (or a full ISO string) pins the clock for QA.
function readNowOverride(): number | null {
  if (typeof window === 'undefined') return null;
  const raw = new URLSearchParams(window.location.search).get('now');
  if (!raw) return null;
  const parsed = new Date(raw.length === 10 ? `${raw}T12:00:00+05:30` : raw).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

export function getCountdownTarget(now: number): { label: string; at: number } | null {
  if (now < t(dates.ideaCutoff)) return { label: 'Idea cutoff · 25 Nov', at: t(dates.ideaCutoff) };
  if (now < t(dates.kickoff)) return { label: 'Kick-off · Fri 4 Dec', at: t(dates.kickoff) };
  if (now < t(dates.finale)) return { label: 'Finale · Wed 9 Dec', at: t(dates.finale) };
  return null;
}

// Day of the December build week (4–9) that is today, if any.
export function getBuildDay(now: number): number | null {
  const ist = new Date(now + 5.5 * 3600 * 1000);
  if (ist.getUTCFullYear() !== 2026 || ist.getUTCMonth() !== 11) return null;
  const d = ist.getUTCDate();
  return d >= 4 && d <= 9 ? d : null;
}

// Client clock. Starts null so server and first client render match.
export function useNow(tickMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const override = readNowOverride();
    const start = Date.now();
    const read = () => (override === null ? Date.now() : override + (Date.now() - start));
    setNow(read());
    const id = window.setInterval(() => setNow(read()), tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);
  return now;
}
