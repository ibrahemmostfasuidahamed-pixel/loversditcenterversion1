'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { slideUp, staggerContainer } from '@/lib/ios-animations';

const HowItWorksCanvas = dynamic(() => import('@/components/three/HowItWorksCanvas'), { ssr: false });

export default function HowItWorksSection() {
  const t = useTranslations('howItWorks');
  const items = Array.from({ length: 4 }).map((_, i) => ({
    title: t(`steps.${i}.title`),
    description: t(`steps.${i}.description`),
    icon: t(`steps.${i}.icon`),
  }));

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="howItWorks" className="relative min-h-screen py-8 md:py-24 overflow-hidden" ref={containerRef}>
      <HowItWorksCanvas />
      
      <div className="container relative z-10 px-4 md:px-0">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
          className="text-center mb-8 md:mb-24"
        >
          <h2 className="text-[24px] md:text-4xl lg:text-5xl font-black gradient-text inline-block">{t('title')}</h2>
          <p className="text-[13px] md:text-base lg:text-lg text-[var(--muted)] max-w-2xl mx-auto mt-2">{t('subtitle')}</p>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          {/* Timeline Line - Desktop (Horizontal) */}
          <div className="hidden md:block absolute top-[68px] left-[10%] right-[10%] h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#2E7D32] to-[#F4A01C]"
              style={{ width: lineWidth }}
            />
          </div>

          {/* Timeline Line - Mobile (Vertical) */}
          <div className="md:hidden absolute top-4 bottom-4 left-[26px] w-[2px] bg-white/5 rounded-full overflow-hidden rtl:left-auto rtl:right-[26px]">
            <motion.div
              className="w-full bg-gradient-to-b from-[#2E7D32] to-[#F4A01C]"
              style={{ height: lineHeight }}
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="flex flex-col md:flex-row justify-between gap-4 md:gap-4 relative z-10"
          >
            {items.map((step, idx) => (
              <motion.div
                key={idx}
                variants={slideUp}
                className="flex md:flex-col items-start md:items-center md:text-center relative gap-3 md:gap-6 flex-1"
              >
                {/* Number Badge */}
                <div className="w-[22px] h-[22px] md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#F4A01C] flex items-center justify-center text-[11px] md:text-2xl font-bold text-white shadow-lg shrink-0 z-10 relative mt-1 md:mt-0">
                  <span className="relative font-inter">{idx + 1}</span>
                </div>
                
                {/* Content Card */}
                <div className="glass p-3 md:p-6 rounded-2xl md:rounded-3xl w-full text-start md:text-center hover:bg-white/[0.02] transition-colors border-[#2E7D32]/20 shadow-xl">
                  <div className="text-xl md:text-4xl mb-2 md:mb-4 bg-black/20 w-9 h-9 md:w-16 md:h-16 rounded-lg md:rounded-2xl flex items-center justify-center md:mx-auto shadow-inner border border-white/5">
                    {step.icon}
                  </div>
                  <h3 className="text-[14px] md:text-xl font-bold text-white mb-1 md:mb-2">{step.title}</h3>
                  <p className="text-[11px] md:text-sm text-[var(--muted)] leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
