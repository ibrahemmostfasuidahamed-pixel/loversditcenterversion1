'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Outfit } from 'next/font/google'
import localFont from 'next/font/local'

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-outfit' })
const shorooq = localFont({ src: '../../../../public/fonts/Shorooq_N1.ttf', variable: '--font-shorooq' })

const menuItems = [
  { name: 'Healthy Beef Burger', price: '65 EGP', cat: 'Burgers', desc: 'Grilled chicken patty with whole wheat bun, fresh lettuce and special sauce', image: '/meals/meal-5.jpg' },
  { name: 'Caesar Salad', price: '45 EGP', cat: 'Salads', desc: 'Fresh romaine lettuce with grilled chicken breast, parmesan and croutons', image: '/meals/meal-1.jpg' },
  { name: 'Grilled Chicken', price: '75 EGP', cat: 'Grills', desc: 'Marinated chicken breast served with roasted seasonal vegetables', image: '/meals/meal-9.jpg' },
  { name: 'Fresh Juice', price: '25 EGP', cat: 'Drinks', desc: '100% natural orange and carrot juice freshly squeezed daily', image: '/meals/meal-4.jpg' },
  { name: 'Oatmeal Bowl', price: '35 EGP', cat: 'Breakfast', desc: 'Organic oats topped with fresh berries, honey and almonds', image: '/meals/meal-2.jpg' },
  { name: 'Protein Pancakes', price: '55 EGP', cat: 'Breakfast', desc: 'Fluffy oat-based protein pancakes with sugar-free syrup', image: '/meals/meal-8.jpg' },
]

const testimonials = [
  { name: 'Sarah Ahmed', role: 'Client since 2024', quote: 'Best diet meals I have tried! Lost 5kg in a month with amazing taste.', avatar: 'bg-rose-300' },
  { name: 'Mohamed Ali', role: 'Pro Athlete', quote: 'Delivery is always on time and the food is fresh and well-organized.', avatar: 'bg-sky-300' },
  { name: 'Noor Hassan', role: 'Fitness Coach', quote: 'Great menu variety at reasonable prices. My daily meals are from Lovers Diet.', avatar: 'bg-emerald-300' },
]

