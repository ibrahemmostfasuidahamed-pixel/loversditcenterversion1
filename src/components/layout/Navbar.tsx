'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useActiveSection } from '@/hooks/useActiveSection';

export default function Navbar() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'ar';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLocale = currentLocale === 'ar' ? 'en' : 'ar';
    const newPath = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
    
    // If exact match e.g. from `/` -> `/en` if the locale wasn't in the path
    const finalPath = newPath === pathname ? `/${nextLocale}${pathname}` : newPath;
    router.replace(finalPath);
  };

  const navLinks = [
    { href: '#home', label: t('home'), id: 'home' },
    { href: '#services', label: t('services'), id: 'services' },
    { href: '#howItWorks', label: t('howItWorks'), id: 'howItWorks' },
    { href: '#testimonials', label: t('results'), id: 'testimonials' },
    { href: '#cta', label: t('contact'), id: 'cta' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`hidden md:flex fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div className="container px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div className={`flex items-center gap-3 transition-all duration-300 ${scrolled ? 'scale-90' : 'scale-100'}`}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#81C784] flex items-center justify-center shadow-lg shadow-[#2E7D32]/30 border border-white/20">
            <span className="text-3xl -mt-1">🌿</span>
          </div>
          <div>
            <h1 className="font-bold text-2xl text-white font-inter tracking-tight leading-none">Lovers Diet</h1>
            <span className="text-[#81C784] text-xs font-semibold tracking-widest pl-0.5">CENTER</span>
          </div>
        </div>

        {/* Navigation - Glass Pill Container */}
        <nav 
          className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 ${
            scrolled 
              ? 'bg-[rgba(20,35,20,0.85)] backdrop-blur-xl border-[#2E7D32]/30 shadow-lg' 
              : 'bg-transparent border-transparent'
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                activeSection === link.id ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {activeSection === link.id && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="text-sm font-bold text-white/80 hover:text-white w-10 h-10 rounded-full border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center font-inter"
          >
            {currentLocale === 'ar' ? 'EN' : 'AR'}
          </button>
          
          <Button href="#cta" variant="primary" size="sm" className="hidden lg:flex shadow-none">
            {t('bookNow')}
          </Button>
        </div>

      </div>
    </motion.header>
  );
}
