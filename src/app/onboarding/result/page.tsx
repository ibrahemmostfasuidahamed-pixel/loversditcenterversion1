'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useOnboarding, type Goal } from '../OnboardingProvider';

const WHATSAPP = 'https://wa.me/971529033110';

/* ── BMI ── */
function calcBMI(weight: number, height: number) {
  return +(weight / ((height / 100) ** 2)).toFixed(1);
}

type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';
function bmiCategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

/* ── Service recommendation ── */
interface Recommendation {
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  glow: string;
  waMsg: string;
}

function getRecommendation(goal: Goal | null, cat: BMICategory): Recommendation {
  if (goal === 'lose_weight' || cat === 'obese' || cat === 'overweight') {
    return {
      title: 'Fat Burning Sessions',
      subtitle: 'Professional targeted sessions with certified equipment',
      emoji: '🔥',
      color: '#E05C4B',
      glow: 'rgba(224,92,75,0.3)',
      waMsg: 'مرحباً، أريد حجز جلسة حرق دهون احترافية',
    };
  }
  if (goal === 'gain_muscle') {
    return {
      title: 'Nutrition Consulting',
      subtitle: 'Personalised muscle-building plan with Dr. Wael Mousa',
      emoji: '💪',
      color: '#6C8EF5',
      glow: 'rgba(108,142,245,0.3)',
      waMsg: 'مرحباً، أريد استشارة تغذية لبناء العضلات',
    };
  }
  if (goal === 'health') {
    return {
      title: 'Balanced Healthy Meals',
      subtitle: 'Daily fresh meals designed by certified nutritionists',
      emoji: '🥗',
      color: '#4CAF50',
      glow: 'rgba(76,175,80,0.3)',
      waMsg: 'مرحباً، أريد الاشتراك في خطة الوجبات الصحية',
    };
  }
  return {
    title: 'Nutritional Products',
    subtitle: 'Certified supplements to support your health goals',
    emoji: '💊',
    color: '#9B5CF6',
    glow: 'rgba(155,92,246,0.3)',
    waMsg: 'مرحباً، أريد معرفة المنتجات الغذائية المناسبة لي',
  };
}

/* ── BMI display info ── */
const BMI_INFO: Record<BMICategory, { label: string; labelAr: string; color: string; bg: string }> = {
  underweight: { label: 'Underweight', labelAr: 'نقص في الوزن', color: '#F59E0B', bg: '#FEF3C7' },
  normal:      { label: 'Normal',      labelAr: 'وزن طبيعي',    color: '#10B981', bg: '#D1FAE5' },
  overweight:  { label: 'Overweight',  labelAr: 'زيادة في الوزن', color: '#F97316', bg: '#FFEDD5' },
  obese:       { label: 'Obese',       labelAr: 'سمنة',           color: '#EF4444', bg: '#FEE2E2' },
};

/* ── Simple BMI bar ── */
function BMIBar({ bmi }: { bmi: number }) {
  const clamped = Math.min(Math.max(bmi, 10), 40);
  const pct = ((clamped - 10) / 30) * 100;
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
        <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
      </div>
      <div className="relative w-full h-4 rounded-full overflow-hidden" style={{
        background: 'linear-gradient(90deg, #F59E0B 0%, #10B981 30%, #F97316 65%, #EF4444 100%)',
      }}>
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 border-gray-800 shadow-md"
          initial={{ left: 0 }}
          animate={{ left: `calc(${pct}% - 10px)` }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const { data } = useOnboarding();

  const bmi = calcBMI(data.weight, data.height);
  const cat = bmiCategory(bmi);
  const bmiInfo = BMI_INFO[cat];
  const rec = getRecommendation(data.goal, cat);

  const waLink = `${WHATSAPP}?text=${encodeURIComponent(rec.waMsg)}`;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-[420px] flex flex-col min-h-screen px-5 pb-8">

        {/* PROGRESS */}
        <div className="pt-5 pb-1 shrink-0">
          <div className="w-full h-[4px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-green-500"
              initial={{ width: '83%' }} animate={{ width: '100%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }} />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-400 font-medium">
            <span>Your Results</span><span>✓ Complete</span>
          </div>
        </div>

        {/* HEADER */}
        <motion.div className="mt-10 text-center shrink-0"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}>
          <div className="text-5xl mb-3">🎯</div>
          <h1 className="text-[26px] font-extrabold text-gray-900">Your Assessment</h1>
          <p className="text-sm text-gray-400 mt-1">Based on your body metrics</p>
        </motion.div>

        <div className="flex flex-col gap-4 mt-8 flex-1">

          {/* STATS ROW */}
          <motion.div className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}>
            {[
              { label: 'Weight', value: `${data.weight}`, unit: 'kg' },
              { label: 'Height', value: `${data.height}`, unit: 'cm' },
              { label: 'Age', value: `${data.age}`, unit: 'yrs' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-xl font-black text-gray-900">{s.value}<span className="text-xs font-semibold text-gray-400 ml-0.5">{s.unit}</span></div>
                <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* BMI CARD */}
          <motion.div className="rounded-2xl p-5 border-2"
            style={{ borderColor: bmiInfo.color, background: bmiInfo.bg }}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-semibold text-gray-500">Your BMI</div>
                <div className="text-5xl font-black mt-1" style={{ color: bmiInfo.color }}>{bmi}</div>
              </div>
              <div className="px-3 py-1.5 rounded-full text-sm font-bold text-white"
                style={{ background: bmiInfo.color }}>
                {bmiInfo.label}
              </div>
            </div>
            <div className="text-sm font-medium mt-1" style={{ color: bmiInfo.color }}>{bmiInfo.labelAr}</div>
            <BMIBar bmi={bmi} />
          </motion.div>

          {/* RECOMMENDATION */}
          <motion.div className="rounded-2xl p-5 border-2"
            style={{ borderColor: rec.color, background: `${rec.color}08`, boxShadow: `0 8px 32px ${rec.glow}` }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: rec.color }}>
              Our Recommendation For You
            </div>
            <div className="flex items-center gap-3">
              <div className="text-4xl">{rec.emoji}</div>
              <div>
                <div className="font-extrabold text-gray-900 text-lg leading-tight">{rec.title}</div>
                <div className="text-sm text-gray-500 mt-0.5">{rec.subtitle}</div>
              </div>
            </div>
          </motion.div>

          {/* WHATSAPP CTA */}
          <motion.a href={waLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-lg font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 8px 28px rgba(37,211,102,0.4)' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }}>
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.12 1.523 5.854L0 24l6.315-1.501A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.895 0-3.673-.511-5.203-1.402L3 22l1.434-3.724A9.957 9.957 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Book Free Consultation
          </motion.a>

        </div>

        {/* RESTART */}
        <div className="mt-5 shrink-0 flex gap-3">
          <button onClick={() => router.push('/onboarding/gender')}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">
            ↺ Start Over
          </button>
          <a href="/" className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-center text-[#4A6CF7] border-2 border-[#4A6CF7] hover:bg-blue-50 transition-colors">
            Back to Home
          </a>
        </div>

      </div>
    </div>
  );
}
