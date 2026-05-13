'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const ServicesCanvas = dynamic(() => import('@/components/three/ServicesCanvas'), { ssr: false });

const SERVICE_ROUTES: Record<string, string> = {
  meals: '/meals',
  consultation: '/onboarding/gender',
  fatburn: '/services/fat-burning',
  supplements: '/services/supplements',
  'training-courses': '/services/training-courses',
};

const SERVICE_IMAGES: Record<string, string> = {
  meals: '/services/meals.jpg',
  consultation: '/services/consulting.jpg',
  fatburn: '/services/fat-burning.jpg',
  supplements: '/services/supplements.jpg',
  'training-courses': '/services/training-courses.jpg',
};

function ServicePill({ id, title }: { id: string; title: string }) {
  const t = useTranslations('services');
  const href = SERVICE_ROUTES[id] ?? '#';
  const imgSrc = SERVICE_IMAGES[id] ?? '';

  return (
    <Link
      href={href}
      className="pill-link"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#0d2a18',
        border: '1px solid #1e4a2a',
        borderRadius: '50px',
        overflow: 'hidden',
        height: '56px',
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4ade80'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e4a2a'; }}
    >
      <div style={{ width: '56px', height: '56px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <Image
          src={imgSrc}
          alt={title}
          width={56}
          height={56}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          unoptimized
        />
      </div>
      <div style={{ paddingRight: '16px', whiteSpace: 'nowrap' }}>
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff', margin: '0 0 2px', lineHeight: 1.2 }}>{title}</p>
        <p style={{ fontSize: '11px', color: '#4ade80', margin: 0, lineHeight: 1.2 }}>
          {t('bookNow')} →
        </p>
      </div>
    </Link>
  );
}

export default function ServicesSection() {
  const t = useTranslations('services');

  const items = Array.from({ length: 5 }).map((_, i) => ({
    id: t(`items.${i}.id`),
    title: t(`items.${i}.title`),
  }));

  return (
    <section id="services" className="relative py-8 md:py-12 overflow-hidden">
      <ServicesCanvas />

      <div className="container relative z-10 px-4 md:px-0 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-6 md:mb-10"
        >
          <h2 className="text-[24px] md:text-4xl lg:text-5xl font-black gradient-text inline-block">{t('title')}</h2>
          <p className="text-[13px] md:text-base lg:text-lg text-[var(--muted)] max-w-2xl mx-auto mt-2">{t('subtitle')}</p>
        </motion.div>
      </div>

      {/* ── Auto-scrolling carousel ── */}
      <div dir="ltr"
        style={{
          overflow: 'hidden',
          width: '100%',
          position: 'relative',
          zIndex: 10,
          paddingTop: '8px',
          paddingBottom: '8px',
        }}
      >
        <style>{`
          @keyframes scroll-left {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .track {
            display: flex;
            gap: 12px;
            padding: 0 20px;
            animation: scroll-left 60s linear infinite;
            width: max-content;
          }
          .track:hover { animation-play-state: paused; }
          .pill-link:hover { border-color: #4ade80 !important; }
        `}</style>

        <div className="track">
          {[...items, ...items, ...items, ...items].map((item, idx) => (
            <ServicePill key={`${item.id}-${idx}`} id={item.id} title={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
