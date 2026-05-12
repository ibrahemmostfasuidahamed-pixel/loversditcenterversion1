# 🏥 Lovers Diet Clinic — خطة العمل الكاملة
## Next.js 15 + Supabase + iPhone-First App Style

> **الهدف:** بناء موقع ويب احترافي بمستوى تطبيق iPhone مع Next.js 15 و Supabase — مميز، سريع، ومتجاوب بشكل مثالي مع الموبايل.

---

## 📋 فهرس المحتوى

1. [Tech Stack](#tech-stack)
2. [Supabase Schema](#supabase-schema)
3. [هيكل المشروع](#folder-structure)
4. [مراحل التطوير](#phases)
5. [التصميم وستايل iPhone](#design-system)
6. [قواعد البيانات والـ API](#api-routes)
7. [الـ Components](#components)
8. [الـ Animations](#animations)
9. [SEO و Performance](#seo)
10. [الـ Deployment](#deployment)

---

## 🛠️ Tech Stack {#tech-stack}

### Core Framework
```
Next.js 15          — App Router + Server Components + Server Actions
React 19            — Latest concurrent features
TypeScript 5.x      — Strict mode
```

### Styling & UI
```
Tailwind CSS 4.x    — utility-first, custom design tokens
Framer Motion 11    — animations & gestures (iPhone-feel scroll)
Lucide React        — icons
```

### Backend & Database
```
Supabase            — PostgreSQL + Auth + Storage + Realtime
  ├── PostgreSQL     — main database
  ├── Row Level Security (RLS) — data security
  ├── Supabase Auth  — admin authentication
  ├── Supabase Storage — images & files
  └── Supabase Realtime — live booking notifications
```

### 3D & Visual
```
Three.js + @react-three/fiber  — 3D body avatar
@react-three/drei              — helpers
GSAP 3.x                       — scroll-triggered animations
```

### State & Data Fetching
```
Zustand 5           — global state (avatar, language)
TanStack Query v5   — server state caching
```

### Internationalization
```
next-intl           — Arabic/English bilingual, RTL support
```

### Forms & Validation
```
React Hook Form     — form management
Zod                 — schema validation
```

### Performance
```
Sharp               — image optimization
next/font           — font optimization
Vercel Analytics    — performance monitoring
```

---

## 🗄️ Supabase Schema {#supabase-schema}

### Tables

```sql
-- =====================
-- 1. BOOKINGS TABLE
-- =====================
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Client Info
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  
  -- Booking Details
  service_type TEXT NOT NULL CHECK (service_type IN (
    'consultation', 'meal_plan', 'fat_burning', 'supplements', 'course'
  )),
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'cancelled', 'completed'
  )),
  
  -- Source
  source TEXT DEFAULT 'website',  -- 'website' | 'whatsapp' | 'instagram'
  locale TEXT DEFAULT 'ar'        -- 'ar' | 'en'
);

-- RLS: Only authenticated admin can read all; anyone can insert
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create booking" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all bookings" ON bookings
  FOR SELECT USING (auth.role() = 'authenticated');


-- =====================
-- 2. MEAL PLANS TABLE
-- =====================
CREATE TABLE meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Content (bilingual)
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  
  -- Details
  calories_per_day INTEGER,
  duration_weeks INTEGER,
  price_aed DECIMAL(10,2),
  original_price_aed DECIMAL(10,2),  -- for showing discount
  
  -- Tags
  tag_ar TEXT,        -- "الأكثر طلباً" | "عرض محدود"
  tag_en TEXT,
  tag_color TEXT,     -- hex color
  
  -- Features (stored as JSON array)
  features_ar JSONB DEFAULT '[]',
  features_en JSONB DEFAULT '[]',
  
  -- Media
  image_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- RLS: Public read, admin write
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active plans" ON meal_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage plans" ON meal_plans
  USING (auth.role() = 'authenticated');


-- =====================
-- 3. TESTIMONIALS TABLE
-- =====================
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Client Info
  client_name_ar TEXT NOT NULL,
  client_name_en TEXT,
  location_ar TEXT,
  location_en TEXT,
  profession_ar TEXT,
  profession_en TEXT,
  
  -- Result
  result_ar TEXT NOT NULL,    -- "خسرت 15 كغ في 3 أشهر"
  result_en TEXT,
  quote_ar TEXT NOT NULL,
  quote_en TEXT,
  
  -- Rating
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  
  -- Media
  before_image_url TEXT,
  after_image_url TEXT,
  avatar_url TEXT,
  
  -- Meta
  service_type TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active testimonials" ON testimonials
  FOR SELECT USING (is_active = true);


-- =====================
-- 4. PRODUCTS TABLE (Supplements)
-- =====================
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  benefit_ar TEXT,
  benefit_en TEXT,
  
  category TEXT CHECK (category IN ('protein', 'vitamins', 'fatburn', 'general')),
  
  price_aed DECIMAL(10,2),
  is_certified BOOLEAN DEFAULT true,
  badge_ar TEXT,    -- "الأكثر مبيعاً"
  badge_en TEXT,
  
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);


-- =====================
-- 5. COURSES TABLE
-- =====================
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  
  instructor_ar TEXT DEFAULT 'د. وائل موسى',
  instructor_en TEXT DEFAULT 'Dr. Wael Mousa',
  
  duration_hours INTEGER,
  lessons_count INTEGER,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  
  price_aed DECIMAL(10,2),
  
  status TEXT DEFAULT 'coming_soon' CHECK (status IN (
    'coming_soon', 'available', 'sold_out'
  )),
  
  topics_ar JSONB DEFAULT '[]',
  topics_en JSONB DEFAULT '[]',
  
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active courses" ON courses
  FOR SELECT USING (is_active = true);


-- =====================
-- 6. COURSE WAITLIST
-- =====================
CREATE TABLE course_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  
  UNIQUE(course_id, email)  -- no duplicate signups
);

ALTER TABLE course_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist" ON course_waitlist
  FOR INSERT WITH CHECK (true);


-- =====================
-- 7. PROMO / DISCOUNT TABLE
-- =====================
CREATE TABLE promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  title_ar TEXT NOT NULL,
  title_en TEXT,
  
  discount_percentage INTEGER,   -- e.g., 10
  discount_amount_aed DECIMAL,
  
  applies_to TEXT,   -- 'meals' | 'all' | 'supplements'
  
  -- Timer
  expires_at TIMESTAMPTZ NOT NULL,
  
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active promos" ON promotions
  FOR SELECT USING (is_active = true AND expires_at > NOW());


-- =====================
-- 8. AVATAR ASSESSMENTS (anonymous analytics)
-- =====================
CREATE TABLE avatar_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  gender TEXT CHECK (gender IN ('male', 'female')),
  age INTEGER,
  height_cm INTEGER,
  weight_kg DECIMAL,
  goal TEXT CHECK (goal IN ('lose_weight', 'gain_muscle', 'maintain', 'health')),
  
  bmi DECIMAL(5,2),
  bmi_category TEXT,
  
  recommended_service TEXT,
  
  -- Did they book after assessment?
  converted_to_booking BOOLEAN DEFAULT false,
  
  locale TEXT DEFAULT 'ar'
);

ALTER TABLE avatar_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit assessment" ON avatar_assessments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view assessments" ON avatar_assessments
  FOR SELECT USING (auth.role() = 'authenticated');
```

### Supabase Storage Buckets
```
meals-images/       — meal plan images
product-images/     — supplement product images  
course-images/      — course thumbnails
testimonial-images/ — before/after photos + avatars
```

### Supabase Realtime
```typescript
// في Admin Dashboard — live notification لما حد يحجز
supabase
  .channel('new-bookings')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'bookings'
  }, (payload) => {
    showNotification(payload.new)
  })
  .subscribe()
```

---

## 📁 هيكل المشروع {#folder-structure}

```
lovers-diet-clinic/
│
├── 📁 app/
│   ├── 📁 [locale]/                   ← i18n routing (ar/en)
│   │   ├── layout.tsx                 ← Root layout (RTL/LTR + fonts)
│   │   ├── page.tsx                   ← Homepage (all sections)
│   │   ├── 📁 avatar-assessment/
│   │   │   └── page.tsx
│   │   ├── 📁 courses/
│   │   │   └── page.tsx
│   │   ├── 📁 results/
│   │   │   └── page.tsx
│   │   └── 📁 admin/                  ← Protected admin panel
│   │       ├── layout.tsx             ← Auth guard
│   │       ├── page.tsx               ← Dashboard
│   │       └── 📁 bookings/
│   │           └── page.tsx
│   │
│   ├── 📁 api/
│   │   ├── 📁 bookings/
│   │   │   └── route.ts               ← POST booking + WhatsApp notification
│   │   ├── 📁 waitlist/
│   │   │   └── route.ts               ← Course waitlist signup
│   │   └── 📁 og/
│   │       └── route.tsx              ← Dynamic OG images
│   │
│   ├── globals.css
│   └── layout.tsx                     ← Root (metadata, analytics)
│
├── 📁 components/
│   ├── 📁 sections/                   ← Page sections (SSC + dynamic imports)
│   │   ├── HeroSection.tsx
│   │   ├── MealsSection.tsx
│   │   ├── ConsultingSection.tsx
│   │   ├── FatBurnSection.tsx
│   │   ├── SupplementsSection.tsx
│   │   ├── CoursesSection.tsx
│   │   ├── ResultsSection.tsx
│   │   └── ContactSection.tsx
│   │
│   ├── 📁 avatar/                     ← 3D Avatar System
│   │   ├── AvatarCanvas.tsx           ← dynamic import (no SSR)
│   │   ├── GenderSelector.tsx
│   │   ├── MetricsForm.tsx
│   │   └── AvatarResult.tsx
│   │
│   ├── 📁 ui/                         ← Reusable UI components
│   │   ├── TabBar.tsx                 ← iPhone-style tab bar
│   │   ├── MealCard.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CourseCard.tsx
│   │   ├── TestimonialCard.tsx
│   │   ├── CountdownTimer.tsx         ← Server Component
│   │   ├── StatsCounter.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── WhatsAppFAB.tsx            ← Floating Action Button
│   │   ├── BookingModal.tsx
│   │   ├── GlassCard.tsx              ← Reusable glass morphism card
│   │   └── SectionWrapper.tsx         ← Handles color transitions
│   │
│   ├── 📁 three/                      ← Three.js components
│   │   ├── HeroOrb.tsx               ← Gold DNA helix
│   │   └── BodyAvatar.tsx            ← 3D body morphing
│   │
│   ├── 📁 layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   └── 📁 admin/
│       ├── BookingsTable.tsx
│       └── StatsCards.tsx
│
├── 📁 lib/
│   ├── 📁 supabase/
│   │   ├── client.ts                  ← Browser Supabase client
│   │   ├── server.ts                  ← Server Supabase client
│   │   └── middleware.ts              ← Auth middleware
│   │
│   ├── 📁 store/
│   │   ├── avatarStore.ts             ← Zustand avatar state
│   │   └── uiStore.ts                 ← Language, modals
│   │
│   ├── 📁 utils/
│   │   ├── bmi.ts                     ← BMI calculations
│   │   ├── whatsapp.ts                ← WhatsApp link builder
│   │   └── cn.ts                      ← clsx + twMerge helper
│   │
│   └── 📁 actions/                    ← Server Actions
│       ├── bookings.ts
│       └── waitlist.ts
│
├── 📁 locales/
│   ├── 📁 ar/
│   │   ├── common.json
│   │   ├── hero.json
│   │   ├── meals.json
│   │   ├── consulting.json
│   │   ├── fatburn.json
│   │   ├── supplements.json
│   │   ├── courses.json
│   │   ├── avatar.json
│   │   └── results.json
│   └── 📁 en/
│       └── [same files]
│
├── 📁 public/
│   ├── 📁 images/
│   ├── 📁 fonts/
│   └── 📁 icons/
│
├── 📁 types/
│   ├── database.ts                    ← Supabase generated types
│   └── index.ts
│
├── middleware.ts                      ← next-intl + auth routing
├── next.config.ts
├── tailwind.config.ts
├── i18n.ts
└── supabase/
    ├── migrations/                    ← SQL migration files
    └── seed.ts                        ← Initial data seeding
```

---

## 📅 مراحل التطوير {#phases}

### Phase 0 — الإعداد (يوم 1-2)
```
☐ إنشاء Next.js 15 project
☐ إعداد Supabase project + environment variables
☐ تشغيل SQL migrations (الـ tables فوق)
☐ إعداد Tailwind CSS config (design tokens)
☐ إعداد next-intl (Arabic/English routing)
☐ إعداد Supabase client (browser + server)
☐ إعداد middleware (i18n + auth)
☐ تثبيت كل الـ dependencies
```

```bash
# Commands
npx create-next-app@latest lovers-diet --typescript --tailwind --app
cd lovers-diet

npm install @supabase/supabase-js @supabase/ssr
npm install framer-motion gsap
npm install three @react-three/fiber @react-three/drei
npm install zustand @tanstack/react-query
npm install next-intl
npm install react-hook-form zod @hookform/resolvers
npm install clsx tailwind-merge
npm install lucide-react
```

### Phase 1 — Design System + Layout (يوم 3-4)
```
☐ Tailwind custom config (colors, fonts, spacing)
☐ CSS variables (per-section color identity)
☐ Google Fonts setup (Playfair Display + Cairo + Bebas Neue)
☐ Root layout (RTL/LTR, font classes)
☐ Navbar component (glassmorphism)
☐ iPhone-style Tab Bar component
☐ Footer component
☐ WhatsApp FAB (floating button with pulse)
☐ Language toggle component
☐ GlassCard reusable component
☐ SectionWrapper with color transitions
```

### Phase 2 — Hero Section (يوم 5-6)
```
☐ Hero layout (full viewport, iPhone-native feel)
☐ Three.js gold DNA helix / orb
☐ Staggered text animations (Framer Motion)
☐ Stats counter strip (animated on scroll)
☐ CTA buttons (WhatsApp + scroll)
☐ Floating badge "Premier Nutrition Clinic"
☐ Mobile responsive hero (stacked layout)
☐ Page load animation sequence
```

### Phase 3 — Meals Section + Supabase (يوم 7-9)
```
☐ Supabase query: fetch meal_plans (Server Component)
☐ Meal cards grid (3-col desktop, 1-col mobile)
☐ Countdown timer (server-side expiry from promotions table)
☐ UAE delivery map (SVG animated)
☐ Features checklist animation
☐ Hover: green glow card border
☐ Promo banner with discount badge
☐ WhatsApp CTA per card
☐ Seed initial meal plans data
```

### Phase 4 — Consulting Section (يوم 10-11)
```
☐ Dr. Wael profile card (floating animation)
☐ 4-step animated timeline (SVG path draw on scroll)
☐ "What's included" 6-card grid
☐ Guarantee badge component
☐ Social links (Snapchat, YouTube)
☐ Free consultation CTA → WhatsApp
```

### Phase 5 — Fat Burn Section (يوم 12-13)
```
☐ Fire particle effect (Canvas API, lightweight)
☐ 3 treatment cards with SVG animations
☐ Before/After blurred preview teaser
☐ Equipment certification badges
☐ Key claims banner (animated)
☐ Booking CTA → BookingModal
```

### Phase 6 — Supplements + Courses (يوم 14-16)
```
☐ Product category tabs (بروتينات | فيتامينات | حرق دهون | عام)
☐ Supabase query: products filtered by category
☐ Product cards grid
☐ Quality guarantee seal (animated SVG)
☐ Free consultation badge on purchase
──────────────────────────────────
☐ Courses section (coming soon state)
☐ Course cards with status badges
☐ Waitlist signup modal (email capture)
☐ Supabase insert: course_waitlist
☐ Animated teal accent elements
```

### Phase 7 — 3D Avatar Assessment (يوم 17-19)
```
☐ Gender selector (animated toggle)
☐ Metrics form (height, weight, age, goal)
☐ Zustand store setup
☐ Three.js body avatar (real-time morphing)
☐ BMI calculation utility
☐ Result screen (recommendation + CTA)
☐ Supabase insert: avatar_assessments
☐ Color theme matches recommended service
☐ Mobile: simplified avatar geometry
```

### Phase 8 — Results + Testimonials (يوم 20-21)
```
☐ Supabase query: testimonials (featured first)
☐ Masonry grid layout
☐ Testimonial cards (bilingual)
☐ Before/After image cards (blurred default, tap to reveal)
☐ Stats section "النتائج تتحدث عن نفسها"
☐ Seed initial testimonials
```

### Phase 9 — Booking System (يوم 22-23)
```
☐ BookingModal component (full-screen on mobile)
☐ React Hook Form + Zod validation
☐ Server Action: insert to bookings table
☐ Success state → redirect to WhatsApp
☐ WhatsApp pre-filled message builder (Arabic)
☐ Admin panel: view bookings table
☐ Supabase Realtime: live booking notifications
```

### Phase 10 — i18n + RTL (يوم 24-25)
```
☐ All translation files (ar/en JSON)
☐ RTL layout testing on all sections
☐ Arabic font rendering quality check
☐ Language toggle functionality
☐ next-intl metadata for SEO
☐ Locale-specific WhatsApp messages
```

### Phase 11 — Performance + SEO (يوم 26-27)
```
☐ Dynamic OG image generation (/api/og)
☐ Structured data (JSON-LD: LocalBusiness, MedicalBusiness)
☐ sitemap.xml + robots.txt
☐ next/font optimization
☐ Dynamic imports for Three.js
☐ Image optimization (next/image + Supabase CDN)
☐ Lighthouse audit → target 90+
☐ Core Web Vitals optimization
```

### Phase 12 — Launch (يوم 28)
```
☐ Deploy to Vercel
☐ Custom domain (loversdc.com)
☐ Supabase production environment
☐ Environment variables in Vercel
☐ Final QA (iPhone 14, iPhone SE, iPad, Desktop)
☐ Analytics setup (Vercel Analytics + Supabase)
```

---

## 🎨 التصميم وستايل iPhone {#design-system}

### Tailwind Custom Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.tsx', './components/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C8A96E',
          dark: '#A07840',
          light: '#E8C98E',
        },
        hero: '#0A0A0A',
        meals: '#0D1A0F',
        consulting: '#0D0D1A',
        fatburn: '#1A0A0A',
        supplements: '#0F0D1A',
        courses: '#0A1520',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        arabic: ['Cairo', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        stats: ['Bebas Neue', 'cursive'],
      },
      // iPhone-specific spacing
      borderRadius: {
        'ios': '12px',
        'ios-lg': '20px',
        'ios-xl': '28px',
      },
      // Safe areas for iPhone notch/island
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      screens: {
        'xs': '375px',    // iPhone SE
        'sm': '390px',    // iPhone 14/15
        'md': '768px',    // iPad
        'lg': '1024px',   // iPad Pro
        'xl': '1440px',   // Desktop
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'count-up': 'count-up 0.5s ease-out forwards',
        'draw-path': 'draw-path 2s ease-in-out forwards',
      },
    },
  },
} satisfies Config
```

### iPhone App Style — المبادئ الأساسية

```css
/* globals.css */

/* 1. Safe Area Support — iPhone notch/Dynamic Island */
:root {
  --safe-top: env(safe-area-inset-top);
  --safe-bottom: env(safe-area-inset-bottom);
}

/* 2. Smooth momentum scrolling — feel like iOS */
html {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: none;
}

/* 3. No text selection flicker on tap — iOS native feel */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* 4. Grain texture overlay — luxury feel */
.grain-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/grain.png');
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}

/* 5. Glassmorphism — iOS Control Center style */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* 6. Section color transitions */
[data-section="hero"]         { background: #0A0A0A; }
[data-section="meals"]        { background: #0D1A0F; }
[data-section="consulting"]   { background: #0D0D1A; }
[data-section="fatburn"]      { background: #1A0A0A; }
[data-section="supplements"]  { background: #0F0D1A; }
[data-section="courses"]      { background: #0A1520; }
```

### iPhone-Style Tab Bar (Bottom Navigation)

```tsx
// components/ui/TabBar.tsx
// مثل الـ Tab Bar في تطبيقات iPhone
// Sticky bottom + glassmorphism + haptic-style feedback

const tabs = [
  { id: 'hero',         icon: '🏠',  label: { ar: 'الرئيسية', en: 'Home' },          color: '#C8A96E' },
  { id: 'meals',        icon: '🥗',  label: { ar: 'وجبات',    en: 'Meals' },          color: '#4CAF50' },
  { id: 'consulting',   icon: '💬',  label: { ar: 'استشارة',  en: 'Consult' },        color: '#6C8EF5' },
  { id: 'fatburn',      icon: '🔥',  label: { ar: 'حرق دهون', en: 'Fat Burn' },       color: '#E05C4B' },
  { id: 'supplements',  icon: '💊',  label: { ar: 'مكملات',   en: 'Supplements' },    color: '#9B5CF6' },
  { id: 'courses',      icon: '📚',  label: { ar: 'كورسات',   en: 'Courses' },        color: '#00C9B1' },
  { id: 'results',      icon: '⭐',  label: { ar: 'نتائج',    en: 'Results' },        color: '#C8A96E' },
]

// Design: glass background, active tab = colored pill
// Mobile: scrollable horizontal on small screens
// Desktop: centered pill navbar
```

### Typography System

```typescript
// iPhone-quality typography scale
const typographyScale = {
  // Display — hero headlines
  'display-ar': 'font-arabic text-5xl md:text-7xl font-bold leading-tight',
  'display-en': 'font-display text-5xl md:text-7xl font-bold',
  
  // Section titles
  'title-ar': 'font-arabic text-3xl md:text-5xl font-bold',
  'title-en': 'font-display text-3xl md:text-5xl',
  
  // Card titles
  'card-ar': 'font-arabic text-xl font-semibold',
  
  // Stats (Bebas Neue)
  'stats': 'font-stats text-4xl md:text-6xl text-gold',
  
  // Body text
  'body-ar': 'font-arabic text-base leading-relaxed text-white/70',
  'body-en': 'font-body text-base leading-relaxed text-white/70',
  
  // iPhone caption style
  'caption': 'font-body text-xs tracking-wide uppercase text-white/40',
}
```

---

## 🔌 API Routes {#api-routes}

### Server Actions

```typescript
// lib/actions/bookings.ts
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { buildWhatsAppURL } from '@/lib/utils/whatsapp'

export async function createBooking(formData: BookingFormData) {
  const supabase = createServerClient()
  
  // 1. Insert to database
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      service_type: formData.serviceType,
      preferred_date: formData.date,
      notes: formData.notes,
      locale: formData.locale,
    })
    .select()
    .single()

  if (error) throw error

  // 2. Build WhatsApp redirect URL
  const whatsappURL = buildWhatsAppURL({
    name: formData.name,
    service: formData.serviceType,
    date: formData.date,
    locale: formData.locale,
  })

  return { success: true, bookingId: data.id, whatsappURL }
}
```

```typescript
// lib/utils/whatsapp.ts
export function buildWhatsAppURL({ name, service, locale }: WhatsAppParams) {
  const phone = '971529033110'
  
  const messages = {
    ar: `مرحباً، أنا ${name}، أريد حجز استشارة مجانية لخدمة ${serviceNames.ar[service]}`,
    en: `Hello, I'm ${name}. I'd like to book a free consultation for ${serviceNames.en[service]}`,
  }
  
  const message = encodeURIComponent(messages[locale])
  return `https://wa.me/${phone}?text=${message}`
}
```

---

## 🧩 Components Specs {#components}

### BookingModal — iPhone Sheet Style

```
Design: Full-screen sheet من الأسفل (مثل iOS sheets)
Animation: spring physics slide up
Backdrop: blurred dark overlay
Close: swipe down gesture + X button
Form fields: iOS-style rounded inputs
Submit: full-width green button
Success: checkmark animation → auto-redirect WhatsApp
```

### CountdownTimer — Server Component

```typescript
// Server Component — avoids client-side hydration issues
// Fetch expiry time from Supabase promotions table
// Display: HH:MM:SS with Bebas Neue font
// Color: section accent (green for meals)
// Resets daily at midnight UAE time (UTC+4)
```

### WhatsApp FAB

```
Position: fixed bottom-right (above tab bar on mobile)
Safe area: bottom padding = 80px + safe-area-inset-bottom
Animation: pulse ring in green
Tooltip: "تواصل معنا الآن"
Click: opens WhatsApp with pre-filled Arabic message
```

### StatsCounter

```
Trigger: Intersection Observer (enters viewport)
Animation: count from 0 to target (2 seconds)
Font: Bebas Neue for numbers
Format: +500, 160+, etc.
```

---

## 🎬 Animations {#animations}

### Page Load Sequence
```
0.0s: Black screen
0.3s: Gold logo dot appears center
0.6s: Logo scales up (text reveals)
1.0s: Logo flies to top-left corner
1.2s: Hero content stagger-reveals (bottom to top)
1.5s: Tab bar slides up from bottom
1.8s: 3D orb begins rotation
```

### Scroll Animations (GSAP ScrollTrigger)
```javascript
// Section enter: color bloom effect
// Cards: stagger fade-up (delay 100ms between each)
// Stats: count-up on first viewport enter
// Timeline: SVG path draws itself
// Tab bar: active tab updates based on scroll position
```

### iPhone-Specific Interactions
```
- Pull to refresh gesture handling
- Swipe gestures on cards (horizontal scroll)
- Press and hold on cards for quick preview
- Momentum scrolling between sections
- Rubber-band effect at scroll boundaries
```

---

## 🔍 SEO و Performance {#seo}

### Metadata (next-intl)
```typescript
// app/[locale]/layout.tsx
export async function generateMetadata({ params }) {
  return {
    title: {
      default: 'لوفرز دايت كلينك | Lovers Diet Clinic',
      template: '%s | Lovers Diet'
    },
    description: 'أفضل عيادة تغذية في الإمارات...',
    openGraph: {
      images: ['/api/og?locale=' + params.locale],
    },
    alternates: {
      canonical: 'https://loversdc.com',
      languages: { 'ar': '/ar', 'en': '/en' }
    }
  }
}
```

### JSON-LD Structured Data
```json
{
  "@type": "MedicalBusiness",
  "name": "Lovers Diet Clinic",
  "address": { "addressLocality": "Ajman", "addressCountry": "AE" },
  "telephone": "+971529033110",
  "url": "https://loversdc.com",
  "priceRange": "$$",
  "openingHours": "Sa-Th 09:00-21:00"
}
```

### Performance Targets
```
Lighthouse Performance:     90+
Lighthouse Accessibility:   95+
First Contentful Paint:     < 1.5s
Largest Contentful Paint:   < 2.5s
Cumulative Layout Shift:    < 0.1
Time to Interactive:        < 3s
```

### Optimization Checklist
```
☐ Three.js dynamic import (no SSR)
☐ Images via next/image + Supabase CDN
☐ Font subsetting (Arabic + Latin only)
☐ Section lazy loading (React.lazy)
☐ Prefetch on tab hover
☐ Supabase query caching (TanStack Query)
☐ Static generation for content sections
```

---

## 🚀 Deployment {#deployment}

### Vercel Config
```json
// vercel.json
{
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role"
  }
}
```

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

NEXT_PUBLIC_WHATSAPP_NUMBER=971529033110
NEXT_PUBLIC_SITE_URL=https://loversdc.com
```

### Launch Checklist
```
☐ Supabase prod project created
☐ SQL migrations run on prod
☐ Initial data seeded (meal plans, testimonials, products)
☐ Vercel project linked to GitHub
☐ Custom domain configured (loversdc.com)
☐ SSL certificate active
☐ Environment variables set in Vercel
☐ Analytics configured
☐ Error tracking (Sentry optional)
☐ Final iPhone 14 test on real device
☐ Final RTL Arabic test
☐ WhatsApp links tested
☐ Supabase RLS policies verified
```

---

## 📊 ملخص الجدول الزمني

| Phase | المهمة | الأيام |
|-------|--------|--------|
| 0 | Setup & Config | 1-2 |
| 1 | Design System + Layout | 3-4 |
| 2 | Hero Section | 5-6 |
| 3 | Meals + Supabase | 7-9 |
| 4 | Consulting Section | 10-11 |
| 5 | Fat Burn Section | 12-13 |
| 6 | Supplements + Courses | 14-16 |
| 7 | 3D Avatar | 17-19 |
| 8 | Results + Testimonials | 20-21 |
| 9 | Booking System | 22-23 |
| 10 | i18n + RTL | 24-25 |
| 11 | Performance + SEO | 26-27 |
| 12 | Launch | 28 |

**إجمالي: ~4 أسابيع للـ MVP الكامل**

---

*Lovers Diet Clinic — loversdc.com*
*د. وائل موسى | عجمان، الإمارات | WhatsApp: +971 52 903 3110*
