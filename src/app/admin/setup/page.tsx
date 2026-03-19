'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminSetupPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) { setError('كلمات المرور غير متطابقة'); return; }
    if (newPassword.length < 8) { setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return; }

    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword, email: adminEmail, name: adminName }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) { setError(data.error); return; }
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-6"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)' }}>
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-2xl font-black text-white">إعداد الحساب الأول</h1>
          <p className="text-white/40 text-sm mt-1">يرجى تعيين بيانات آمنة قبل المتابعة</p>
        </div>

        <div className="rounded-2xl p-8 space-y-4" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <form onSubmit={handleSetup} className="space-y-4">
            {[
              { label: 'اسمك الكامل', value: adminName, set: setAdminName, type: 'text', placeholder: 'مثال: أحمد علي' },
              { label: 'بريدك الإلكتروني', value: adminEmail, set: setAdminEmail, type: 'email', placeholder: 'admin@loversdiet.com' },
              { label: 'كلمة المرور الجديدة', value: newPassword, set: setNewPassword, type: 'password', placeholder: '8 أحرف على الأقل' },
              { label: 'تأكيد كلمة المرور', value: confirm, set: setConfirm, type: 'password', placeholder: 'أعد كتابة كلمة المرور' },
            ].map((field, i) => (
              <div key={i}>
                <label className="text-[12px] text-white/50 mb-1.5 block">{field.label}</label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={e => field.set(e.target.value)}
                  placeholder={field.placeholder}
                  required
                  className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder-white/20 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '44px' }}
                  dir="ltr"
                />
              </div>
            ))}

            {error && (
              <div className="px-4 py-3 rounded-xl text-[13px] text-red-400" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                ⚠️ {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[15px] transition-opacity disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #FF2D78, #FF6B35)', minHeight: '48px' }}
            >
              {loading ? 'جارٍ الحفظ...' : 'حفظ وإكمال الإعداد'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