const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export default function MealsPage() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<typeof menuItems[0] | null>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const [counts, setCounts] = useState({ c1: 0, c2: 0 })

  const isAr = pathname?.startsWith('/ar')
  const bodyFont = isAr ? 'var(--font-shorooq)' : 'var(--font-outfit)'
  const otherLocale = isAr ? 'en' : 'ar'
  const switchPath = pathname?.startsWith('/ar') || pathname?.startsWith('/en')
    ? pathname.replace(/^\/(ar|en)/, `/${otherLocale}`)
    : `/${otherLocale}/meals`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const dur = 2000; const start = performance.now()
        const targets = [250, 15]
        const anim = (now: number) => {
          const t = Math.min((now - start) / dur, 1)
          const e = 1 - Math.pow(1 - t, 3)
          setCounts({ c1: Math.floor(e * targets[0]), c2: Math.floor(e * targets[1]) })
          if (t < 1) requestAnimationFrame(anim)
        }
        requestAnimationFrame(anim)
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className={`${outfit.variable} ${shorooq.variable} min-h-screen bg-[#dff0a0]`} style={{ fontFamily: bodyFont }} dir={isAr ? 'rtl' : 'ltr'} lang={isAr ? 'ar' : 'en'}>

      <style>{`
        @keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .track { display: flex; gap: 20px; animation: scroll-left 30s linear infinite; width: max-content; }
        .track:hover { animation-play-state: paused; }
        [dir="rtl"] .track { animation: scroll-left 30s linear infinite; }

        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-item { opacity: 0; animation: fade-up 0.6s ease-out forwards; }
        .fade-d1 { animation-delay: 0ms; } .fade-d2 { animation-delay: 150ms; }
        .fade-d3 { animation-delay: 300ms; } .fade-d4 { animation-delay: 450ms; }

        .section-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent); margin: 0; }

        [dir="rtl"] .hero-title { font-size: clamp(60px,10vw,110px) !important; }
        [dir="rtl"] .section-heading { font-size: clamp(36px,6vw,52px) !important; }
        [dir="rtl"] .stat-number { font-size: 48px !important; }
        [dir="rtl"] .stat-label { font-size: 14px !important; }
        [dir="rtl"] .nav-brand { font-size: 26px !important; }
        [dir="rtl"] .nav-link { font-size: 17px !important; }
        [dir="rtl"] .card-title { font-size: 18px !important; }
        [dir="rtl"] .card-price { font-size: 22px !important; }
        [dir="rtl"] .modal-title { font-size: 26px !important; }
        [dir="rtl"] .cta-heading { font-size: clamp(44px,7vw,60px) !important; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center justify-between px-5 md:px-16 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-full bg-[#e8a020] flex items-center justify-center text-white text-lg font-bold">🍊</div>
          <span className="nav-brand text-[22px] font-bold text-gray-900">{isAr ? 'لوفرز دايت' : 'Lovers Diet'}</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: isAr ? 'الرئيسية' : 'Home', href: '/' },
            { label: isAr ? 'القائمة' : 'Menu', href: '#menu' },
            { label: isAr ? 'من نحن' : 'About us', href: '#about' },
            { label: isAr ? 'الحجز' : 'Reservation', href: '#reserve' },
            { label: isAr ? 'المدونة' : 'Blog', href: '#blog' },
          ].map((l, i) => (
            <Link key={l.label} href={l.href} className={`text-[15px] font-medium transition-colors duration-200 ${i === 0 ? 'text-[#e8a020]' : 'text-gray-900 hover:text-[#e8a020]'}`}>{l.label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href={switchPath}
            className="text-[12px] font-semibold text-gray-500 hover:text-gray-900 border border-gray-300 hover:border-gray-500 rounded-full px-3 py-1.5 transition-all duration-200">
            {isAr ? 'EN' : 'AR'}
          </Link>
          <svg className="size-5 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <div className="relative cursor-pointer">
            <div className="size-9 rounded-full bg-[#e8a020] flex items-center justify-center hover:scale-110 transition-transform">
              <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
            </div>
            <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-white border-2 border-[#dff0a0] flex items-center justify-center text-[9px] font-bold text-gray-900">0</span>
          </div>
          <svg className="md:hidden size-6 text-gray-900 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen overflow-hidden bg-[#dff0a0] pt-[70px]">
        {/* 3D Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] left-[8%] w-[100px] h-[100px] rounded-full border border-[#e8a020]/20 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-[25%] right-[10%] w-[70px] h-[70px] rounded-full bg-[#e8a020]/10 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute bottom-[30%] left-[5%] w-[50px] h-[50px] border-2 border-gray-900/10 rotate-45 animate-spin" style={{ animationDuration: '12s' }} />
          <div className="absolute top-[40%] left-[45%] w-[180px] h-[180px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-[25%] right-[15%] w-[30px] h-[30px] rounded-full bg-[#e8a020]/15 animate-bounce" style={{ animationDuration: '3s' }} />
          <svg className="absolute top-[60%] left-[20%] w-14 h-14 text-[#e8a020]/10 animate-pulse" style={{ animationDuration: '6s' }} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
          <svg className="absolute top-[12%] right-[30%] w-10 h-10 text-gray-900/5 animate-spin" style={{ animationDuration: '15s' }} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
        </div>

        <div className="container mx-auto px-5 md:px-10 h-full flex items-center min-h-[calc(100vh-70px)]">
          <div className="w-full max-w-4xl z-10">
            <div className="fade-item fade-d1 flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-gray-400" />
              <span className="text-[11px] text-gray-500 tracking-[0.15em] uppercase font-medium">{isAr ? 'أهلاً بك في لوفرز دايت' : 'Welcome to Lovers Diet'}</span>
            </div>
            <h1 className="fade-item fade-d2 hero-title font-bold text-gray-900 leading-[1.05] mb-6" style={{ fontSize: isAr ? 'clamp(56px,9vw,100px)' : 'clamp(48px,7vw,80px)' }}>
              {isAr ? 'استمتع بوجبات' : 'Enjoy healthy &'}<br />
              <span className="text-[#e8a020]">{isAr ? 'صحية ولذيذة.' : 'delicious food.'}</span>
            </h1>
            <div className="fade-item fade-d3 flex gap-4 flex-wrap mb-10">
              <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gray-900 text-white font-semibold rounded-full py-3.5 px-8 text-[15px] min-w-[140px] hover:bg-gray-700 active:scale-95 transition-all duration-200">{isAr ? 'اطلب الآن' : 'Order Now'}</button>
              <button className="bg-transparent border-2 border-gray-900 text-gray-900 font-semibold rounded-full py-3.5 px-8 text-[15px] min-w-[140px] hover:bg-black/5 active:scale-95 transition-all duration-200">{isAr ? 'احجز طاولة' : 'Book a Table'}</button>
            </div>
            <div ref={statsRef} className="fade-item fade-d4 flex gap-12 md:gap-16 items-end">
              {[
                { val: counts.c1 + '+', label: isAr ? 'وجبة صحية' : 'Healthy Meals' },
                { val: counts.c2 + 'k+', label: isAr ? 'عميل سعيد' : 'Happy Customers' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="stat-number font-extrabold text-gray-900" style={{ fontSize: isAr ? '44px' : '36px' }}>{s.val}</p>
                  <p className="stat-label text-[12px] md:text-[13px] text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />
      </section>

      <div className="section-divider" />

      {/* ── MENU CARDS ── */}
      <motion.section id="menu" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={sectionVariant}
        className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="px-5 md:px-16 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-[2px] bg-gray-400" />
            <span className="text-[11px] text-gray-500 uppercase tracking-[0.15em] font-medium">{isAr ? 'قائمتنا' : 'Our Menu'}</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="section-heading text-[36px] md:text-[42px] font-bold text-gray-900">{isAr ? 'أطباقنا المميزة' : 'Our Special Dishes'}</h2>
            <a href="#" className="text-[14px] text-[#e8a020] underline underline-offset-2 hidden sm:block">{isAr ? 'عرض الكل ←' : 'View all →'}</a>
          </div>
        </div>
          <div className="relative" dir="ltr">
          <div className="track px-5 md:px-16">
            {[...menuItems, ...menuItems].map((item, idx) => (
              <button key={idx} onClick={() => setSelectedMeal(item)}
                className="group flex-shrink-0 w-[280px] bg-[#f8faf2] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#e8a020] cursor-pointer">
                <div className="relative h-44 bg-[#dff0a0] overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                </div>
                <div className="p-4">
                  <span className="inline-block bg-lime-100 text-lime-700 text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full mb-1.5">{item.cat}</span>
                  <h3 className="card-title text-[16px] font-bold text-gray-900">{item.name}</h3>
                  <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="card-price text-[18px] font-extrabold text-gray-900">{item.price}</span>
                    <span className="text-[11px] text-[#e8a020] font-semibold">{isAr ? 'عرض التفاصيل ←' : 'View Details →'}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      </motion.section>

      <div className="section-divider" />

      {/* ── MEAL DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedMeal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedMeal(null)}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
            >
              <button onClick={() => setSelectedMeal(null)}
                className="absolute top-4 right-4 size-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-gray-700 transition-colors z-10">✕</button>
              <div className="relative h-64 md:h-72 bg-[#dff0a0]">
                <Image src={selectedMeal.image} alt={selectedMeal.name} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">{selectedMeal.cat}</span>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMeal.name}</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{selectedMeal.desc}</p>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[28px] font-extrabold text-gray-900">{selectedMeal.price}</span>
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    ★★★★<span className="text-gray-300">★</span>
                    <span className="text-gray-500 text-xs ml-1">(24 reviews)</span>
                  </div>
                </div>
                <a href={`https://wa.me/971529033110?text=I%20want%20to%20order%20${encodeURIComponent(selectedMeal.name)}`} target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center py-3.5 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-700 transition-all duration-300 text-sm shadow-lg">
                  {isAr ? 'اطلب هذه الوجبة الآن' : 'Order This Meal Now'}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WHY CHOOSE US ── */}
      <motion.section id="about" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={sectionVariant}
        className="bg-gray-900 py-24 px-5 md:px-16 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-[#e8a020] text-[11px] uppercase tracking-[0.15em] font-semibold">{isAr ? 'لماذا نحن' : 'Why Choose Us'}</span>
            <h2 className="section-heading font-bold text-white mt-2 mb-16" style={{ fontSize: isAr ? '48px' : '42px' }}>{isAr ? 'نهتم بصحتك أولاً' : 'We Care About Your Health First'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🥗', title: isAr ? 'مكونات طازجة 100%' : '100% Fresh Ingredients', desc: isAr ? 'نستخدم أطعمة طازجة يومياً دون أي إضافات صناعية' : 'We use fresh ingredients daily with no artificial additives.' },
              { icon: '🏃', title: isAr ? 'مناسب لأهدافك' : 'Fits Your Goals', desc: isAr ? 'وجبات مصممة لدعم رحلتك الصحية وأهداف لياقتك' : 'Meals designed to support your health journey and fitness goals.' },
              { icon: '⚡', title: isAr ? 'توصيل سريع' : 'Fast Delivery', desc: isAr ? 'نوصل طلبك ساخناً وطازجاً في أقل من 45 دقيقة' : 'We deliver your order hot and fresh in under 45 minutes.' },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="size-14 rounded-full bg-[#e8a020]/20 flex items-center justify-center mx-auto mb-4 text-2xl">{f.icon}</div>
                <h3 className="text-[20px] font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-[14px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="h-1 bg-gradient-to-b from-gray-900 to-[#dff0a0]" />

      {/* ── TESTIMONIALS ── */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={sectionVariant}
        className="bg-[#dff0a0] py-24 px-5 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-gray-500 text-[11px] uppercase tracking-[0.15em] font-semibold">{isAr ? 'آراء عملائنا' : 'Testimonials'}</span>
          <h2 className="text-[42px] font-bold text-gray-900 mt-2 mb-16">{isAr ? 'ماذا يقولون عنا؟' : 'What Our Clients Say'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="text-amber-400 text-sm mb-4">★★★★★</div>
                <p className="text-[14px] text-gray-700 leading-relaxed italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`size-12 rounded-full ${t.avatar} border-2 border-lime-200`} />
                  <div>
                    <p className="font-bold text-[15px] text-gray-900">{t.name}</p>
                    <p className="text-[12px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="h-1 bg-gradient-to-b from-[#dff0a0] to-gray-900" />

      {/* ── CTA BANNER ── */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={sectionVariant}
        className="bg-gray-900 py-20 px-5 md:px-16 text-center">
        <h2 className="cta-heading font-bold text-white mb-3" style={{ fontSize: isAr ? 'clamp(44px,7vw,60px)' : 'clamp(40px,5vw,48px)' }}>{isAr ? 'جاهز لبدء رحلتك؟' : 'Ready to Start Your Journey?'}</h2>
        <p className="text-gray-400 text-[16px] mb-8">{isAr ? 'اطلب الآن واحصل على توصيل مجاني لأول طلب' : 'Order now and get free delivery on your first order.'}</p>
        <button className="bg-[#e8a020] hover:bg-amber-500 text-white font-bold text-[16px] px-12 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-[#e8a020]/30">
          {isAr ? 'اطلب الآن ←' : 'Order Now →'}
        </button>
      </motion.section>

    </div>
  )
}
