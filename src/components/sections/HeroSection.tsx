'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/Button';
import { staggerContainer, fadeInUp } from '@/lib/ios-animations';

const HeroCanvas = dynamic(() => import('@/components/three/HeroCanvas'), { ssr: false });

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden pt-16">
      <HeroCanvas />
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container relative z-10 flex flex-col items-center justify-center text-center max-w-4xl px-4"
      >
        <motion.div variants={fadeInUp} className="glass-pill mb-4 md:mb-8 border-[#81C784]/40 animate-pulse-green">
          <span className="text-[#81C784] font-bold text-[11px] md:text-sm tracking-wider">{t('badge')}</span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-[32px] md:text-5xl lg:text-7xl xl:text-[96px] font-black leading-tight mb-3 md:mb-6 whitespace-pre-line"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
        >
          <span className="gradient-text">{t('title')}</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-[13px] md:text-lg lg:text-xl text-[var(--muted)] max-w-2xl mb-6 md:mb-12 whitespace-pre-line"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div variants={fadeInUp} className="glass-pill mb-6 md:mb-12 animate-pulse-glow" style={{ background: 'rgba(244,160,28,0.15)', borderColor: 'rgba(244,160,28,0.4)' }}>
          <span className="text-[#F4A01C] font-bold text-[12px] md:text-base">{t('offer')}</span>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
          <Button href="#cta" variant="primary" className="w-full sm:w-auto glow-green group !text-[14px] md:!text-base">
            {t('cta1')}
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }} className="rtl:rotate-180 inline-block">
              →
            </motion.span>
          </Button>
          <Button href="#services" variant="glass" className="w-full sm:w-auto !text-[14px] md:!text-base">
            {t('cta2')}
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
      >
        <div className="w-[26px] h-[42px] md:w-[30px] md:h-[50px] rounded-full border-2 border-[var(--muted)] flex justify-center p-2 mb-2">
          <motion.div
            className="w-1 h-2.5 md:w-1.5 md:h-3 bg-[#81C784] rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
        <motion.span className="text-xl md:text-2xl animate-float" initial={{ opacity: 0.5 }}>
          🌿
        </motion.span>
      </motion.div>
    </section>
  );
}
