'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: () => void;
}

export default function NotificationPanel({ isOpen, onClose, onMarkRead }: NotificationPanelProps) {
  const t = useTranslations('mobile.notifications');
  
  const notifications = [
    { icon: '🎉', text: t('items.0'), time: 'الآن', active: true },
    { icon: '🌿', text: t('items.1'), time: 'منذ سـاعة' },
    { icon: '💪', text: t('items.2'), time: 'امس' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          />

          {/* iOS Spring Panel */}
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 w-full z-[60] bg-[rgba(20,40,20,0.85)] backdrop-blur-xl border-b border-[#2E7D32]/30 shadow-2xl rounded-b-3xl pb-safe md:hidden"
          >
            <div className="p-4 pt-16">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{t('title')}</h3>
                <button 
                  onClick={() => { onMarkRead(); onClose(); }}
                  className="text-sm font-medium text-[#81C784] bg-[#81C784]/10 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                >
                  {t('markAllRead')}
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((notif, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-2xl flex gap-4 items-start ${notif.active ? 'bg-white/10 shadow-inner border border-white/5' : 'bg-transparent'}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2E7D32]/20 to-[#FAFAFA]/5 flex items-center justify-center text-xl shrink-0 border border-white/10">
                      {notif.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed ${notif.active ? 'text-white font-medium' : 'text-white/70'}`}>
                        {notif.text}
                      </p>
                      <span className="text-[11px] text-white/40 mt-1 block font-inter">{notif.time}</span>
                    </div>
                    {notif.active && <div className="w-2 h-2 rounded-full bg-[#E65100] mt-1.5 shadow-[0_0_8px_#E65100]" />}
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
