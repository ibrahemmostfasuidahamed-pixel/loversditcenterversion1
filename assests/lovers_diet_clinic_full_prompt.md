# 🏥 Lovers Diet Clinic — Full Website Rebuild Prompt
## Next.js 14 + React + Tailwind + Three.js + Framer Motion

---

## 📌 PROJECT OVERVIEW

Build a **world-class, premium nutrition & wellness clinic website** from scratch for **Lovers Diet Clinic (لوفرز دايت كلينك)** — based in Ajman, UAE, led by Dr. Wael Mousa (MSc Nutrition).

This is a **complete redesign** — not an update. Every pixel must feel premium, modern, and culturally resonant for the UAE market.

**Tech Stack:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS (custom config)
- Framer Motion (animations)
- Three.js + React Three Fiber (3D body avatar)
- GSAP (scroll animations)
- next-i18next (Arabic/English bilingual — RTL support)
- Zustand (global state for avatar form)
- Shadcn/ui (form components)

---

## 🎨 DESIGN SYSTEM & BRAND IDENTITY

### Color Palette — Each Section Has Its Own Color Identity

```css
:root {
  /* Global Brand */
  --color-primary: #C8A96E;        /* Warm gold — luxury & health */
  --color-primary-dark: #A07840;
  --color-black: #0A0A0A;
  --color-white: #FAFAF8;

  /* Section-Specific Colors */
  --hero-bg: #0A0A0A;              /* Deep black */
  --hero-accent: #C8A96E;

  --meals-bg: #0D1A0F;             /* Deep forest green */
  --meals-accent: #4CAF50;
  --meals-highlight: #A8D5A2;

  --consulting-bg: #0D0D1A;        /* Deep navy */
  --consulting-accent: #6C8EF5;
  --consulting-highlight: #B8C8FF;

  --fatburn-bg: #1A0A0A;           /* Deep burgundy */
  --fatburn-accent: #E05C4B;
  --fatburn-highlight: #FFB5A7;

  --supplements-bg: #0F0D1A;       /* Deep purple */
  --supplements-accent: #9B5CF6;
  --supplements-highlight: #D4BCFF;

  --courses-bg: #0A1520;           /* Deep teal-navy */
  --courses-accent: #00C9B1;
  --courses-highlight: #A0EDE4;

  --avatar-bg: #12100A;            /* Warm dark */
  --avatar-accent: #C8A96E;
}
```

### Typography
```
Display Font: "Playfair Display" (headings — elegance)
Arabic Display: "Noto Naskh Arabic" or "Tajawal" (700 weight)
Body: "DM Sans" (clean, medical feel)
Arabic Body: "Cairo" (400/500 weight)
Accent/Numbers: "Bebas Neue" (stats, countdown timers)
```

