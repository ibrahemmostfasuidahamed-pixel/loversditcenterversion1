'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { WHATSAPP } from '@/lib/constants/social';

const CTACanvas = dynamic(() => import('@/components/three/CTACanvas'), { ssr: false });

export default function CTASection() {
  const t = useTranslations('cta');
  const trustItems = Array.from({ length: 4 }).map((_, i) => t(`trust.${i}`));

  return (
    <section id="cta" className="relative min-h-[400px] md:min-h-[600px] flex items-center justify-center py-12 md:py-24 mb-16 md:mb-0">
      <CTACanvas />
      
      <div className="container relative z-10 px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass max-w-3xl mx-auto rounded-2xl md:rounded-[40px] p-6 md:p-14 text-center border-[#2E7D32]/40 shadow-[0_0_60px_rgba(46,125,50,0.2)] overflow-hidden isolate"
          style={{ background: 'linear-gradient(135deg, rgba(20,40,20,0.85) 0%, rgba(10,25,10,0.95) 100%)' }}
        >
          {/* Decorative Corner Glows */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#2E7D32]/30 rounded-full blur-[60px] -z-10" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#F4A01C]/20 rounded-full blur-[60px] -z-10" />

          <motion.div
            animate={{ y: [-10, 0, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6 drop-shadow-lg inline-block"
          >
            🌿
          </motion.div>

          <h2 className="text-[22px] md:text-3xl lg:text-5xl font-black text-white mb-3 md:mb-4 leading-tight">
            {t('title')}
          </h2>
          
          <p className="text-[13px] md:text-lg lg:text-xl text-[var(--muted)] mb-6 md:mb-10 max-w-xl mx-auto">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full px-2 mb-8 md:mb-12">
            <Button
              href={WHATSAPP.url}
              variant="primary"
              className="w-full sm:w-auto !text-[14px] md:!text-lg !px-6 md:!px-8 !py-3 md:!py-4 glow-green"
              style={{ background: 'linear-gradient(135deg, #128C7E, #25D366)' }}
            >
              {t('cta1')}
            </Button>
            
            <Button
              href={WHATSAPP.url}
              variant="glass"
              className="w-full sm:w-auto !text-[14px] md:!text-lg !px-6 md:!px-8 !py-3 md:!py-4 group hover:border-[#25D366] hover:bg-[#25D366]/10 dir-ltr"
            >
              <span className="group-hover:text-[#25D366] transition-colors font-inter" dir="ltr">
                {t('cta2')}
              </span>
            </Button>
          </div>

          <div className="border-t border-white/10 pt-6 md:pt-8 mt-6 md:mt-8 flex flex-wrap justify-center items-center gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4">
            {trustItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 md:gap-2">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#81C784]/20 flex items-center justify-center outline outline-1 outline-[#81C784]/40">
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#81C784]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[11px] md:text-sm font-medium text-white/80">{item}</span>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
