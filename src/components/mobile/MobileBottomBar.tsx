'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useActiveSection } from '@/hooks/useActiveSection';
import BookingSheet from '@/components/booking/BookingSheet';
import { WHATSAPP } from '@/lib/constants/social';

export default function MobileBottomBar() {
  const t = useTranslations('mobile');
  const activeSection = useActiveSection();
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleScroll = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open(WHATSAPP.url, '_blank');
  };

  const tabs = [
    { id: 'home', label: t('home'), icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', onClick: () => handleScroll('home') },
    { id: 'services', label: t('services'), icon: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z', onClick: () => handleScroll('services') },
    { id: 'book', label: t('book'), isCenter: true, onClick: () => setBookingOpen(true) },
    { id: 'howItWorks', label: t('sessions'), icon: 'M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z', onClick: () => handleScroll('howItWorks') },
    { id: 'contact', label: t('contact'), icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z', onClick: openWhatsApp },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 w-full z-50">
        <div className="h-[72px] safe-bottom grid grid-cols-5 bg-[rgba(10,15,10,0.94)] backdrop-blur-[60px] saturate-200 border-t-[0.5px] border-white/10">
          {tabs.map((tab, i) => {
            const isActive = activeSection === tab.id;

            if (tab.isCenter) {
              return (
                <div key={i} className="flex justify-center h-full relative" style={{ zIndex: 10 }}>
                  <motion.button
                    onClick={tab.onClick}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -top-[18px] w-14 h-14 rounded-2xl flex items-center justify-center font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #2E7D32, #81C784)',
                      boxShadow: '0 0 25px rgba(46,125,50,0.7), inset 0 1px 0 rgba(255,255,255,0.3)',
                    }}
                    animate={{
                      boxShadow: ['0 0 25px rgba(46,125,50,0.7)', '0 0 35px rgba(46,125,50,0.9)', '0 0 25px rgba(46,125,50,0.7)']
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </motion.button>
                </div>
              );
            }

            return (
              <button
                key={i}
                onClick={tab.onClick}
                className="flex flex-col items-center justify-center h-full relative px-1 outline-none"
              >
                <div className="relative z-10 flex flex-col items-center gap-1 mt-1">
                  <motion.div
                    animate={{ y: isActive ? -2 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="relative flex items-center justify-center"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-[#2E7D32]/15 rounded-[10px]"
                        style={{ width: '40px', height: '32px', top: '-5px', left: '-8px' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke={isActive ? '#2E7D32' : 'rgba(241,248,233,0.4)'}
                      strokeWidth={isActive ? '2.5' : '2'} strokeLinecap="round" strokeLinejoin="round"
                      className="relative z-10 transition-colors duration-200"
                    >
                      <path d={tab.icon!} />
                    </svg>
                  </motion.div>
                  <span className={`text-[10px] transition-colors duration-200 ${isActive ? 'text-[#2E7D32] font-bold' : 'text-white/40 font-medium'}`}>
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking Sheet */}
      <AnimatePresence>
        {bookingOpen && <BookingSheet onClose={() => setBookingOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
