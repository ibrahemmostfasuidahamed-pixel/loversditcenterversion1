'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding, type Goal } from '../OnboardingProvider';

const BLUE = '#4A6CF7';

const GOALS: { id: Goal; emoji: string; title: string; subtitle: string; color: string; glow: string }[] = [
  {
    id: 'lose_weight',
    emoji: '🔥',
    title: 'Lose Weight',
    subtitle: 'Burn fat & slim down',
    color: '#FF6B6B',
    glow: 'rgba(255,107,107,0.25)',
  },
  {
    id: 'gain_muscle',
    emoji: '💪',
    title: 'Gain Muscle',
    subtitle: 'Build strength & mass',
    color: '#4A6CF7',
    glow: 'rgba(74,108,247,0.25)',
  },
  {
    id: 'maintain',
    emoji: '⚖️',
    title: 'Maintain Weight',
    subtitle: 'Stay at my current weight',
    color: '#00C9B1',
    glow: 'rgba(0,201,177,0.25)',
  },
  {
    id: 'health',
    emoji: '🌿',
    title: 'General Health',
    subtitle: 'Improve overall wellbeing',
    color: '#52C41A',
    glow: 'rgba(82,196,26,0.25)',
  },
];

export default function GoalPage() {
  const router = useRouter();
  const { data, set } = useOnboarding();
  const [selected, setSelected] = useState<Goal | null>(data.goal);
  const [error, setError] = useState(false);

  function pick(g: Goal) {
    setSelected(g);
    set('goal', g);
    setError(false);
  }

  function handleNext() {
    if (!selected) { setError(true); return; }
    router.push('/onboarding/result');
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-[420px] flex flex-col min-h-screen px-5 pb-8">

        {/* PROGRESS */}
        <div className="pt-5 pb-1 shrink-0">
          <div className="w-full h-[4px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: BLUE }}
              initial={{ width: '66%' }} animate={{ width: '83%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }} />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-400 font-medium">
            <span>Step 5 of 6</span><span>83%</span>
          </div>
        </div>

        {/* TITLE */}
        <motion.div className="mt-10 mb-6 text-center shrink-0"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}>
          <h1 className="text-[26px] font-extrabold text-gray-900">What&apos;s your goal?</h1>
          <p className="text-sm text-gray-400 mt-1">We&apos;ll tailor your plan to match your target</p>
        </motion.div>

        {/* GOAL CARDS */}
        <div className="flex flex-col gap-4 flex-1">
          {GOALS.map((g, i) => {
            const isSelected = selected === g.id;
            return (
              <motion.button
                key={g.id}
                onClick={() => pick(g.id)}
                className="w-full text-left rounded-2xl p-4 border-2 transition-all duration-200"
                style={{
                  borderColor: isSelected ? g.color : '#E5E7EB',
                  background: isSelected ? `${g.color}10` : 'white',
                  boxShadow: isSelected ? `0 8px 30px ${g.glow}` : '0 2px 8px rgba(0,0,0,0.04)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl shrink-0"
                    style={{ background: isSelected ? `${g.color}20` : '#F9FAFB' }}>
                    {g.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-base">{g.title}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{g.subtitle}</div>
                  </div>
                  {/* Checkmark */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ background: g.color }}
                      >✓</motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ERROR */}
        <AnimatePresence>
          {error && (
            <motion.p className="text-center text-sm text-red-500 mt-3"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              Please select a goal to continue.
            </motion.p>
          )}
        </AnimatePresence>

        {/* BUTTONS */}
        <div className="mt-6 shrink-0 flex gap-3">
          <button onClick={() => router.back()}
            className="px-6 py-4 rounded-2xl text-base font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">←</button>
          <motion.button onClick={handleNext}
            whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }}
            className="flex-1 py-4 rounded-2xl text-lg font-bold text-white"
            style={{
              background: selected ? `linear-gradient(135deg, ${BLUE} 0%, #6A8DFF 100%)` : '#D1D9FF',
              boxShadow: selected ? '0 8px 28px rgba(74,108,247,0.4)' : 'none',
              cursor: selected ? 'pointer' : 'not-allowed',
            }}>
            See My Results →
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
