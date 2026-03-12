'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);

  const clients = Array.from({ length: 3 }).map((_, i) => ({
    name: t(`clients.${i}.name`),
    role: t(`clients.${i}.role`),
    quote: t(`clients.${i}.quote`),
    avatar: t(`clients.${i}.avatar`),
  }));

  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % clients.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isMobile, clients.length]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (e: any, { offset }: any) => {
    const swipeThreshold = 50;
    if (offset.x > swipeThreshold) {
      setActiveIndex((prev) => (prev === 0 ? clients.length - 1 : prev - 1));
    } else if (offset.x < -swipeThreshold) {
      setActiveIndex((prev) => (prev + 1) % clients.length);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TestimonialCard = ({ client, className = '' }: any) => (
    <div className={`glass p-4 md:p-8 relative isolate overflow-hidden h-full flex flex-col justify-between rounded-2xl ${className}`}>
      <span className="absolute top-4 md:top-6 right-4 md:right-6 text-[80px] md:text-[120px] font-sans leading-none text-[#2E7D32]/10 select-none z-0 rotate-180 font-serif">
        &quot;
      </span>

      <div className="relative z-10 mb-4 md:mb-8 pt-2 md:pt-4">
        <p className="text-[13px] md:text-lg lg:text-xl text-white/90 italic leading-relaxed font-medium">
          &quot;{client.quote}&quot;
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 md:pt-6 mt-auto">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative">
            <div className="w-[44px] h-[44px] md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-[#81C784] shadow-[0_0_15px_rgba(129,199,132,0.3)]">
              <Image
                src={`https://api.dicebear.com/8.x/personas/svg?seed=${client.avatar}&backgroundColor=142314&radius=50`}
                alt={client.name}
                width={56} height={56}
                unoptimized
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#2E7D32] rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center border border-white/20">
              <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="text-[13px] md:text-base text-white font-bold">{client.name}</h4>
            <p className="text-[11px] md:text-sm text-[var(--muted)]">{client.role}</p>
          </div>
        </div>
        <div className="flex gap-0.5 text-[#F4A01C]">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-[11px] md:text-sm lg:text-base">★</span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section id="testimonials" className="py-8 md:py-24 bg-gradient-to-b from-transparent to-black/30 w-full overflow-hidden">
      <div className="container px-4 lg:px-0 max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-[24px] md:text-4xl lg:text-5xl font-black text-white">{t('title')}</h2>
          <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-[#2E7D32] to-[#F4A01C] mx-auto rounded-full mt-4 md:mt-6" />
        </div>

        {isMobile ? (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing w-full pb-4"
              >
                <TestimonialCard client={clients[activeIndex]} />
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-2 mt-2">
              {clients.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? 'bg-[#81C784] w-5 md:w-6' : 'bg-white/20'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {clients.map((client, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="h-full"
              >
                <TestimonialCard client={client} className="hover:-translate-y-2 transition-transform duration-300" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
