// ─── Centralized Social Media Constants ───
// All social links across the codebase must import from this file.
// Never hardcode URLs directly in components.

export interface SocialLink {
  url: string;
  label: string;
  labelAr: string;
  /** SVG path data (24×24 viewBox) — optional if imagePath is provided */
  svgPath?: string;
  /** PNG/image path (relative to /public) — used instead of svgPath */
  imagePath?: string;
  color: string;
  tooltip: string;
}

export const SOCIAL_LINKS: Record<string, SocialLink> = {
  instagram: {
    url: "https://www.instagram.com/lovers_diet_center/",
    label: "Instagram",
    labelAr: "انستقرام",
    // Official Instagram gradient represented as solid brand color
    svgPath:
      "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    color: "#E1306C",
    tooltip: "@lovers_diet_center",
  },

  tiktok: {
    url: "https://www.tiktok.com/@loversdiet",
    label: "TikTok",
    labelAr: "تيك توك",
    svgPath:
      "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z",
    color: "#EE1D52",
    tooltip: "@loversdiet",
  },

  youtube: {
    url: "https://www.youtube.com/channel/UCb0n5fTajQsT8oUC3_2sG6Q",
    label: "YouTube",
    labelAr: "يوتيوب",
    svgPath:
      "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    color: "#FF0000",
    tooltip: "Lovers Diet — يوتيوب",
  },

  snapchat: {
    url: "https://snapchat.com/t/iNZP0R7H",
    label: "Snapchat",
    labelAr: "سناب شات",
    imagePath: "/snapchat-icon-seeklogo.svg",
    color: "#FFFC00",
    tooltip: "@wael_m — سناب شات",
  },

  trendyol: {
    url: "https://www.trendyol.com/ar/sr?mid=1188498",
    label: "Trendyol",
    labelAr: "ترينديول",
    // Uses image logo — no svgPath needed
    imagePath: "/trendyol-logo.png",
    color: "#F27A1A",
    tooltip: "Trendyol Store",
  },
} as const;

/** Ordered array for rendering — keeps iteration order predictable */
export const SOCIAL_LINKS_LIST = Object.values(SOCIAL_LINKS);

// ─── WhatsApp (separate — used for CTA & floating button) ───

export const WHATSAPP = {
  number: "971529033110",
  messageAr: "مرحباً، أريد حجز استشارة في لوفر دايت سنتر",
  messageEn:
    "Hello, I'd like to book a consultation at Lover Diet Center",
  get urlAr() {
    return `https://wa.me/${this.number}?text=${encodeURIComponent(this.messageAr)}`;
  },
  get urlEn() {
    return `https://wa.me/${this.number}?text=${encodeURIComponent(this.messageEn)}`;
  },
  /** Simple link without pre-filled message */
  get url() {
    return `https://wa.me/${this.number}`;
  },
  displayNumber: "+971 52 903 3110",
};
