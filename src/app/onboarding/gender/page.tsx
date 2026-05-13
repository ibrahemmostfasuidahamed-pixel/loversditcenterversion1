'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useOnboarding } from '../OnboardingProvider'

type Gender = 'male' | 'female'

const BLUE = '#4A6CF7'

export default function GenderPage() {
  const router = useRouter()
  const { data, set } = useOnboarding()
  const [selected, setSelected] = useState<Gender | null>(data.gender)
  const [error, setError] = useState(false)
  const t = useTranslations('consultation')

  function pick(g: Gender) {
    setSelected(g)
    set('gender', g)
    setError(false)
  }

  function handleNext() {
    if (!selected) { setError(true); return }
    router.push('/onboarding/name')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-green-400/5"
            style={{
              width: Math.random() * 60 + 20 + 'px',
              height: Math.random() * 60 + 20 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float-bg ${Math.random() * 10 + 5}s ease-in-out infinite`,
              animationDelay: Math.random() * 5 + 's',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <style>{`
        @keyframes float-bg {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
      `}</style>

      {/* Back Button — Desktop */}
      <button
        onClick={() => router.push('/')}
        className="hidden md:flex absolute top-8 left-8 rtl:left-auto rtl:right-8 items-center gap-2 text-gray-400 hover:text-green-500 transition-colors group z-20"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-medium">{t('backToHome')}</span>
      </button>

      {/* Back Button — Mobile */}
      <button
        onClick={() => router.push('/')}
        className="md:hidden fixed top-4 left-4 rtl:left-auto rtl:right-4 z-[60] bg-gray-800/80 backdrop-blur-sm p-2.5 rounded-full hover:bg-gray-700 transition-colors shadow-lg"
      >
        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div className="w-full max-w-[420px] flex flex-col min-h-screen px-5 pb-8 relative">

        {/* Progress */}
        <div className="pt-20 pb-1 shrink-0">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-600"
              initial={{ width: 0 }}
              animate={{ width: '14%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-400 font-medium">
            <span>Step 1 of 7</span>
            <span>14%</span>
          </div>
        </div>

        {/* Title */}
        <div className="animate-fade-in-up mt-4 mb-2 shrink-0 text-center">
          <h2 className="text-[28px] md:text-3xl font-extrabold text-gray-900 mb-2">
            {t('step1Title')}
          </h2>
          <p className="text-sm text-gray-400">
            {t('step1Description')}
          </p>
        </div>

        {/* Figures */}
        <div className="flex gap-6 justify-center items-end flex-1">

          {/* Female */}
          <motion.button
            onClick={() => pick('female')}
            className="relative flex flex-col items-center gap-3 bg-transparent border-none cursor-pointer p-0 group"
            aria-pressed={selected === 'female'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <motion.div
              className="relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border-2 transition-all duration-300"
              animate={{
                borderColor: selected === 'female' ? '#4ade80' : 'rgba(229,231,235,0.8)',
                boxShadow: selected === 'female'
                  ? '0 0 0 3px rgba(74,222,128,0.3), 0 20px 60px rgba(74,222,128,0.2)'
                  : '0 4px 24px rgba(0,0,0,0.06)',
                scale: selected === 'female' ? 1.05 : selected === 'male' ? 0.92 : 1,
                opacity: selected === 'male' ? 0.35 : 1,
                filter: selected === 'male' ? 'blur(2px) brightness(0.55)' : 'blur(0px) brightness(1)',
              }}
              transition={{ duration: 0.35 }}
            >
              <Image
                src="/onboarding/female-original.png"
                alt={t('female')}
                width={175}
                height={350}
                className="block"
                style={{ objectFit: 'contain' }}
                priority
              />
            </motion.div>
            <motion.span
              className="text-base font-bold pb-0.5"
              animate={{
                color: selected === 'female' ? '#16a34a' : '#374151',
                borderBottom: selected === 'female' ? '2px solid #16a34a' : '2px solid transparent',
              }}
              transition={{ duration: 0.25 }}
            >
              {t('female')}
            </motion.span>
          </motion.button>

          {/* Male */}
          <motion.button
            onClick={() => pick('male')}
            className="relative flex flex-col items-center gap-3 bg-transparent border-none cursor-pointer p-0 group"
            aria-pressed={selected === 'male'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <motion.div
              className="relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border-2 transition-all duration-300"
              animate={{
                borderColor: selected === 'male' ? '#4ade80' : 'rgba(229,231,235,0.8)',
                boxShadow: selected === 'male'
                  ? '0 0 0 3px rgba(74,222,128,0.3), 0 20px 60px rgba(74,222,128,0.2)'
                  : '0 4px 24px rgba(0,0,0,0.06)',
                scale: selected === 'male' ? 1.05 : selected === 'female' ? 0.92 : 1,
                opacity: selected === 'female' ? 0.35 : 1,
                filter: selected === 'female' ? 'blur(2px) brightness(0.55)' : 'blur(0px) brightness(1)',
              }}
              transition={{ duration: 0.35 }}
            >
              <Image
                src="/onboarding/male-original.png"
                alt={t('male')}
                width={175}
                height={350}
                className="block"
                style={{ objectFit: 'contain' }}
                priority
              />
            </motion.div>
            <motion.span
              className="text-base font-bold pb-0.5"
              animate={{
                color: selected === 'male' ? '#16a34a' : '#374151',
                borderBottom: selected === 'male' ? '2px solid #16a34a' : '2px solid transparent',
              }}
              transition={{ duration: 0.25 }}
            >
              {t('male')}
            </motion.span>
          </motion.button>

        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-center text-sm text-red-500 mt-4"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Please select your gender to continue.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Next */}
        <div className="mt-6 shrink-0">
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.97 }}
            whileHover={selected ? { scale: 1.03 } : {}}
            disabled={!selected}
            className="w-full max-w-md mx-auto py-4 px-8 text-lg font-bold text-white rounded-full shadow-lg transition-all duration-200"
            style={{
              background: selected
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : '#d1d5db',
              boxShadow: selected ? '0 8px 30px rgba(34,197,94,0.35)' : 'none',
              cursor: selected ? 'pointer' : 'not-allowed',
            }}
          >
            {t('next')} →
          </motion.button>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 shrink-0">
          <p className="text-xs text-gray-400">
            {t('alreadyUser')}{' '}
            <span className="underline cursor-pointer text-gray-500 hover:text-green-500 transition-colors">
              {t('continueExisting')}
            </span>{' '}›
          </p>
        </div>

      </div>
    </div>
  )
}
