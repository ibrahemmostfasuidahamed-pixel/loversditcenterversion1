'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';

function CountUp({ end, duration = 2, inView }: { end: number; duration?: number; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration, inView]);

  return <>{count}</>;
}

export default function StatsSection() {
  const t = useTranslations('stats');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const items = Array.from({ length: 4 }).map((_, i) => ({
    value: parseInt(t(`items.${i}.value`), 10),
    label: t(`items.${i}.label`),
    suffix: t(`items.${i}.suffix`),
    icon: t(`items.${i}.icon`),
  }));

  return (
    <section id="stats" className="py-8 md:py-20 relative">
      <div className="container px-4 md:px-0">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-6">
          {items.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center text-center group hover:bg-[#81C784]/5 transition-colors border-[#2E7D32]/30 rounded-2xl"
              style={{
                background: 'linear-gradient(to bottom, rgba(46,125,50,0.05), rgba(20,40,20,0.8))',
                aspectRatio: '1 / 0.85',
              }}
            >
              <div className="text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-4 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
                {stat.icon}
              </div>
              
              <div className="flex items-center justify-center gap-0.5 md:gap-1 font-inter mb-0.5 md:mb-1">
                <span className="rtl:hidden text-[16px] md:text-2xl lg:text-3xl font-bold text-[#F4A01C]">{stat.suffix}</span>
                <motion.span
                  className="text-[28px] md:text-4xl lg:text-5xl font-black gradient-text"
                  animate={isInView ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ delay: idx * 0.1 + 2, duration: 0.5, type: 'tween', ease: 'easeInOut' }}
                >
                  <CountUp end={stat.value} inView={isInView} />
                </motion.span>
                <span className="ltr:hidden text-[16px] md:text-2xl lg:text-3xl font-bold text-[#F4A01C]">{stat.suffix}</span>
              </div>
              
              <p className="text-[11px] md:text-sm lg:text-base text-[var(--muted)] font-medium mt-1 md:mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
