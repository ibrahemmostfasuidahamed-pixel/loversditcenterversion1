'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

interface Product {
  id: number
  name: { en: string; ar: string }
  description: { en: string; ar: string }
  category: string
  image: string
  servingSize: string
  servings: number
  features: string[]
  price: number
}

const products: Product[] = [
  { id: 1, name: { en: 'Whey Protein Isolate', ar: 'بروتين مصل اللبن المعزول' }, description: { en: 'High-quality whey protein for muscle building and recovery', ar: 'بروتين مصل لبن عالي الجودة لبناء العضلات والتعافي' }, category: 'proteins', image: '/supplements/whey-protein.jpg', servingSize: '30g', servings: 30, features: ['Sugar-free', 'Gluten-free'], price: 250 },
  { id: 2, name: { en: 'Multivitamin Complex', ar: 'مجموعة الفيتامينات المتعددة' }, description: { en: 'Complete daily vitamin and mineral formula', ar: 'تركيبة كاملة من الفيتامينات والمعادن اليومية' }, category: 'vitamins', image: '/supplements/multivitamin.jpg', servingSize: '2 capsules', servings: 60, features: ['Vegan', 'Non-GMO'], price: 180 },
  { id: 3, name: { en: 'Omega-3 Fish Oil', ar: 'زيت السمك أوميغا-3' }, description: { en: 'Premium fish oil for heart and brain health', ar: 'زيت سمك ممتاز لصحة القلب والدماغ' }, category: 'wellness', image: '/supplements/omega3.jpg', servingSize: '2 softgels', servings: 90, features: ['Mercury-free', 'Triple strength'], price: 220 },
  { id: 4, name: { en: 'L-Carnitine Fat Burner', ar: 'إل-كارنتين حارق الدهون' }, description: { en: 'Natural fat burner to support metabolism and energy', ar: 'حارق دهون طبيعي لدعم الأيض والطاقة' }, category: 'fat-burners', image: '/supplements/l-carnitine.jpg', servingSize: '1 scoop', servings: 30, features: ['Caffeine-free', 'Stimulant-free'], price: 200 },
  { id: 5, name: { en: 'BCAA Recovery Formula', ar: 'تركيبة BCAA للتعافي' }, description: { en: 'Branched-chain amino acids for muscle recovery', ar: 'أحماض أمينية متفرعة السلسلة للتعافي العضلي' }, category: 'sports', image: '/supplements/bcaa.jpg', servingSize: '10g', servings: 30, features: ['2:1:1 ratio', 'Electrolytes added'], price: 190 },
  { id: 6, name: { en: 'Collagen Peptides', ar: 'كولاجين ببتيد' }, description: { en: 'Hydrolyzed collagen for skin, joints, and bones', ar: 'كولاجين متحلل للبشرة والمفاصل والعظام' }, category: 'wellness', image: '/supplements/collagen.jpg', servingSize: '10g', servings: 60, features: ['Grass-fed', 'Unflavored'], price: 280 },
  { id: 7, name: { en: 'Vitamin D3 + K2', ar: 'فيتامين D3 + K2' }, description: { en: 'Advanced formula for bone and immune health', ar: 'تركيبة متقدمة لصحة العظام والمناعة' }, category: 'vitamins', image: '/supplements/vitamin-d.jpg', servingSize: '1 softgel', servings: 90, features: ['High potency', 'With K2'], price: 150 },
  { id: 8, name: { en: 'Zinc Picolinate', ar: 'زنك بيكولينات' }, description: { en: 'Highly absorbable zinc for immune support', ar: 'زنك عالي الامتصاص لدعم المناعة' }, category: 'vitamins', image: '/supplements/zinc.jpg', servingSize: '1 capsule', servings: 120, features: ['Chelated', 'High absorption'], price: 120 },
  { id: 9, name: { en: 'Magnesium Glycinate', ar: 'مغنيسيوم جلايسينات' }, description: { en: 'Relaxing magnesium for sleep and recovery', ar: 'مغنيسيوم مهدئ للنوم والتعافي' }, category: 'wellness', image: '/supplements/magnesium.jpg', servingSize: '2 capsules', servings: 90, features: ['Glycinate form', 'Sleep support'], price: 160 },
  { id: 10, name: { en: 'Super Greens Powder', ar: 'مسحوق الخضار الخضراء' }, description: { en: 'Organic greens blend with probiotics and enzymes', ar: 'خضار خضراء عضوية مع بروبيوتيك وإنزيمات' }, category: 'wellness', image: '/supplements/greens-powder.jpg', servingSize: '1 scoop', servings: 30, features: ['Organic', 'With probiotics'], price: 310 },
  { id: 11, name: { en: 'Probiotic Complex', ar: 'مجمع البروبيوتيك' }, description: { en: '50 billion CFU multi-strain probiotic for gut health', ar: '50 مليار CFU بروبيوتيك متعدد السلالات لصحة الأمعاء' }, category: 'wellness', image: '/supplements/probiotic.jpg', servingSize: '1 capsule', servings: 60, features: ['50B CFU', '10 strains'], price: 240 },
  { id: 12, name: { en: 'Electrolyte Powder', ar: 'مسحوق الإلكتروليت' }, description: { en: 'Essential minerals for hydration and performance', ar: 'معادن أساسية للترطيب والأداء' }, category: 'sports', image: '/supplements/electrolytes.jpg', servingSize: '1 scoop', servings: 60, features: ['Zero sugar', 'With magnesium'], price: 170 },
  { id: 13, name: { en: 'Creatine Monohydrate', ar: 'كرياتين مونوهيدرات' }, description: { en: 'Pure micronized creatine for strength and power', ar: 'كرياتين نقي ميكرونيزد للقوة والطاقة' }, category: 'sports', image: '/supplements/creatine.jpg', servingSize: '5g', servings: 60, features: ['Micronized', 'Unflavored'], price: 140 },
  { id: 14, name: { en: 'Plant Protein Blend', ar: 'مزيج البروتين النباتي' }, description: { en: 'Pea and rice protein blend for plant-based athletes', ar: 'مزيج بروتين البازلاء والأرز للرياضيين النباتيين' }, category: 'proteins', image: '/supplements/plant-protein.jpg', servingSize: '35g', servings: 30, features: ['Vegan', 'Gluten-free'], price: 230 },
]

