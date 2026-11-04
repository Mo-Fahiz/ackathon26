'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1] as const;

// True when we should skip heavy motion: reduced-motion users or very low-power devices.
export function useCalmMode(): boolean {
  const reduced = useReducedMotion();
  const [lowPower, setLowPower] = useState(false);
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    setLowPower(cores <= 2 || mem <= 2);
  }, []);
  return Boolean(reduced) || lowPower;
}

export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setFine(mq.matches);
    const on = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return fine;
}

export function useWebGL(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      setOk(Boolean(c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}
