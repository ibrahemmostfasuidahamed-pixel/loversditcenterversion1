'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { staggerContainer } from '@/lib/ios-animations';
import { useIsMobile } from '@/hooks/useIsMobile';

const ServicesCanvas = dynamic(() => import('@/components/three/ServicesCanvas'), { ssr: false });

export default function ServicesSection() {
  const t = useTranslations('services');
  const isMobile = useIsMobile();

  const items = Array.from({ length: 4 }).map((_, i) => ({
    id: t(`items.${i}.id`),
    title: t(`items.${i}.title`),
    description: t(`items.${i}.description`),
    icon: t(`items.${i}.icon`),
    color: t(`items.${i}.color`),
    features: Array.from({ length: 6 }).map((_, j) => t(`items.${i}.features.${j}`)),
  }));

  return (
    <section id="services" className="relative min-h-screen py-8 md:py-20">
      <ServicesCanvas />
      
      <div className="container relative z-10 px-4 md:px-0 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-[24px] md:text-4xl lg:text-5xl font-black gradient-text inline-block">{t('title')}</h2>
          <p className="text-[13px] md:text-base lg:text-lg text-[var(--muted)] max-w-2xl mx-auto mt-2">{t('subtitle')}</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-2 gap-2.5 md:gap-6"
        >
          {items.map((service, idx) => (
            <GlassCard key={service.id} index={idx} className="group relative overflow-hidden flex flex-col h-full !p-4 md:!p-6 lg:!p-8 !rounded-2xl">
              {/* Colored Glow */}
              <div
                className="absolute top-0 right-0 w-20 md:w-32 h-20 md:h-32 rounded-full blur-[60px] md:blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                style={{ backgroundColor: service.color }}
              />

              <div className="flex gap-2 md:gap-4 items-start mb-3 md:mb-6 pt-1 md:pt-2">
                <div
                  className="w-9 h-9 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl shadow-inner shrink-0"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${service.color}40`,
                    boxShadow: `inset 0 0 20px ${service.color}20`,
                  }}
                >
                  <span className="drop-shadow-md">{service.icon}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] md:text-xl font-bold text-white mb-0.5 md:mb-1 group-hover:text-[var(--primary-light)] transition-colors line-clamp-2">{service.title}</h3>
                  <a href="#cta" className="text-[10px] md:text-sm font-medium hover:underline flex items-center gap-1" style={{ color: service.color }}>
                    {t('bookNow')} <span className="text-[8px] md:text-xs rtl:hidden">→</span><span className="text-[8px] md:text-xs ltr:hidden">←</span>
                  </a>
                </div>
              </div>

              <div className="h-px w-full bg-white/10 mb-3 md:mb-5" />

              {!isMobile && (
                <p className="text-[var(--muted)] text-sm leading-relaxed mb-6 h-[42px]">
                  {service.description}
                </p>
              )}

              <ul className="flex-1 space-y-1.5 md:space-y-3 mb-4 md:mb-8">
                {service.features.slice(0, isMobile ? 3 : 6).map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2 md:gap-3 group/item">
                    <span className="w-[5px] h-[5px] md:w-[6px] md:h-[6px] rounded-full shrink-0" style={{ backgroundColor: service.color }} />
                    <span className="text-[11px] md:text-sm text-white/80 leading-tight">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {idx % 2 === 0 ? (
                  <Button href="#cta" className="w-full shadow-lg !text-[12px] md:!text-base !py-2 md:!py-3 !min-h-[36px] md:!min-h-[44px] !rounded-xl" style={{ background: `linear-gradient(135deg, ${service.color}, #81C784)` }}>
                    {t('bookNow')}
                  </Button>
                ) : (
                  <Button href="#cta" variant="glass" className="w-full !text-[12px] md:!text-base !py-2 md:!py-3 !min-h-[36px] md:!min-h-[44px] !rounded-xl">
                    {t('learnMore')}
                  </Button>
                )}
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
