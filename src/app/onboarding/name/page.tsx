'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useOnboarding } from '../OnboardingProvider'

const BLUE = '#4A6CF7'

export default function NamePage() {
  const router = useRouter()
  const { set } = useOnboarding()
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('consultation')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleNext() {
    if (!name.trim()) return
    set('name' as any, name.trim())
    router.push('/onboarding/weight')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-[420px] flex flex-col min-h-screen px-5 pb-8 relative">

        {/* Back Button */}
        <button
          onClick={() => router.push('/onboarding/gender')}
          className="absolute top-5 left-5 z-10 text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
        >
          ← {t('backToHome')}
        </button>

        {/* Progress */}
        <div className="pt-16 pb-1 shrink-0">
          <div className="w-full h-[5px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: BLUE }}
              initial={{ width: 0 }}
              animate={{ width: '28%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-400 font-medium">
            <span>Step 2 of 7</span>
            <span>28%</span>
          </div>
        </div>

        {/* Title */}
        <motion.h1
          className="text-[26px] font-extrabold text-gray-900 text-center mt-12 mb-2 shrink-0"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {t('nameStepTitle')}
        </motion.h1>
        <motion.p
          className="text-sm text-gray-400 text-center mb-8 shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          {t('nameStepDescription')}
        </motion.p>

        {/* Input */}
        <div className="flex-1 flex items-start justify-center pt-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="w-full text-center text-xl font-bold bg-transparent outline-none border-none placeholder:text-gray-300 text-gray-900"
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && handleNext()}
            />
            <div
              className="h-[3px] mt-3 rounded-full transition-all duration-300"
              style={{
                background: name.trim() ? BLUE : '#e5e7eb',
                width: name.trim() ? '100%' : '60%',
                margin: '12px auto 0',
              }}
            />
            {name.trim() && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-gray-400 mt-4"
              >
                👋 {t('next')}, {name.trim()}!
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Next */}
        <div className="mt-8 shrink-0">
          <motion.button
            onClick={handleNext}
            whileTap={{ scale: 0.97 }}
            whileHover={name.trim() ? { scale: 1.01 } : {}}
            disabled={!name.trim()}
            className="w-full py-4 rounded-2xl text-lg font-bold text-white transition-all duration-300"
            style={{
              background: name.trim() ? `linear-gradient(135deg, ${BLUE} 0%, #6A8DFF 100%)` : '#D1D9FF',
              boxShadow: name.trim() ? '0 8px 28px rgba(74,108,247,0.4)' : 'none',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            {t('next')} →
          </motion.button>
        </div>

      </div>
    </div>
  )
}
