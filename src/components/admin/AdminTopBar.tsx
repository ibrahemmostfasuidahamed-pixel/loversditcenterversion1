'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

const PAGE_LABELS: Record<string, string> = {
  '/admin': 'لوحة التحكم',
  '/admin/bookings': 'الحجوزات',
  '/admin/products': 'المنتجات',
  '/admin/messages': 'الرسائل',
  '/admin/testimonials': 'التقييمات',
  '/admin/transformations': 'التحولات',
  '/admin/users': 'المستخدمون',
  '/admin/settings': 'الإعدادات',
};

const NOTIFICATIONS = [
  { id: 1, type: '📅', text: 'حجز جديد من سارة أحمد', time: 'منذ 3 دقائق', color: '#FF2D78' },
  { id: 2, type: '💬', text: 'رسالة جديدة من محمد علي', time: 'منذ 10 دقائق', color: '#2979FF' },
  { id: 3, type: '⭐', text: 'تقييم جديد 5 نجوم', time: 'منذ 20 دقيقة', color: '#D4AF37' },
  { id: 4, type: '🛍️', text: 'مخزون منخفض: برنامج رجيم', time: 'منذ ساعة', color: '#FFA726' },
];

export default function AdminTopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState('');
  const [unread, setUnread] = useState(NOTIFICATIONS.length);

  const pageTitle = PAGE_LABELS[pathname] || 'لوحة التحكم';

  return (
    <header className="admin-topbar" style={{ gridColumn: 2, gridRow: 1 }}>
      {/* Left: Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Admin /</span>
        <h1 style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Cairo, sans-serif' }}>
          {pageTitle}
        </h1>
      </div>

      {/* Center: Search */}
      <div style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)', pointerEvents: 'none' }}>🔍</span>
        <input
          className="admin-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث... (Cmd+K)"
          style={{ paddingRight: 36, paddingLeft: 60, borderRadius: 12 }}
        />
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: 10, color: 'var(--text-muted)',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4, padding: '1px 5px', fontFamily: 'monospace',
        }}>⌘K</span>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {/* Site link */}
        <Link
          href="/"
          target="_blank"
          style={{
            fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none',
            padding: '5px 10px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.03)',
            transition: 'all 0.2s', display: 'none',
          }}
          className="hide-mobile"
        >
          🌐 الموقع
        </Link>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); setUnread(0); }}
            style={{
              position: 'relative', width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
              fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            🔔
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: '50%',
                background: 'var(--rose)', border: '1.5px solid var(--bg-void)',
                animation: 'pulse 2s infinite',
              }} />
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowNotifs(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute', top: 44, left: 0, width: 320, zIndex: 50,
                    background: '#0F0F15', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                  }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>الإشعارات</span>
                    <span style={{ fontSize: 10, color: 'var(--rose)', cursor: 'pointer' }}>مسح الكل</span>
                  </div>
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} style={{
                      padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'flex-start',
                      borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{
                        width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${n.color}18`, fontSize: 14, flexShrink: 0,
                      }}>{n.type}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>{n.text}</p>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #FF2D78, #9C27B0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer',
        }}>
          {session?.user?.name?.[0]?.toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}
