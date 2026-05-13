'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';

const BLUE = '#4A6CF7';
const MIN = 15;
const MAX = 80;

export default function AgePage() {
  const router = useRouter();
  const { data, set } = useOnboarding();
  const [age, setAge] = useState(data.age);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    setAge(val);
    set('age', val);
  }

  const pct = ((age - MIN) / (MAX - MIN)) * 100;

  function ageGroup(a: number) {
    if (a < 20) return { label: 'Teen', emoji: '🧑' };
    if (a < 30) return { label: 'Young Adult', emoji: '💪' };
    if (a < 45) return { label: 'Adult', emoji: '🏃' };
    if (a < 60) return { label: 'Middle Age', emoji: '🧘' };
    return { label: 'Senior', emoji: '🌟' };
  }

  const { label, emoji } = ageGroup(age);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-[420px] flex flex-col min-h-screen px-5 pb-8">

        {/* PROGRESS */}
        <div className="pt-5 pb-1 shrink-0">
          <div className="w-full h-[4px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: BLUE }}
              initial={{ width: '50%' }} animate={{ width: '66%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }} />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-400 font-medium">
            <span>Step 4 of 6</span><span>66%</span>
          </div>
        </div>

        {/* TITLE */}
        <motion.div className="mt-10 mb-2 text-center shrink-0"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}>
          <h1 className="text-[26px] font-extrabold text-gray-900">How old are you?</h1>
          <p className="text-sm text-gray-400 mt-1">Age helps us fine-tune your metabolic calculations</p>
        </motion.div>

        <motion.div className="flex-1 flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>

          {/* Big number + emoji */}
          <div className="text-center">
            <div className="text-5xl mb-3">{emoji}</div>
            <motion.span key={age} className="text-[88px] font-black leading-none"
              style={{ color: BLUE }} initial={{ scale: 0.85, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.15 }}>
              {age}
            </motion.span>
            <span className="text-2xl font-bold text-gray-400 ml-2">yrs</span>
            <div className="mt-2">
              <span className="px-4 py-1.5 bg-blue-50 rounded-full text-sm text-blue-600 font-semibold">{label}</span>
            </div>
          </div>

          {/* SLIDER */}
          <div className="w-full px-2">
            <div className="relative mb-3">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-75"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${BLUE}, #6A8DFF)` }} />
              </div>
              <input type="range" min={MIN} max={MAX} value={age} onChange={handleChange}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-3" />
              <div className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border-[3px] shadow-lg pointer-events-none transition-all duration-75"
                style={{ left: `calc(${pct}% - 14px)`, borderColor: BLUE, boxShadow: '0 4px 16px rgba(74,108,247,0.4)' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
              <span>{MIN} yrs</span><span>{MAX} yrs</span>
            </div>
          </div>

          {/* Quick picks */}
          <div className="flex gap-3 flex-wrap justify-center">
            {[18, 25, 30, 35, 45, 55].map(v => (
              <button key={v} onClick={() => { setAge(v); set('age', v); }}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={{ background: age === v ? BLUE : '#F3F4F6', color: age === v ? 'white' : '#6B7280' }}>
                {v}
              </button>
            ))}
          </div>
        </motion.div>

        {/* BUTTONS */}
        <div className="mt-8 shrink-0 flex gap-3">
          <button onClick={() => router.back()}
            className="px-6 py-4 rounded-2xl text-base font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">←</button>
          <motion.button onClick={() => router.push('/onboarding/goal')}
            whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }}
            className="flex-1 py-4 rounded-2xl text-lg font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #6A8DFF 100%)`, boxShadow: '0 8px 28px rgba(74,108,247,0.4)' }}>
            Next →
          </motion.button>
        </div>

        <div className="text-center mt-4 shrink-0">
          <p className="text-xs text-gray-400">
            Already our user?{' '}
            <span className="underline cursor-pointer text-gray-500 hover:text-[#4A6CF7] transition-colors">
              Continue with your existing account
            </span>{' '}›
          </p>
        </div>
      </div>
    </div>
  );
}