### Visual Language
- **Dark luxury aesthetic** with per-section color identity
- Glassmorphism cards with colored borders matching section accent
- Grain texture overlay (5% opacity) on all dark backgrounds
- Smooth color transitions between sections using clip-path or gradient blends
- Gold (#C8A96E) as the universal brand thread connecting all sections

---

## 🧭 SITE ARCHITECTURE

### Pages & Routes
```
/ (Home — single-page with section tabs navigation)
/ar (Arabic RTL version)
/services/meals
/services/consulting
/services/fat-burning
/services/supplements
/courses (NEW)
/results
/contact
/avatar-assessment (3D Body Assessment Tool)
```

### Homepage Navigation — Tab System
The homepage features a **sticky floating tab bar** (not a traditional navbar) that allows jumping between sections:

```
[🏠 Home] [🥗 Meals] [💬 Consulting] [🔥 Fat Burn] [💊 Supplements] [📚 Courses] [⭐ Results]
```

Each tab has:
- Icon + label
- Colored dot matching its section color
- Active state: pill background in section's accent color
- Smooth scroll + URL hash update
- Tab bar itself has glassmorphism effect + backdrop blur

---

## 🏠 SECTION 1: HERO (Dark Black)

**Color:** `#0A0A0A` background, gold accents

### Layout
- Full viewport height
- Left: Text content + CTAs
- Right: Animated 3D golden DNA helix or abstract health orb (Three.js)
- Floating badge: "🏆 #1 Nutrition Clinic in UAE"

### Content
```
Headline (Arabic): حياة صحية تبدأ من هنا
Headline (English): A Healthier Life Starts Here
Subline: د. وائل موسى | ماجستير علوم تغذية | عجمان، الإمارات
CTA 1: احجز استشارة مجانية → WhatsApp
CTA 2: اكتشف خدماتنا → Scroll
```

### Stats Strip (animated counters)
```
+500 عميل راضٍ | 160+ فيديو تعليمي | 4 خدمات متكاملة | توصيل يومي لكل الإمارات
```

### Animations
- Text: staggered fade-up on load (Framer Motion)
- 3D orb: slow rotation, particle trails in gold
- Stats: count-up animation on scroll into view
- Background: subtle animated gradient mesh (gold/dark)

---

## 🥗 SECTION 2: BALANCED HEALTHY MEALS (Deep Green `#0D1A0F`)

**Color transition:** Hero black → Forest green (diagonal clip-path)

### Layout
- Section title with green glow underline
- 3-column grid of meal cards with hover lift effect
- Delivery coverage map (SVG UAE map with animated dots on Dubai, Ajman, Abu Dhabi, Sharjah)
- Features list with animated checkmarks

### Meal Card Component
```tsx
interface MealCard {
  name: string;          // e.g., "خطة فقدان الوزن"
  calories: number;      // e.g., 1400
  duration: string;      // e.g., "4 أسابيع"
  tag: string;           // e.g., "الأكثر طلباً"
  image: string;
  features: string[];
}
```

### Content
```
Title: وجباتنا الصحية المتوازنة
Subtitle: مُحضَّرة بـ 100% مكونات طازة، مصممة من أخصائيي تغذية معتمدين

Features:
✅ مكونات طازة 100%
✅ عدّ دقيق للسعرات الحرارية
✅ قوائم متنوعة أسبوعياً
✅ توصيل يومي من الباب للباب
✅ مناسبة لجميع الأنظمة الغذائية
✅ مُصمَّمة من أخصائيي تغذية

Promo Banner: خصم 10% — عرض محدود! [Countdown Timer]
CTA: اطلب وجبتك الآن via WhatsApp
```

### Animations
- Cards: stagger fade-in on scroll
- UAE Map: cities pulse in sequence
- Countdown timer: live seconds ticking (green accent)
- Hover on cards: subtle green glow border

---

## 💬 SECTION 3: SPECIALIZED NUTRITION CONSULTING (Deep Navy `#0D0D1A`)

**Color:** Navy with blue-purple accents

### Layout
- Split: Left = 4-step process timeline | Right = Dr. Wael profile card
- Below: What's included grid (6 cards)
- Guarantee badge

### Dr. Wael Profile Card
```
Photo placeholder with gold ring border
Name: د. وائل موسى
Title: استشاري تغذية معتمد
Credentials:
  🎓 ماجستير علوم التغذية والغذاء
  🔬 باحث دكتوراه في التغذية
  📱 @wael_m سناب شات
  🎥 160+ فيديو تعليمي على يوتيوب
Social links: Snapchat | YouTube
```

### 4-Step Process (Animated Timeline)
```
Step 1: 📞 الاستشارة الأولى المجانية
        احجز جلستك بدون أي التزام مالي

Step 2: 📊 التحليل والتخطيط
        تحليل شامل للجسم + برنامج شخصي كامل

Step 3: 🏃 التنفيذ والمتابعة الأسبوعية
        متابعة أسبوعية مستمرة لضمان النتائج

Step 4: 🏆 النتائج والنجاح
        حقق هدفك مع ضمان الاستدامة
```

### Animation
- Timeline draws itself on scroll (SVG path animation)
- Steps fade in sequentially
- Profile card: floating animation (up/down)

---

## 🔥 SECTION 4: PROFESSIONAL FAT BURNING SESSIONS (Deep Burgundy `#1A0A0A`)

**Color:** Dark red/burgundy with warm orange-red accents

### Layout
- Full-width intro with fire particle effect (Canvas/Three.js subtle)
- Treatment cards grid (3 treatments)
- Before/After result teaser (blurred, CTA to see full results)
- Equipment certification badges

### Treatment Cards
```
Card 1: التجويف والتردد اللاسلكي
        Cavitation & Radiofrequency
        تقليل الدهون بدون جراحة
        [Ultrasonic wave animation SVG]

Card 2: شد وتنعيم الجلد
        Skin Tightening & Smoothing
        لمرونة جلد أفضل
        [Skin texture wave animation]

Card 3: تحفيز حرق الدهون الموضعي
        Targeted Fat Burning
        استهداف مناطق محددة
        [Body outline with glowing spots]
```

### Key Claim Banner
```
⚡ نتائج مرئية من الجلسة الأولى
✅ معدات طبية معتمدة دولياً
👩‍⚕️ متخصصون معتمدون
```

---

## 💊 SECTION 5: NUTRITIONAL PRODUCTS & SUPPLEMENTS (Deep Purple `#0F0D1A`)

**Color:** Deep purple with violet accents

### Layout
- Product category tabs: [بروتينات | فيتامينات | حرق دهون | مكملات عامة]
- Product cards grid
- Free consultation badge on every purchase
- Quality guarantee seal (animated)

### Product Card Component
```tsx
interface ProductCard {
  name: string;
  nameAr: string;
  category: 'protein' | 'vitamins' | 'fatburn' | 'general';
  certified: boolean;
  description: string;
  benefit: string;
  badge?: string;    // "الأكثر مبيعاً" | "جديد"
}
```

---

## 📚 SECTION 6: TRAINING COURSES — NEW (Deep Teal `#0A1520`)

**Color:** Teal/cyan accents on dark navy

### Layout
- Section intro with "جديد 🆕" badge
- Course cards grid (3 columns)
- Instructor card (Dr. Wael)
- Enrollment CTA

### Course Card Component
```tsx
interface CourseCard {
  title: string;
  titleAr: string;
  duration: string;        // e.g., "4 أسابيع"
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  topics: string[];
  format: 'أونلاين' | 'حضوري' | 'هجين';
  badge?: string;          // "قريباً" | "متاح الآن"
  color: string;           // teal accent variation
}
```

### Sample Courses (placeholder — to be filled by client)
```
Course 1: أساسيات التغذية الصحية
          مدة: 4 أسابيع | أونلاين | مبتدئ
          المحاور: الماكرو والميكرو، السعرات، التخطيط

Course 2: التغذية الرياضية المتقدمة
          مدة: 6 أسابيع | هجين | متوسط
          المحاور: التغذية قبل وبعد التمرين، البروتين

Course 3: إدارة الوزن وتغيير العادات
          مدة: 8 أسابيع | أونلاين | متقدم
          المحاور: علم النفس الغذائي، خطط مخصصة
```

### Features
- Course filter by format/level
- "أبلغني عند الإطلاق" button (email capture modal) for upcoming courses
- Progress bar showing enrollment spots: "تبقى 5 أماكن فقط!"

---

## 🧍 FEATURE: 3D BODY AVATAR ASSESSMENT TOOL

This is the **most impressive feature** of the site — an interactive 3D body avatar that changes dynamically based on user inputs.

### Route: `/avatar-assessment`
Also accessible from Hero section CTA: "جرب محاكي الجسم"

### Tech Stack for Avatar
```
- Three.js + React Three Fiber
- @react-three/drei (OrbitControls, useGLTF or procedural mesh)
- Framer Motion (form UI)
- Zustand (state management)
```

### Step-by-Step Form Flow

**Step 1: Gender Selection**
```tsx
// Large visual gender cards, not radio buttons
<GenderCard
  value="male"
  label="ذكر"
  icon={<3D_male_silhouette />}
  selected={gender === 'male'}
/>
<GenderCard
  value="female"
  label="أنثى"
  icon={<3D_female_silhouette />}
  selected={gender === 'female'}
/>
```

**Step 2: Body Metrics Input**
```
الطول (cm): [slider 140–210]
الوزن (kg): [slider 40–180]
العمر:      [slider 15–80]
هدفك:       [تخسيس | تضخيم | حافظ | صحة عامة]
مستوى النشاط: [خامل | متوسط | نشيط | رياضي]
```

**Step 3: Avatar Renders in Real-Time**

### Avatar Logic — BMI-Based Body Shape

```typescript
function calculateBMI(weight: number, height: number): number {
  return weight / ((height / 100) ** 2);
}

type BodyShape = 'underweight' | 'normal' | 'overweight' | 'obese';

function getBodyShape(bmi: number): BodyShape {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

// Avatar mesh morphing based on body shape:
// - underweight: thin limbs, visible ribs suggestion
// - normal: balanced proportions
// - overweight: wider torso, rounded shoulders
// - obese: significantly wider, rounded belly geometry
```

### 3D Avatar Implementation

Since importing GLTF models adds complexity, use **procedural Three.js geometry** to build a stylized avatar:

```tsx
// AvatarScene.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface AvatarProps {
  gender: 'male' | 'female'
  bmi: number
  goal: string
}

function BodyAvatar({ gender, bmi, goal }: AvatarProps) {
  // Body part scales driven by BMI
  const torsoScale = useMemo(() => {
    const base = gender === 'female' ? 0.85 : 1.0
    if (bmi < 18.5) return base * 0.75
    if (bmi < 25)   return base * 1.0
    if (bmi < 30)   return base * 1.3
    return base * 1.6
  }, [bmi, gender])

  const bellyScale = useMemo(() => {
    if (bmi < 25) return 0
    if (bmi < 30) return 0.3
    return 0.7
  }, [bmi])

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={gender === 'female' ? '#F4C2A1' : '#D4956A'} />
      </mesh>

      {/* Torso — scales with BMI */}
      <mesh position={[0, 1.0, 0]} scale={[torsoScale, 1, torsoScale * 0.7]}>
        <cylinderGeometry args={[0.25, 0.2, 0.8, 32]} />
        <meshStandardMaterial color={gender === 'female' ? '#E8A0B4' : '#6B8EAF'} />
      </mesh>

      {/* Belly bulge — only if overweight */}
      {bellyScale > 0 && (
        <mesh position={[0, 0.9, 0.1]} scale={[bellyScale, bellyScale, bellyScale]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color={gender === 'female' ? '#E8A0B4' : '#6B8EAF'} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Left Arm */}
      <mesh position={[-0.45 * torsoScale, 0.9, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.07, 0.06, 0.6, 16]} />
        <meshStandardMaterial color={gender === 'female' ? '#F4C2A1' : '#D4956A'} />
      </mesh>

      {/* Right Arm */}
      <mesh position={[0.45 * torsoScale, 0.9, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.07, 0.06, 0.6, 16]} />
        <meshStandardMaterial color={gender === 'female' ? '#F4C2A1' : '#D4956A'} />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.15, 0.3, 0]}>
        <cylinderGeometry args={[0.09 * torsoScale, 0.07, 0.7, 16]} />
        <meshStandardMaterial color={gender === 'female' ? '#F4C2A1' : '#D4956A'} />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.15, 0.3, 0]}>
        <cylinderGeometry args={[0.09 * torsoScale, 0.07, 0.7, 16]} />
        <meshStandardMaterial color={gender === 'female' ? '#F4C2A1' : '#D4956A'} />
      </mesh>
    </group>
  )
}

export function AvatarCanvas({ gender, bmi, goal }: AvatarProps) {
  return (
    <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 2]} intensity={1.2} color="#C8A96E" />
      <pointLight position={[-2, 2, -2]} intensity={0.5} color="#6C8EF5" />
      <BodyAvatar gender={gender} bmi={bmi} goal={goal} />
      <OrbitControls enablePan={false} minDistance={2} maxDistance={5} />
    </Canvas>
  )
}
```

### After Form Submission — Personalized Result Screen
```
Shows:
- 3D avatar (final state)
- BMI: [value] — [category in Arabic]
- "بناءً على بياناتك، نوصي بـ:"
  → [specific service recommendation from the 4 clinic services]
- "احجز استشارتك المجانية الآن" → WhatsApp CTA
- Color theme of result screen matches recommended service section
```

---

## ⭐ SECTION 7: RESULTS & TESTIMONIALS

**Color:** Warm dark with gold accents (back to brand identity)

### Layout
- Masonry grid of result cards
- 3 featured testimonials (existing clients)
- Stats: "النتائج تتحدث عن نفسها"

### Testimonial Cards (from existing data)
```
Client 1: فاطمة الهاشمي
  Location: دبي | Profession: ربة منزل
  Result: خسرت 15 كغ في 3 أشهر
  Quote: "...شعرت بفرق كبير في طاقتي والنشاط اليومي"
  Rating: ⭐⭐⭐⭐⭐

Client 2: أحمد خليل
  Location: أبو ظبي | Profession: مدير أعمال
  Result: رضا تام عن خدمة الوجبات
  Quote: "...التوصيل في الوقت المحدد، أنصح بها الجميع"
  Rating: ⭐⭐⭐⭐⭐

Client 3: مرام سالم
  Location: الشارقة | Profession: طالبة
  Result: تغيير جذري في نظرة الأكل الصحي
  Quote: "...لم أتخيل أنه يمكن أن يكون بهذا الطعم"
  Rating: ⭐⭐⭐⭐⭐
```

---

## 📞 FOOTER & CONTACT

### Contact Info
```
WhatsApp: +971 52 903 3110
Website: loversdc.com
Location: عجمان، الإمارات العربية المتحدة
Delivery: دبي | أبو ظبي | الشارقة | عجمان وجميع الإمارات
```

### Social Links
```
TikTok:    @loversdiet (323 followers)
YouTube:   Nutrition_ngl / @nutrition_ngl4092 (187 subscribers, 160 videos)
Snapchat:  @wael_2m (Dr. Wael Mousa)
Instagram: lovers_diet_center
```

### Footer Design
- Dark gradient background
- Gold brand mark
- WhatsApp floating button (fixed bottom-right) with pulse animation
- Language toggle: عربي / English

---

## 🌐 BILINGUAL SUPPORT (Arabic/English)

### RTL Configuration
```tsx
// app/layout.tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

### Translation Files Structure
```
/locales
  /ar
    common.json
    hero.json
    meals.json
    consulting.json
    fatburn.json
    supplements.json
    courses.json
    avatar.json
    results.json
  /en
    [same files]
```

### Language Toggle Component
```tsx
// Floating pill in top-right corner
<LanguageToggle>
  <button active={locale === 'ar'}>عربي</button>
  <button active={locale === 'en'}>EN</button>
</LanguageToggle>
```

---

## 🎬 GLOBAL ANIMATIONS & INTERACTIONS

### Page Load Sequence
```
1. Logo fades in center screen (0.5s)
2. Logo scales up then flies to top-left (0.8s)
3. Hero content stagger-reveals (1.0s onward)
4. Tab navigation slides up from bottom (1.5s)
```

### Scroll Behaviors
- **Section transitions:** Each section fades in with a color bloom effect
- **Tab bar:** Highlights active section as user scrolls
- **Counter animations:** Numbers count up when entering viewport
- **Cards:** Stagger fade-up with slight Y translation

### Hover States
- Service cards: lift + colored glow border matching section
- Buttons: scale 1.03 + glow pulse
- Social icons: rotate 10deg + color shift

### Cursor (Desktop)
```css
/* Custom cursor — gold circle */
.cursor-dot {
  width: 8px; height: 8px;
  background: var(--color-primary);
  border-radius: 50%;
}
.cursor-ring {
  width: 32px; height: 32px;
  border: 1px solid var(--color-primary);
  opacity: 0.6;
  /* follows mouse with slight lag */
}
```

---

## 📱 MOBILE RESPONSIVENESS

### Breakpoints
```
xs: 375px   (iPhone SE)
sm: 390px   (iPhone 14)
md: 768px   (iPad)
lg: 1024px  (iPad Pro / Laptop)
xl: 1440px  (Desktop)
2xl: 1920px (Wide)
```

### Mobile Adaptations
- Tab bar becomes horizontal scrollable pills at bottom of screen
- 3D Avatar: simplified geometry on mobile (reduce poly count)
- Hero: stack layout (text above, orb below)
- Cards: single column on mobile, 2-col on tablet
- WhatsApp FAB always visible

---

## ⚡ PERFORMANCE

- Next.js Image optimization for all photos
- Dynamic import for Three.js components: `dynamic(() => import('./AvatarCanvas'), { ssr: false })`
- Lazy loading for off-screen sections
- Font preloading for Arabic + English fonts
- Lighthouse target: 90+ on all metrics

---

## 📁 FOLDER STRUCTURE

```
/app
  /[locale]
    layout.tsx
    page.tsx          ← Homepage (all sections)
    /avatar-assessment
      page.tsx
    /courses
      page.tsx
/components
  /sections
    Hero.tsx
    MealsSection.tsx
    ConsultingSection.tsx
    FatBurnSection.tsx
    SupplementsSection.tsx
    CoursesSection.tsx    ← NEW
    ResultsSection.tsx
    ContactSection.tsx
  /avatar
    AvatarCanvas.tsx
    GenderSelector.tsx
    MetricsForm.tsx
    AvatarResult.tsx
  /ui
    TabBar.tsx
    ServiceCard.tsx
    CourseCard.tsx
    TestimonialCard.tsx
    CountdownTimer.tsx
    LanguageToggle.tsx
    WhatsAppFAB.tsx
  /three
    HeroOrb.tsx
    BodyAvatar.tsx
/lib
  /store
    avatarStore.ts       ← Zustand
  /utils
    bmi.ts
    analytics.ts
/locales
  /ar
  /en
/public
  /images
  /fonts
```

---

## 🔑 KEY IMPLEMENTATION NOTES

1. **Avatar 3D — Start Simple:** Use procedural Three.js geometry first. You can replace with a proper GLTF humanoid model later (e.g., from Mixamo or ReadyPlayerMe). The morph/blend logic stays the same.

2. **Color Per Section:** Use `data-section` attributes on each section div and change CSS variables via JavaScript as user scrolls, or simply hardcode Tailwind classes per section using the custom config.

3. **Tab Navigation:** Use Intersection Observer API to detect which section is in viewport and update active tab accordingly.

4. **WhatsApp Integration:** All CTAs should open `https://wa.me/971529033110?text=مرحباً، أريد حجز استشارة مجانية` — pre-fill message in Arabic.

5. **Countdown Timer:** Fetch a server-side expiry date and display live countdown. Reset daily at midnight UAE time (UTC+4).

6. **Courses Section Data:** Create a `courses.ts` data file. Mark all courses as `status: 'coming-soon'` initially. Add an email notification form.

7. **Avatar Form:** Store all inputs in Zustand store. Avatar re-renders in real-time as sliders move (debounced 100ms for performance).

---

## ✅ DEFINITION OF DONE

- [ ] All 6 sections fully built with correct colors
- [ ] Tab navigation working with scroll detection
- [ ] 3D Avatar renders with gender + BMI morphing
- [ ] Bilingual (AR/EN) with RTL support
- [ ] WhatsApp CTA on every section
- [ ] Courses section with "notify me" modal
- [ ] Mobile responsive (all breakpoints)
- [ ] Countdown timer on meals section
- [ ] Testimonials displayed correctly
- [ ] Performance: 90+ Lighthouse
- [ ] All animations smooth (60fps)
- [ ] Custom cursor (desktop)
- [ ] Floating WhatsApp button

---

*Generated for: Lovers Diet Clinic — loversdc.com*
*Dr. Wael Mousa | Ajman, UAE | WhatsApp: +971 52 903 3110*
