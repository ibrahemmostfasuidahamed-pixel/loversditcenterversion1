'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Meal {
  id: number
  name: { en: string; ar: string }
  description: { en: string; ar: string }
  category: string
  image: string
  nutrition: { calories: number; protein: number; carbs: number; fats: number }
}

const mealsData: Meal[] = [
  { id: 1, name: { en: 'Grilled Chicken Salad', ar: 'سلطة الدجاج المشوي' }, description: { en: 'Fresh mixed greens with grilled chicken breast', ar: 'خضار مشكلة طازجة مع صدر دجاج مشوي' }, category: 'lunch', image: '/meals/meal-1.jpg', nutrition: { calories: 420, protein: 35, carbs: 20, fats: 15 } },
  { id: 2, name: { en: 'Oatmeal with Berries', ar: 'شوفان مع التوت' }, description: { en: 'Organic oats topped with fresh seasonal berries', ar: 'شوفان عضوي مع توت طازج موسمي' }, category: 'breakfast', image: '/meals/meal-2.jpg', nutrition: { calories: 320, protein: 12, carbs: 45, fats: 8 } },
  { id: 3, name: { en: 'Grilled Salmon Fillet', ar: 'فيليه سلمون مشوي' }, description: { en: 'Atlantic salmon with roasted vegetables', ar: 'سلمون أطلنطي مع خضار مشوية' }, category: 'dinner', image: '/meals/meal-3.jpg', nutrition: { calories: 480, protein: 40, carbs: 18, fats: 22 } },
  { id: 4, name: { en: 'Green Smoothie Bowl', ar: 'وعاء سموثي أخضر' }, description: { en: 'Blended spinach, banana, and almond milk', ar: 'سبانخ مهروسة مع موز وحليب لوز' }, category: 'breakfast', image: '/meals/meal-4.jpg', nutrition: { calories: 260, protein: 8, carbs: 40, fats: 6 } },
  { id: 5, name: { en: 'Quinoa Buddha Bowl', ar: 'وعاء الكينوا' }, description: { en: 'Quinoa, roasted chickpeas, avocado, tahini', ar: 'كينوا مع حمص مشوي وأفوكادو وطحينة' }, category: 'lunch', image: '/meals/meal-5.jpg', nutrition: { calories: 510, protein: 18, carbs: 55, fats: 22 } },
  { id: 6, name: { en: 'Almond Energy Balls', ar: 'كرات الطاقة باللوز' }, description: { en: 'Dates, almonds, coconut, and cacao', ar: 'تمر مع لوز وجوز الهند وكاكاو' }, category: 'snacks', image: '/meals/meal-6.jpg', nutrition: { calories: 180, protein: 6, carbs: 22, fats: 10 } },
  { id: 7, name: { en: 'Grilled Chicken Wrap', ar: 'لفة الدجاج المشوي' }, description: { en: 'Whole wheat wrap with grilled chicken', ar: 'لفة قمح كامل مع دجاج مشوي' }, category: 'lunch', image: '/meals/meal-7.jpg', nutrition: { calories: 390, protein: 30, carbs: 35, fats: 12 } },
  { id: 8, name: { en: 'Berry Protein Pancakes', ar: 'بان كيك بروتين بالتوت' }, description: { en: 'Oat-based pancakes with protein powder', ar: 'بان كيك بالشوفان وبروتين مع توت' }, category: 'breakfast', image: '/meals/meal-8.jpg', nutrition: { calories: 350, protein: 25, carbs: 38, fats: 9 } },
  { id: 9, name: { en: 'Herb-Baked Chicken', ar: 'دجاج مخبوز بالأعشاب' }, description: { en: 'Oven-baked chicken with rosemary and thyme', ar: 'دجاج مخبوز بالفرن مع إكليل الجبل والزعتر' }, category: 'dinner', image: '/meals/meal-9.jpg', nutrition: { calories: 440, protein: 38, carbs: 15, fats: 18 } },
  { id: 10, name: { en: 'Hummus & Veggie Sticks', ar: 'حمص وخضار طازجة' }, description: { en: 'Creamy hummus with fresh vegetable sticks', ar: 'حمص كريمي مع أصابع خضار طازجة' }, category: 'snacks', image: '/meals/meal-10.jpg', nutrition: { calories: 190, protein: 8, carbs: 20, fats: 9 } },
  { id: 11, name: { en: 'Grilled Vegetable Panini', ar: 'بانيني خضار مشوي' }, description: { en: 'Pressed panini with grilled vegetables', ar: 'بانيني مضغوط مع خضار مشوية' }, category: 'lunch', image: '/meals/meal-11.jpg', nutrition: { calories: 340, protein: 14, carbs: 42, fats: 12 } },
  { id: 12, name: { en: 'Chia Pudding', ar: 'بودنغ الشيا' }, description: { en: 'Coconut chia pudding with mango', ar: 'بودنغ شيا بجوز الهند مع مانجو' }, category: 'desserts', image: '/meals/meal-12.jpg', nutrition: { calories: 220, protein: 6, carbs: 28, fats: 11 } },
  { id: 13, name: { en: 'Lean Beef Stir-Fry', ar: 'لحم بقري مقلي' }, description: { en: 'Lean beef strips with broccoli and peppers', ar: 'شرائح لحم بقري مع بروكلي وفلفل' }, category: 'dinner', image: '/meals/meal-13.jpg', nutrition: { calories: 460, protein: 42, carbs: 22, fats: 16 } },
  { id: 14, name: { en: 'Avocado Toast', ar: 'توست الأفوكادو' }, description: { en: 'Sourdough toast with avocado and seeds', ar: 'توست عجين مخمر مع أفوكادو وبذور' }, category: 'breakfast', image: '/meals/meal-14.jpg', nutrition: { calories: 290, protein: 10, carbs: 30, fats: 14 } },
  { id: 15, name: { en: 'Dark Chocolate Mousse', ar: 'موس الشوكولاتة الداكنة' }, description: { en: 'Avocado-based chocolate mousse', ar: 'موس شوكولاتة بالأفوكادو' }, category: 'desserts', image: '/meals/meal-15.jpg', nutrition: { calories: 200, protein: 4, carbs: 18, fats: 14 } },
  { id: 16, name: { en: 'Trail Mix Bites', ar: 'مكسرات مشكلة' }, description: { en: 'Mixed nuts, seeds, and dried fruits', ar: 'مكسرات وبذور وفواكه مجففة' }, category: 'snacks', image: '/meals/meal-16.jpg', nutrition: { calories: 160, protein: 5, carbs: 14, fats: 11 } },
]

