'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

export default function MobileTopBar({ unreadCount, onOpenNotifications }: { unreadCount: number, onOpenNotifications: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'ar';
  
  const toggleLanguage = () => {
    const nextLocale = currentLocale === 'ar' ? 'en' : 'ar';
    const newPath = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
    
    // If exact match e.g. from `/` -> `/en` if the locale wasn't in the path
    const finalPath = newPath === pathname ? `/${nextLocale}${pathname}` : newPath;
    router.replace(finalPath);
  };

  return (
    <div className="md:hidden fixed top-0 w-full h-14 z-40 bg-[rgba(10,15,10,0.92)] backdrop-blur-[40px] border-b border-[#2E7D32]/20 shadow-[0_1px_20px_rgba(0,0,0,0.6)] saturate-200">
      <div className="flex justify-between items-center h-full px-4 safe-top">
        
        {/* Left: Logo + Text */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#81C784] flex items-center justify-center shadow-lg border border-white/10">
            <span className="text-xl -mt-0.5">🌿</span>
          </div>
          <span className="font-bold text-xl text-white font-inter tracking-tight">Lovers Diet</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="w-10 h-8 rounded-full bg-white/10 flex items-center justify-between p-1 border border-white/5 relative"
            dir="ltr"
          >
            <motion.div 
              layout
              className="absolute w-6 h-6 rounded-full bg-[#2E7D32] shadow-sm flex items-center justify-center text-[10px] font-bold text-white z-10"
              initial={false}
              animate={{
                x: currentLocale === 'en' ? 14 : 0
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {currentLocale.toUpperCase()}
            </motion.div>
          </button>

          {/* Notification Bell */}
          <button 
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            
            {unreadCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.8 }}
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#E65100] border-2 border-[rgba(10,15,10,1)] flex items-center justify-center"
              >
                <span className="text-[9px] font-bold text-white leading-none -mt-[0.5px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </motion.div>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
