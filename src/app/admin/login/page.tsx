'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('بيانات الدخول غير صحيحة');
      return;
    }

    // Check if first login
    const res = await fetch('/api/admin/auth/me');
    const data = await res.json();
    if (data.isFirstLogin) {
      router.push('/admin/setup');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)' }}>
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-2xl font-black text-white">Lovers Diet Center</h1>
          <p className="text-white/40 text-sm mt-1">لوحة التحكم الإدارية</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-lg font-bold text-white mb-6 text-center">تسجيل الدخول</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[12px] text-white/50 mb-1.5 block">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@loversdiet.com"
                required
                className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder-white/20 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '44px' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,45,120,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-[12px] text-white/50 mb-1.5 block">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder-white/20 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '44px' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,45,120,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                dir="ltr"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-[13px] text-red-400"
                  style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <span>⚠️</span> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-white font-bold text-[15px] transition-opacity disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #FF2D78, #FF6B35)', minHeight: '48px' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ الدخول...
                </span>
              ) : (
                'تسجيل الدخول / Login'
              )}
            </motion.button>
          </form>

          <p className="text-center text-[11px] text-white/20 mt-6">
            Lovers Diet Center Admin Panel v1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}
