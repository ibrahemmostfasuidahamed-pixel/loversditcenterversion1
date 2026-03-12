'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BookingFormData } from '@/types/booking';

const SERVICES = [
  { id: 'meals', icon: '🍽️', nameAr: 'وجبات صحية متوازنة', priceAr: 'من 99 درهم/أسبوع' },
  { id: 'consultation', icon: '🌿', nameAr: 'استشارة غذائية متخصصة', priceAr: 'مجانية - أول مرة' },
  { id: 'fatburn', icon: '💪', nameAr: 'جلسة تكسير دهون احترافية', priceAr: 'من 199 درهم/جلسة' },
  { id: 'supplements', icon: '💊', nameAr: 'استشارة مكملات غذائية', priceAr: 'مجانية' },
];

const WEIGHT_GOALS = [
  'خسارة الوزن',
  'زيادة الكتلة العضلية',
  'الحفاظ على الوزن',
  'تحسين التغذية',
  'علاج مشكلة صحية',
];

const ALL_TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function generateDates(count: number) {
  const dates = [];
  const dayNames = ['أحد', 'إثن', 'ثلا', 'أربع', 'خمي', 'جمع', 'سبت'];
  const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  for (let i = 1; i <= count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const isFriday = d.getDay() === 5;
    dates.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      month: monthNames[d.getMonth()],
      unavailable: isFriday,
    });
  }
  return dates;
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-6 px-4">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center gap-1">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
              s < step
                ? 'bg-[#2E7D32] text-white'
                : s === step
                ? 'bg-[#2E7D32] text-white scale-110 shadow-[0_0_12px_rgba(46,125,50,0.5)]'
                : 'bg-white/10 text-white/40'
            }`}
          >
            {s < step ? '✓' : s}
          </div>
          {s < 4 && (
            <div className={`w-8 h-[2px] rounded-full transition-colors duration-300 ${s < step ? 'bg-[#2E7D32]' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function StepService({ formData, setFormData }: { formData: BookingFormData; setFormData: (f: BookingFormData) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[15px] font-bold text-white/80 mb-4">ماذا تريد أن تحجز؟</h3>
      {SERVICES.map((s) => {
        const selected = formData.serviceId === s.id;
        return (
          <motion.button
            key={s.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFormData({ ...formData, serviceId: s.id, serviceName: s.nameAr })}
            className={`w-full p-4 rounded-[14px] border-[1.5px] text-right flex items-center justify-between transition-all duration-200 ${
              selected
                ? 'border-[#2E7D32] bg-[rgba(46,125,50,0.1)]'
                : 'border-transparent bg-white/[0.04] hover:bg-white/[0.07]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div className="text-right">
                <p className="text-[14px] font-bold text-white">{s.nameAr}</p>
                <p className="text-[11px] text-[#81C784]">{s.priceAr}</p>
              </div>
            </div>
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-[#2E7D32] flex items-center justify-center"
              >
                <span className="text-white text-[12px]">✓</span>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function StepDateTime({
  formData,
  setFormData,
  availableSlots,
}: {
  formData: BookingFormData;
  setFormData: (f: BookingFormData) => void;
  availableSlots: string[];
}) {
  const dates = useMemo(() => generateDates(14), []);

  return (
    <div className="space-y-6">
      <h3 className="text-[15px] font-bold text-white/80">متى تريد الحجز؟</h3>

      {/* Date picker */}
      <div className="overflow-x-auto pb-2 -mx-1 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
        <div className="flex gap-2 px-1 w-max">
          {dates.map((d) => {
            const selected = formData.date === d.dateStr;
            return (
              <motion.button
                key={d.dateStr}
                whileTap={{ scale: 0.95 }}
                disabled={d.unavailable}
                onClick={() => setFormData({ ...formData, date: d.dateStr, time: '' })}
                className={`flex flex-col items-center justify-center w-[60px] h-[70px] rounded-2xl text-center transition-all duration-200 shrink-0
                  ${d.unavailable ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                  ${selected ? 'bg-gradient-to-b from-[#2E7D32] to-[#1B5E20] text-white shadow-[0_0_15px_rgba(46,125,50,0.4)]' : 'bg-white/[0.05] text-white/70'}
                `}
                style={{ scrollSnapAlign: 'start' }}
              >
                <span className="text-[10px] font-medium">{d.dayName}</span>
                <span className="text-[18px] font-black leading-tight">{d.dayNum}</span>
                <span className="text-[9px] opacity-70">{d.month}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {formData.date && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[13px] text-white/60 mb-3">اختر الوقت المناسب</p>
          <div className="grid grid-cols-3 gap-2">
            {ALL_TIME_SLOTS.map((slot) => {
              const available = availableSlots.includes(slot);
              const selected = formData.time === slot;
              const hour = parseInt(slot);
              const period = hour < 12 ? 'ص' : 'م';
              return (
                <motion.button
                  key={slot}
                  whileTap={available ? { scale: 0.95 } : undefined}
                  disabled={!available}
                  onClick={() => available && setFormData({ ...formData, time: slot })}
                  className={`py-3 rounded-xl text-center transition-all duration-200
                    ${!available ? 'opacity-30 cursor-not-allowed line-through' : 'cursor-pointer'}
                    ${selected ? 'bg-[#2E7D32] text-white shadow-[0_0_12px_rgba(46,125,50,0.3)]' : 'bg-white/[0.05] text-white/70 border border-white/10'}
                  `}
                >
                  <span className="text-[14px] font-bold">{slot}</span>
                  <span className="text-[10px] block opacity-70">{period}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StepPersonalInfo({
  formData,
  setFormData,
  errors,
}: {
  formData: BookingFormData;
  setFormData: (f: BookingFormData) => void;
  errors: Record<string, string>;
}) {
  const inputClass = (field: string) =>
    `w-full bg-white/[0.06] border ${
      errors[field] ? 'border-red-500' : 'border-white/10 focus:border-[#2E7D32]'
    } rounded-xl px-4 py-[14px] text-[15px] text-white placeholder-white/30 outline-none transition-all focus:shadow-[0_0_0_3px_rgba(46,125,50,0.2)]`;

  return (
    <div className="space-y-4">
      <h3 className="text-[15px] font-bold text-white/80 mb-2">أخبرنا عنك</h3>

      <div>
        <label className="text-[12px] text-white/50 mb-1 block">الاسم الكامل *</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="أحمد محمد"
          className={inputClass('fullName')}
          style={{ minHeight: '44px' }}
        />
        {errors.fullName && <p className="text-red-400 text-[11px] mt-1">{errors.fullName}</p>}
      </div>

      <div>
        <label className="text-[12px] text-white/50 mb-1 block">رقم الهاتف *</label>
        <div className="relative">
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-white/50">🇦🇪 +971</span>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="50 000 0000"
            className={`${inputClass('phone')} pr-24`}
            style={{ minHeight: '44px' }}
            dir="ltr"
          />
        </div>
        {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="text-[12px] text-white/50 mb-1 block">البريد الإلكتروني</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="example@email.com"
          className={inputClass('email')}
          style={{ minHeight: '44px' }}
          dir="ltr"
        />
      </div>

      <div>
        <label className="text-[12px] text-white/50 mb-1 block">هدفك الصحي</label>
        <select
          value={formData.weightGoal}
          onChange={(e) => setFormData({ ...formData, weightGoal: e.target.value })}
          className={`${inputClass('weightGoal')} appearance-none`}
          style={{ minHeight: '44px' }}
        >
          <option value="" className="bg-[#0a0f0a]">اختر هدفك...</option>
          {WEIGHT_GOALS.map((g) => (
            <option key={g} value={g} className="bg-[#0a0f0a]">{g}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[12px] text-white/50 mb-1 block">ملاحظات إضافية (اختياري)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="أي معلومات مهمة عن حالتك الصحية..."
          rows={3}
          className={inputClass('notes')}
        />
      </div>
    </div>
  );
}

function StepConfirmation({ formData }: { formData: BookingFormData }) {
  const service = SERVICES.find((s) => s.id === formData.serviceId);
  const dateObj = new Date(formData.date);
  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  return (
    <div className="space-y-5">
      <h3 className="text-[15px] font-bold text-white/80">تأكيد موعدك</h3>

      <div className="bg-white/[0.04] rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <span className="text-[13px] text-white/60">📋 ملخص الحجز</span>
        </div>
        <div className="p-4 space-y-3">
          {[
            { label: 'الخدمة', value: `${service?.icon} ${service?.nameAr}` },
            { label: 'التاريخ', value: `${dayNames[dateObj.getDay()]} ${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}` },
            { label: 'الوقت', value: `${formData.time} ${parseInt(formData.time) < 12 ? 'صباحاً' : 'مساءً'}` },
            { label: 'الاسم', value: formData.fullName },
            { label: 'الهاتف', value: formData.phone },
          ].map((row, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-[12px] text-white/50">{row.label}</span>
              <span className="text-[13px] text-white font-medium">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex justify-between">
            <span className="text-[12px] text-white/50">💰 الرسوم</span>
            <span className="text-[13px] text-[#81C784] font-bold">{service?.priceAr}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[12px] text-white/50">📍 المكان</span>
            <span className="text-[13px] text-white">العيادة / أونلاين</span>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
        <p className="text-[11px] text-white/40 leading-relaxed">
          ⚠️ سياسة الإلغاء: يجب الإلغاء قبل 24 ساعة من الموعد
        </p>
      </div>
    </div>
  );
}

function SuccessScreen({ bookingRef, onClose }: { bookingRef: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'موعد Lovers Diet Center',
        text: `تم حجز موعدي بنجاح!\nرقم الحجز: ${bookingRef}`,
        url: window.location.href,
      });
    }
  };

  const handleCalendar = () => {
    const event = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:موعد Lovers Diet Center\nDESCRIPTION:رقم الحجز ${bookingRef}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([event], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'booking.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-8 px-4 min-h-[60vh]">
      {/* Animated checkmark */}
      <div className="relative w-20 h-20 mb-6">
        <svg className="w-20 h-20" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#2E7D32" strokeWidth="3" className="animate-[drawCircle_0.6s_ease-out_forwards]" style={{ strokeDasharray: 226, strokeDashoffset: 226, animation: 'drawCircle 0.6s ease-out forwards' }} />
          <path d="M24 40 L35 51 L56 30" fill="none" stroke="#81C784" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 50, strokeDashoffset: 50, animation: 'drawCheck 0.4s ease-out 0.5s forwards' }} />
        </svg>
      </div>

      <h2 className="text-[22px] font-black gradient-text mb-3">تم الحجز بنجاح! 🎉</h2>

      <div className="bg-white/[0.06] rounded-xl px-5 py-3 mb-4 border border-white/10">
        <p className="text-[11px] text-white/50 mb-1">رقم الحجز</p>
        <p className="text-[16px] font-mono font-bold text-[#81C784]">{bookingRef}</p>
      </div>

      <p className="text-[13px] text-white/60 mb-8">سيتم التواصل معك خلال ساعة</p>

      <div className="flex gap-3 w-full max-w-xs">
        <button onClick={handleCalendar} className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-[13px] text-white font-medium" style={{ minHeight: '44px' }}>
          📅 أضف للتقويم
        </button>
        <button onClick={handleShare} className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-[13px] text-white font-medium" style={{ minHeight: '44px' }}>
          📤 شارك الموعد
        </button>
      </div>

      <button onClick={onClose} className="mt-6 text-[13px] text-white/40 underline">إغلاق</button>

      <style jsx>{`
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </motion.div>
  );
}

export default function BookingSheet({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>(ALL_TIME_SLOTS);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: '',
    serviceName: '',
    date: '',
    time: '',
    fullName: '',
    phone: '',
    email: '',
    weightGoal: '',
    notes: '',
  });

  // Fetch available slots when date changes
  useEffect(() => {
    if (!formData.date) return;
    fetch(`/api/bookings?date=${formData.date}`)
      .then((r) => r.json())
      .then((d) => setAvailableSlots(d.slots || ALL_TIME_SLOTS))
      .catch(() => setAvailableSlots(ALL_TIME_SLOTS));
  }, [formData.date]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 1: return !!formData.serviceId;
      case 2: return !!formData.date && !!formData.time;
      case 3: return formData.fullName.length >= 3 && formData.phone.length >= 7;
      case 4: return true;
      default: return false;
    }
  }, [step, formData]);

  const validateStep3 = useCallback(() => {
    const errs: Record<string, string> = {};
    if (formData.fullName.length < 3) errs.fullName = 'الاسم يجب أن يكون 3 أحرف على الأقل';
    if (formData.phone.length < 7) errs.phone = 'رقم هاتف غير صالح';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData]);

  const handleNext = useCallback(() => {
    if (step === 3 && !validateStep3()) return;
    if (step < 4) setStep(step + 1);
  }, [step, validateStep3]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setBookingRef(data.bookingRef);
      setStep(5);
    } catch {
      setError('حدث خطأ. تحقق من الاتصال وحاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const slideDirection = 1;

  return (
    <div className="fixed inset-0 z-[9500]">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="fixed bottom-0 left-0 right-0 flex flex-col overflow-hidden"
        style={{
          height: '92vh',
          borderRadius: '28px 28px 0 0',
          background: 'rgba(10,15,10,0.97)',
          backdropFilter: 'blur(60px)',
          borderTop: '1px solid rgba(46,125,50,0.3)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-[14px]" style={{ minHeight: '44px', minWidth: '44px' }}>✕</button>
          <h2 className="text-[16px] font-bold text-white">حجز موعد جديد</h2>
          <div className="w-8" />
        </div>

        {step <= 4 && <ProgressBar step={step} />}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-32" style={{ WebkitOverflowScrolling: 'touch' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 100 * slideDirection, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100 * slideDirection, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <StepService formData={formData} setFormData={setFormData} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 100 * slideDirection, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100 * slideDirection, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <StepDateTime formData={formData} setFormData={setFormData} availableSlots={availableSlots} />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 100 * slideDirection, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100 * slideDirection, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <StepPersonalInfo formData={formData} setFormData={setFormData} errors={fieldErrors} />
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="s4" initial={{ x: 100 * slideDirection, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100 * slideDirection, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <StepConfirmation formData={formData} />
              </motion.div>
            )}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SuccessScreen bookingRef={bookingRef} onClose={onClose} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed bottom button area */}
        {step <= 4 && (
          <div
            className="sticky bottom-0 px-5 pt-4 pb-4"
            style={{
              paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
              background: 'linear-gradient(to top, rgba(10,15,10,1) 80%, transparent)',
            }}
          >
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[12px] text-center mb-3">
                {error}
              </motion.p>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="py-3.5 px-5 rounded-xl bg-white/[0.06] border border-white/10 text-[14px] text-white font-medium"
                  style={{ minHeight: '44px' }}
                >
                  رجوع
                </button>
              )}

              <motion.button
                whileTap={canProceed ? { scale: 0.97 } : undefined}
                onClick={step === 4 ? handleSubmit : handleNext}
                disabled={!canProceed || loading}
                className={`flex-1 py-3.5 rounded-xl text-[14px] font-bold transition-all ${
                  canProceed && !loading
                    ? 'bg-gradient-to-r from-[#2E7D32] to-[#81C784] text-white shadow-[0_4px_20px_rgba(46,125,50,0.4)]'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
                style={{ minHeight: '44px' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جارٍ الحجز...
                  </span>
                ) : step === 4 ? (
                  '✓ تأكيد الحجز'
                ) : (
                  'التالي'
                )}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
