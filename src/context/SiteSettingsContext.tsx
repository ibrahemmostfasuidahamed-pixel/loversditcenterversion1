'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SOCIAL_LINKS, WHATSAPP } from '@/lib/constants/social';

export interface SiteSettings {
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  snapchat_url: string;
  trendyol_url: string;
  whatsapp_number: string;
  whatsapp_msg_ar: string;
  whatsapp_msg_en: string;
  clinic_name_ar: string;
  clinic_name_en: string;
  clinic_address_ar: string;
  clinic_phone: string;
  clinic_email: string;
  google_maps_url: string;
  [key: string]: string;
}

const defaults: SiteSettings = {
  instagram_url: SOCIAL_LINKS.instagram.url,
  tiktok_url: SOCIAL_LINKS.tiktok.url,
  youtube_url: SOCIAL_LINKS.youtube.url,
  snapchat_url: SOCIAL_LINKS.snapchat.url,
  trendyol_url: SOCIAL_LINKS.trendyol.url,
  whatsapp_number: WHATSAPP.number,
  whatsapp_msg_ar: WHATSAPP.messageAr,
  whatsapp_msg_en: WHATSAPP.messageEn,
  clinic_name_ar: 'لوفرز دايت سنتر',
  clinic_name_en: 'Lovers Diet Center',
  clinic_address_ar: '',
  clinic_phone: '',
  clinic_email: '',
  google_maps_url: '',
};

const SiteSettingsContext = createContext<SiteSettings>(defaults);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {}); // fallback to defaults silently
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
