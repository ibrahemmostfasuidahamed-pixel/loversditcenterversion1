'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV = [
  {
    section: 'الرئيسية',
    items: [
      { label: 'Dashboard', labelAr: 'لوحة التحكم', href: '/admin', icon: '⬡', badge: null },
      { label: 'Bookings', labelAr: 'الحجوزات', href: '/admin/bookings', icon: '📅', badge: 'bookings' },
      { label: 'Products', labelAr: 'المنتجات', href: '/admin/products', icon: '🛍️', badge: null },
      { label: 'Messages', labelAr: 'الرسائل', href: '/admin/messages', icon: '💬', badge: 'messages' },
    ],
  },
  {
    section: 'المحتوى',
    items: [
      { label: 'Testimonials', labelAr: 'التقييمات', href: '/admin/testimonials', icon: '⭐', badge: null },
      { label: 'Transformations', labelAr: 'التحولات', href: '/admin/transformations', icon: '🔄', badge: null },
    ],
  },
  {
    section: 'الإدارة',
    items: [
      { label: 'Users', labelAr: 'المستخدمون', href: '/admin/users', icon: '👥', badge: null },
      { label: 'Settings', labelAr: 'الإعدادات', href: '/admin/settings', icon: '⚙️', badge: null },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      style={{
        background: 'var(--bg-surface)',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '-2px 0 20px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        gridRow: '1 / 3',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div style={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '0 16px' : '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        gap: 12,
        flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #FF2D78, #FF6B9D)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, boxShadow: '0 0 15px rgba(255,45,120,0.4)',
        }}>
          🌿
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Lover Diet</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Admin Panel</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: collapsed ? '12px 8px' : '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map((group) => (
          <div key={group.section} style={{ marginBottom: 12 }}>
            {/* Section label */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '4px 12px 6px', marginBottom: 2 }}
                >
                  {group.section}
                </motion.div>
              )}
            </AnimatePresence>

            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <div key={item.href} style={{ position: 'relative' }}>
                  <Link
                    href={item.href}
                    className={`admin-nav-item${active ? ' active' : ''}`}
                    style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                    title={collapsed ? item.labelAr : undefined}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.15 }}
                          style={{ flex: 1, whiteSpace: 'nowrap' }}
                        >
                          {item.labelAr}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer: avatar + logout */}
      <div style={{
        padding: collapsed ? '12px 8px' : '12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%', padding: '8px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)',
            fontSize: 14, marginBottom: 8, transition: 'all 0.2s',
          }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '→' : '← طي'}
        </button>

        {/* Avatar row */}
        <div
          onMouseEnter={() => setShowLogout(true)}
          onMouseLeave={() => setShowLogout(false)}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #FF2D78, #9C27B0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
            }}>
              {initials}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {session?.user?.name || 'Admin'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {(session?.user as { role?: string })?.role || 'admin'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout tooltip */}
          <AnimatePresence>
            {showLogout && (
              <motion.button
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                style={{
                  position: 'absolute', bottom: '110%', left: 0, right: 0,
                  padding: '8px', borderRadius: 10, border: '1px solid rgba(255,23,68,0.25)',
                  background: 'rgba(255,23,68,0.1)', color: '#FF4D6A',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  backdropFilter: 'blur(10px)',
                }}
              >
                🚪 تسجيل الخروج
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
