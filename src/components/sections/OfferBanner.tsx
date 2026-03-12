'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function OfferBanner() {
  const t = useTranslations('offer');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 7, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) { clearInterval(interval); return; }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-lg md:rounded-xl flex items-center justify-center border border-white/30 shadow-lg relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-[16px] md:text-2xl font-bold font-inter text-white absolute"
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[9px] md:text-[11px] text-white/80 mt-1 font-medium">{label}</span>
    </div>
  );

  return (
    <section id="offer" className="relative min-h-[100px] md:min-h-[140px] overflow-hidden !py-0 flex items-center z-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F4A01C] to-[#E65100]">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px)' }} />
      </div>
      
      <div className="container relative z-10 py-4 md:py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-start">
            <div className="bg-black/20 backdrop-blur text-white text-[10px] md:text-xs font-bold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full mb-2 md:mb-3 inline-flex items-center gap-1 border border-white/10 shadow-inner">
              {t('badge')}
            </div>
            <h2 className="text-[18px] md:text-2xl lg:text-3xl font-black text-white mb-1 md:mb-2 drop-shadow-md">
              {t('title')}
            </h2>
            <p className="text-white/90 text-[12px] md:text-sm lg:text-base font-medium">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
            <div className="flex gap-1.5 md:gap-2 font-inter" dir="ltr">
              <TimeUnit value={timeLeft.days} label="Days" />
              <div className="text-white font-bold text-[14px] md:text-xl mt-2 md:mt-3">:</div>
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <div className="text-white font-bold text-[14px] md:text-xl mt-2 md:mt-3">:</div>
              <TimeUnit value={timeLeft.minutes} label="Mins" />
              <div className="text-white font-bold text-[14px] md:text-xl mt-2 md:mt-3">:</div>
              <TimeUnit value={timeLeft.seconds} label="Secs" />
            </div>

            <Button href="#cta" variant="white" className="whitespace-nowrap w-full sm:w-auto shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-300 !text-[13px] md:!text-base !py-2.5 md:!py-3">
              {t('cta')}
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
