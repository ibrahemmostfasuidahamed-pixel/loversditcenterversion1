'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';

const BLUE = '#4A6CF7';
const MIN = 140;
const MAX = 210;

export default function HeightPage() {
  const router = useRouter();
  const { data, set } = useOnboarding();
  const [height, setHeight] = useState(data.height);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    setHeight(val);
    set('height', val);
  }

  const pct = ((height - MIN) / (MAX - MIN)) * 100;
  const totalInches = Math.round(height / 2.54);
  const ft = Math.floor(totalInches / 12);
  const inches = totalInches % 12;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-[420px] flex flex-col min-h-screen px-5 pb-8">

        {/* PROGRESS */}
        <div className="pt-5 pb-1 shrink-0">
          <div className="w-full h-[4px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: BLUE }}
              initial={{ width: '33%' }} animate={{ width: '50%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }} />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-400 font-medium">
            <span>Step 3 of 6</span><span>50%</span>
          </div>
        </div>

        {/* TITLE */}
        <motion.div className="mt-10 mb-2 text-center shrink-0"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}>
          <h1 className="text-[26px] font-extrabold text-gray-900">How tall are you?</h1>
          <p className="text-sm text-gray-400 mt-1">Used to calculate your ideal body weight range</p>
        </motion.div>

        <motion.div className="flex-1 flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>

          {/* Big number */}
          <div className="text-center">
            <motion.span key={height} className="text-[88px] font-black leading-none"
              style={{ color: BLUE }} initial={{ scale: 0.85, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.15 }}>
              {height}
            </motion.span>
            <span className="text-2xl font-bold text-gray-400 ml-2">cm</span>
            <div className="text-sm text-gray-400 mt-1">{ft}ft {inches}in</div>
          </div>

          {/* Ruler visual */}
          <div className="relative w-14 rounded-2xl overflow-hidden bg-gray-100" style={{ height: '180px' }}>
            <motion.div className="absolute bottom-0 left-0 right-0 rounded-2xl"
              style={{ background: `linear-gradient(180deg, #6A8DFF, ${BLUE})` }}
              animate={{ height: `${pct * 1.7}px` }} transition={{ duration: 0.15 }} />
          </div>

          {/* SLIDER */}
          <div className="w-full px-2">
            <div className="relative mb-3">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-75"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${BLUE}, #6A8DFF)` }} />
              </div>
              <input type="range" min={MIN} max={MAX} value={height} onChange={handleChange}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-3" />
              <div className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border-[3px] shadow-lg pointer-events-none transition-all duration-75"
                style={{ left: `calc(${pct}% - 14px)`, borderColor: BLUE, boxShadow: '0 4px 16px rgba(74,108,247,0.4)' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
              <span>{MIN} cm</span><span>{MAX} cm</span>
            </div>
          </div>

          {/* Quick picks */}
          <div className="flex gap-3 flex-wrap justify-center">
            {[155, 165, 170, 175, 180, 190].map(v => (
              <button key={v} onClick={() => { setHeight(v); set('height', v); }}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={{ background: height === v ? BLUE : '#F3F4F6', color: height === v ? 'white' : '#6B7280' }}>
                {v}
              </button>
            ))}
          </div>
        </motion.div>

        {/* BUTTONS */}
        <div className="mt-8 shrink-0 flex gap-3">
          <button onClick={() => router.back()}
            className="px-6 py-4 rounded-2xl text-base font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">←</button>
          <motion.button onClick={() => router.push('/onboarding/age')}
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
