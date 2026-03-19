'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  useDisplay?: boolean; // display font (Bebas Neue)
  size?: string;
  color?: string;
}

export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1200,
  useDisplay = true,
  size = '42px',
  color = '#FFFFFF',
}: AnimatedCounterProps) {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * numericValue));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else setCurrent(numericValue);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [numericValue, duration]);

  const formatted = current.toLocaleString('en-US');

  return (
    <span
      style={{
        fontFamily: useDisplay ? "'Bebas Neue', sans-serif" : "'Cairo', sans-serif",
        fontSize: size,
        color,
        lineHeight: 1,
        letterSpacing: useDisplay ? '0.02em' : 0,
        display: 'inline-block',
      }}
    >
      {prefix}{formatted}{suffix}
    </span>
  );
}