const categories = ['all', 'vitamins', 'proteins', 'fat-burners', 'wellness', 'sports']

export default function SupplementsPage() {
  const t = useTranslations('supplements')
  const [activeCat, setActiveCat] = useState('all')

  const filtered = activeCat === 'all' ? products : products.filter((p) => p.category === activeCat)

  const categoryNames: Record<string, string> = {
    all: 'All',
    vitamins: t('categories.vitamins'),
    proteins: t('categories.proteins'),
    'fat-burners': t('categories.fat-burners'),
    wellness: t('categories.wellness'),
    sports: t('categories.sports'),
  }

  return (
    <div className="min-h-screen bg-[#060f0a] relative overflow-hidden">

      {/* 3D Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-32 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 text-3xl animate-bounce" style={{ animationDuration: '8s' }}>💊</div>
        <div className="absolute bottom-1/4 left-1/5 w-16 h-16 text-2xl animate-bounce" style={{ animationDuration: '10s', animationDelay: '2s' }}>⚗️</div>
        <div className="absolute top-1/2 right-1/5 w-14 h-14 text-2xl animate-bounce" style={{ animationDuration: '7s', animationDelay: '4s' }}>🧪</div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <style>{`
        @keyframes fade-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .animate-fade-up { animation: fade-up 0.6s ease-out forwards; }
      `}</style>

      {/* Back Button - Desktop */}
      <Link href="/" className="hidden md:flex fixed top-6 left-6 rtl:left-auto rtl:right-6 items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors z-50 group">
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Back Button - Mobile */}
      <Link href="/" className="md:hidden fixed top-4 left-4 rtl:left-auto rtl:right-4 z-[60] bg-blue-900/60 backdrop-blur-sm p-2.5 rounded-full hover:bg-blue-800 transition-colors shadow-lg">
        <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>

      {/* HERO */}
      <section className="relative pt-28 pb-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">💊</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-base md:text-lg text-blue-200/60 max-w-xl mx-auto mb-8">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 text-sm">
              {t('browseCTA')}
            </button>
            <Link href="/onboarding/gender"
              className="px-8 py-4 border border-blue-500/40 text-blue-300 font-bold rounded-full hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 text-sm">
              {t('bookConsultationCTA')}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* CATEGORY TABS */}
      <section className="px-6 mb-8">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto pb-2 scrollbar-none justify-center flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                activeCat === cat
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 text-blue-300/60 hover:bg-white/10 hover:text-blue-300'
              }`}
            >
              {categoryNames[cat]}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section id="products" className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeCat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((product) => (
                <motion.div key={product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-[#0a2818] border border-blue-900/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-900/30 to-gray-900">
                    <Image src={product.image} alt={product.name.en} fill className="object-contain p-6 group-hover:scale-110 transition-transform duration-500" unoptimized />
                    <span className="absolute top-3 right-3 bg-blue-500/90 text-white text-[10px] px-3 py-1 rounded-full font-semibold backdrop-blur-sm flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      {t('certified')}
                    </span>
                    <span className="absolute top-3 left-3 bg-green-500/90 text-white text-[10px] px-3 py-1 rounded-full font-semibold backdrop-blur-sm">
                      {categoryNames[product.category]}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1.5">{product.name.en}</h3>
                    <p className="text-sm text-blue-200/50 mb-4 line-clamp-2">{product.description.en}</p>
                    {/* Specs */}
                    <div className="flex gap-1.5 mb-4 flex-wrap">
                      <span className="bg-purple-900/60 text-purple-300 text-[10px] px-2 py-0.5 rounded font-medium">{product.servingSize}</span>
                      <span className="bg-green-900/60 text-green-300 text-[10px] px-2 py-0.5 rounded font-medium">{product.servings} {t('servings')}</span>
                      {product.features.map((f) => (
                        <span key={f} className="bg-blue-900/60 text-blue-300 text-[10px] px-2 py-0.5 rounded font-medium">{f}</span>
                      ))}
                    </div>
                    {/* Price */}
                    <div className="text-xl font-bold text-blue-400 mb-4">{product.price} AED</div>
                    {/* Book button */}
                    <Link href="/onboarding/gender"
                      className="block w-full text-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                      {t('bookNow')}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-blue-300/40 text-lg">No products in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/30 to-transparent" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #5dade2 0, #5dade2 2px, transparent 2px, transparent 10px)' }} />
        <div className="relative max-w-2xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-white mb-4">
            {t('ctaTitle')}
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Link href="/onboarding/gender"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 text-base mb-6">
              {t('ctaButton')}
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <a href="https://wa.me/971529033110?text=Hello%2C%20I%20want%20to%20know%20about%20supplements" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {t('whatsappText')}
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
