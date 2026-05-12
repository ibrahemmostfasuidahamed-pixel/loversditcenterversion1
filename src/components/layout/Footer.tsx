'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { SOCIAL_LINKS } from '@/lib/constants/social';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function Footer() {
  const t = useTranslations('footer');
  const settings = useSiteSettings();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  // Build dynamic social list from DB settings, falling back to constants
  const socialList = [
    { ...SOCIAL_LINKS.instagram, url: settings.instagram_url || SOCIAL_LINKS.instagram.url },
    { ...SOCIAL_LINKS.tiktok,    url: settings.tiktok_url    || SOCIAL_LINKS.tiktok.url    },
    { ...SOCIAL_LINKS.youtube,   url: settings.youtube_url   || SOCIAL_LINKS.youtube.url   },
    { ...SOCIAL_LINKS.snapchat,  url: settings.snapchat_url  || SOCIAL_LINKS.snapchat.url  },
    { ...SOCIAL_LINKS.trendyol,  url: settings.trendyol_url  || SOCIAL_LINKS.trendyol.url  },
  ];

  return (
    <footer className="hidden md:block fixed bottom-0 left-0 w-full z-40 bg-[rgba(10,20,10,0.95)] backdrop-blur-[60px] saturate-200 border-t border-[#2E7D32]/20 shadow-[0_-4px_30px_rgba(0,0,0,0.5)] h-16">
      <div className="container h-full px-6 flex items-center justify-between">
        
        {/* LEFT — Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#81C784] flex items-center justify-center">
            <span className="text-sm">🌿</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-white font-inter">Lovers Diet Center</span>
            <span className="text-[10px] text-[var(--muted)] -mt-0.5">{t('tagline')}</span>
          </div>
        </div>

        {/* CENTER — Social Icons Row */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2 flex gap-2 h-[52px] items-center shadow-inner">
            {socialList.map((link) => (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => setHoveredIcon(link.label)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                <motion.a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center transition-all duration-200 relative z-10 overflow-hidden"
                  style={{
                    // Always visible with brand color tint
                    background: `${link.color}22`,
                    border: `1.5px solid ${link.color}44`,
                    color: link.color,
                  }}
                  whileHover={{
                    scale: 1.18,
                    y: -3,
                    background: `${link.color}44`,
                    boxShadow: `0 0 20px ${link.color}99, 0 0 40px ${link.color}44`,
                    border: `1.5px solid ${link.color}99`,
                  }}
                  whileTap={{ scale: 0.90 }}
                >
                  {/* Trendyol — image logo */}
                  {link.imagePath ? (
                    <div className="relative w-[22px] h-[22px]">
                      <Image
                        src={link.imagePath}
                        alt={link.label}
                        fill
                        className="object-contain"
                        sizes="22px"
                      />
                    </div>
                  ) : (
                    <svg
                      className="w-[19px] h-[19px]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={link.svgPath} />
                    </svg>
                  )}
                </motion.a>

                {/* Active glow dot below icon */}
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ${
                    hoveredIcon === link.label
                      ? 'w-4 opacity-100'
                      : 'w-1 opacity-40'
                  }`}
                  style={{ background: link.color }}
                />

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredIcon === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute bottom-[58px] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap z-50 pointer-events-none font-inter"
                      style={{
                        background: `rgba(10,20,10,0.9)`,
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${link.color}44`,
                        color: link.color,
                        boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
                      }}
                    >
                      {link.tooltip}
                      {/* Tooltip Arrow */}
                      <div
                        className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-0 h-0"
                        style={{
                          borderLeft: '5px solid transparent',
                          borderRight: '5px solid transparent',
                          borderTop: `5px solid ${link.color}44`,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Copyright */}
        <div className="flex flex-col text-right font-inter" dir="ltr">
          <span className="text-[11px] text-[var(--muted)] font-medium tracking-wide">© 2025 Lovers Diet Center</span>
          <span className="text-[10px] text-white/40">{t('rights').split('—')[1]?.trim() || 'All Rights Reserved'}</span>
        </div>

      </div>
    </footer>
  );
}
