'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileTopBar from '@/components/mobile/MobileTopBar';
import MobileBottomBar from '@/components/mobile/MobileBottomBar';
import NotificationPanel from '@/components/mobile/NotificationPanel';

import HeroSection from '@/components/sections/HeroSection';
import OfferBanner from '@/components/sections/OfferBanner';
import ServicesSection from '@/components/sections/ServicesSection';
import StatsSection from '@/components/sections/StatsSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import ProductsSection from '@/components/sections/ProductsSection';

export default function Home() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  return (
    <>
      <Navbar />
      
      {/* Mobile Top Bar */}
      <MobileTopBar 
        unreadCount={unreadCount} 
        onOpenNotifications={() => setIsNotifOpen(true)} 
      />
      
      <NotificationPanel 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        onMarkRead={() => setUnreadCount(0)} 
      />

      <main className="flex flex-col min-h-screen">
        <HeroSection />
        <OfferBanner />
        
        <div className="relative z-10 w-full overflow-hidden">
          <ServicesSection />
          <StatsSection />
          <ProductsSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <CTASection />
        </div>
      </main>

      <Footer />
      
      {/* Mobile Bottom Bar iOS 18 */}
      <MobileBottomBar />
    </>
  );
}