const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snacks', 'desserts']

export default function MealsPage() {
  const t = useTranslations('meals')
  const router = useRouter()
  const [activeCat, setActiveCat] = useState('all')

  const filtered = activeCat === 'all' ? mealsData : mealsData.filter((m) => m.category === activeCat)

  const categoryNames: Record<string, string> = {
    all: 'All',
    breakfast: t('categories.breakfast'),
    lunch: t('categories.lunch'),
    dinner: t('categories.dinner'),
    snacks: t('categories.snacks'),
    desserts: t('categories.desserts'),
  }

  return (
    <div className="min-h-screen bg-[#060f0a] relative overflow-hidden">

      {/* 3D Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-32 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 text-3xl animate-bounce" style={{ animationDuration: '8s' }}>🥗</div>
        <div className="absolute bottom-1/4 left-1/5 w-16 h-16 text-2xl animate-bounce" style={{ animationDuration: '10s', animationDelay: '2s' }}>🥑</div>
        <div className="absolute top-1/2 right-1/5 w-14 h-14 text-2xl animate-bounce" style={{ animationDuration: '7s', animationDelay: '4s' }}>🥦</div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <style>{`
        @keyframes fade-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .animate-fade-up { animation: fade-up 0.6s ease-out forwards; }
      `}</style>

      {/* Back Button - Desktop */}
      <Link href="/" className="hidden md:flex fixed top-6 left-6 rtl:left-auto rtl:right-6 items-center gap-2 text-green-400 hover:text-green-300 transition-colors z-50 group">
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Back Button - Mobile */}
      <Link href="/" className="md:hidden fixed top-4 left-4 rtl:left-auto rtl:right-4 z-[60] bg-green-900/60 backdrop-blur-sm p-2.5 rounded-full hover:bg-green-800 transition-colors shadow-lg">
        <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>

      {/* HERO */}
      <section className="relative pt-28 pb-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🥗</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-base md:text-lg text-green-200/60 max-w-xl mx-auto mb-8">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 text-sm">
              {t('browseCTA')}
            </button>
            <Link href="/onboarding/gender"
              className="px-8 py-4 border border-green-500/40 text-green-300 font-bold rounded-full hover:bg-green-500/10 hover:border-green-400 transition-all duration-300 text-sm">
              {t('bookMealCTA')}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* CATEGORY TABS */}
      <section className="px-6 mb-8">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto pb-2 scrollbar-none justify-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                activeCat === cat
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-white/5 text-green-300/60 hover:bg-white/10 hover:text-green-300'
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
            <motion.div
              key={activeCat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((meal) => (
                <motion.div
                  key={meal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-[#0a2818] border border-green-900/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image src={meal.image} alt={meal.name.en} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                    <span className="absolute top-3 right-3 bg-green-500/90 text-white text-[10px] px-3 py-1 rounded-full font-semibold backdrop-blur-sm">
                      {categoryNames[meal.category] || meal.category}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1.5">{meal.name.en}</h3>
                    <p className="text-sm text-green-200/50 mb-4 line-clamp-2">{meal.description.en}</p>
                    {/* Nutrition */}
                    <div className="flex gap-1.5 mb-4 flex-wrap">
                      <span className="bg-green-900/60 text-green-300 text-[10px] px-2 py-0.5 rounded font-medium">{meal.nutrition.calories} {t('nutrition.calories')}</span>
                      <span className="bg-blue-900/60 text-blue-300 text-[10px] px-2 py-0.5 rounded font-medium">{meal.nutrition.protein}g {t('nutrition.protein')}</span>
                      <span className="bg-yellow-900/60 text-yellow-300 text-[10px] px-2 py-0.5 rounded font-medium">{meal.nutrition.carbs}g {t('nutrition.carbs')}</span>
                      <span className="bg-red-900/60 text-red-300 text-[10px] px-2 py-0.5 rounded font-medium">{meal.nutrition.fats}g {t('nutrition.fats')}</span>
                    </div>
                    {/* Book button */}
            <Link href="/onboarding/gender"
                      className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-3 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40">
                      {t('bookNow')}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-green-300/40 text-lg">No meals in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-emerald-900/30 to-transparent" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #4ade80 0, #4ade80 2px, transparent 2px, transparent 10px)' }} />
        <div className="relative max-w-2xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-white mb-4"
          >
            {t('ctaTitle')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/onboarding/gender"
              className="inline-block px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 text-base mb-6">
              {t('ctaButton')}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <a href="https://wa.me/971529033110?text=Hello%2C%20I%20want%20to%20book%20a%20meal%20plan" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm">
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
