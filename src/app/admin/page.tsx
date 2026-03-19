'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import TiltCard from '@/components/admin/TiltCard';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import MiniSparkline from '@/components/admin/MiniSparkline';

// =====================  MOCK DATA (replace with real API calls)  =====================
const BOOKING_TREND = [
  { day: 'السبت', count: 4 },
  { day: 'الأحد', count: 7 },
  { day: 'الاثنين', count: 5 },
  { day: 'الثلاثاء', count: 9 },
  { day: 'الأربعاء', count: 6 },
  { day: 'الخميس', count: 12 },
  { day: 'الجمعة', count: 8 },
];

const PIE_DATA = [
  { name: 'حضوري', value: 42, color: '#FF2D78' },
  { name: 'فيديو', value: 28, color: '#D4AF37' },
  { name: 'قيد الانتظار', value: 18, color: '#2979FF' },
];

const RECENT_BOOKINGS = [
  { id: '1', name: 'سارة أحمد', phone: '0529033110', type: 'حضوري', status: 'pending', date: '2026-03-14', time: '10:00' },
  { id: '2', name: 'محمد عبدالله', phone: '0551234567', type: 'فيديو', status: 'confirmed', date: '2026-03-14', time: '11:30' },
  { id: '3', name: 'فاطمة علي', phone: '0509876543', type: 'حضوري', status: 'done', date: '2026-03-13', time: '14:00' },
  { id: '4', name: 'نور خالد', phone: '0561234567', type: 'فيديو', status: 'cancelled', date: '2026-03-13', time: '16:00' },
  { id: '5', name: 'ريم مطلق', phone: '0543216789', type: 'حضوري', status: 'confirmed', date: '2026-03-15', time: '09:00' },
];

const ACTIVITY = [
  { id: 1, icon: '📅', text: 'سارة أحمد حجزت استشارة حضورية', time: 'منذ 3 دقائق', color: '#FF2D78' },
  { id: 2, icon: '💬', text: 'رسالة جديدة من محمد عبدالله', time: 'منذ 8 دقائق', color: '#2979FF' },
  { id: 3, icon: '⭐', text: 'تقييم جديد 5 نجوم من فاطمة', time: 'منذ 22 دقيقة', color: '#D4AF37' },
  { id: 4, icon: '✅', text: 'تم تأكيد حجز ريم مطلق', time: 'منذ 35 دقيقة', color: '#00E676' },
  { id: 5, icon: '🛍️', text: 'تم تحديث منتج: برنامج رجيم 30 يوم', time: 'منذ ساعة', color: '#FFA726' },
  { id: 6, icon: '📅', text: 'نور خالد حجزت استشارة فيديو', time: 'منذ ساعتين', color: '#FF2D78' },
];

const SPARKLINES = {
  bookings: [3, 5, 4, 7, 6, 9, 8, 12, 10, 14],
  products: [10, 10, 12, 11, 13, 12, 15, 14, 16, 16],
  messages: [2, 4, 3, 6, 4, 8, 5, 7, 9, 6],
  revenue: [1200, 1800, 1500, 2200, 1900, 2800, 2400, 3100, 2600, 3400],
};

// =====================  STATUS BADGE  =====================
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'قيد الانتظار', cls: 'badge-pending' },
  confirmed: { label: 'مؤكد', cls: 'badge-confirmed' },
  done:      { label: 'مكتمل', cls: 'badge-done' },
  cancelled: { label: 'ملغي', cls: 'badge-cancelled' },
};

// =====================  CUSTOM CHART TOOLTIP  =====================
const GlassTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0F0F15', border: '1px solid rgba(255,45,120,0.3)', borderRadius: 12,
      padding: '8px 12px', fontSize: 12, color: '#fff', direction: 'rtl',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 2, fontSize: 10 }}>{label}</div>
      <div style={{ color: '#FF2D78', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", fontSize: 20 }}>
        {payload[0].value}
      </div>
    </div>
  );
};

const chartColors = {
  grid: 'rgba(255,255,255,0.03)',
  axis: '#404055',
  rose: '#FF2D78',
};

// =====================  STAT CARD  =====================
interface StatCardProps {
  icon: string;
  value: number;
  label: string;
  change: string;
  positive: boolean;
  accent: 'rose' | 'gold' | 'blue' | 'green';
  sparkData: number[];
  prefix?: string;
  suffix?: string;
  delay?: number;
}

function StatCard({ icon, value, label, change, positive, accent, sparkData, prefix='', suffix='', delay=0 }: StatCardProps) {
  const colors: Record<string, string> = { rose:'#FF2D78', gold:'#D4AF37', blue:'#2979FF', green:'#00E676' };
  const accentBg: Record<string, string> = {
    rose: 'rgba(255,45,120,0.08)',
    gold: 'rgba(212,175,55,0.08)',
    blue: 'rgba(41,121,255,0.08)',
    green: 'rgba(0,230,118,0.08)',
  };

  return (
    <TiltCard accent={accent} style={{
      padding: 20, display: 'flex', flexDirection: 'column', gap: 10,
      background: `linear-gradient(135deg, ${accentBg[accent]}, rgba(255,255,255,0.02))`,
      height: '100%',
    }}>
      {/* Icon + change */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${colors[accent]}20`, fontSize: 20,
          boxShadow: `0 0 15px ${colors[accent]}30`,
        }}>{icon}</div>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: positive ? '#00E676' : '#FF1744',
          background: positive ? 'rgba(0,230,118,0.1)' : 'rgba(255,23,68,0.1)',
          border: `1px solid ${positive ? 'rgba(0,230,118,0.2)' : 'rgba(255,23,68,0.2)'}`,
          borderRadius: 999, padding: '2px 8px',
        }}>
          {positive ? '▲' : '▼'} {change}
        </span>
      </div>
      {/* Value */}
      <div>
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} size="38px" />
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontFamily: "'Cairo', sans-serif" }}>{label}</p>
      </div>
      {/* Sparkline */}
      <div style={{ marginTop: 'auto' }}>
        <MiniSparkline data={sparkData} color={colors[accent]} height={32} />
      </div>
    </TiltCard>
  );
}

// =====================  PAGE  =====================
export default function AdminDashboard() {
  const [timeFilter, setTimeFilter] = useState('7D');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1400, margin: '0 auto' }}>
      {/* ─── HEADER ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: "'Cairo', sans-serif", margin: 0 }}>
            مرحباً بك 👋
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            إليك نظرة عامة على أداء اليوم
          </p>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '6px 12px' }}>
          {new Date().toLocaleDateString('ar-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* ─── STAT CARDS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard icon="📅" value={24} label="الحجوزات هذا الشهر" change="+12%" positive={true} accent="rose" sparkData={SPARKLINES.bookings} delay={0} />
        <StatCard icon="🛍️" value={16} label="المنتجات النشطة" change="+3" positive={true} accent="gold" sparkData={SPARKLINES.products} delay={0.08} suffix=" منتج" />
        <StatCard icon="💬" value={7} label="رسائل غير مقروءة" change="+2" positive={false} accent="blue" sparkData={SPARKLINES.messages} delay={0.16} />
        <StatCard icon="💰" value={18400} label="الإيرادات هذا الشهر" change="+8%" positive={true} accent="green" sparkData={SPARKLINES.revenue} delay={0.24} suffix=" د.إ" />
      </div>

      {/* ─── CHARTS ROW ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Area chart */}
        <div className="admin-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>تريند الحجوزات</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>آخر {timeFilter}</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['7D', '30D', '3M', '1Y'].map(f => (
                <button key={f} onClick={() => setTimeFilter(f)} style={{
                  padding: '4px 10px', borderRadius: 8, border: '1px solid', fontSize: 11, cursor: 'pointer', fontWeight: 600,
                  background: timeFilter === f ? 'rgba(255,45,120,0.15)' : 'rgba(255,255,255,0.04)',
                  borderColor: timeFilter === f ? 'rgba(255,45,120,0.4)' : 'rgba(255,255,255,0.08)',
                  color: timeFilter === f ? '#FF2D78' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                }}>{f}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={BOOKING_TREND} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF2D78" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#FF2D78" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" />
              <XAxis dataKey="day" tick={{ fill: chartColors.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: chartColors.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<GlassTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#FF2D78" strokeWidth={2} fill="url(#roseGrad)" dot={false} activeDot={{ r: 4, fill: '#FF2D78', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="admin-card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>أنواع الحجوزات</h3>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" stroke="none">
                  {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0F0F15', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center total */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#fff', lineHeight: 1 }}>
                {PIE_DATA.reduce((a, b) => a + b.value, 0)}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>إجمالي</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
            {PIE_DATA.map(d => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: "'Bebas Neue', sans-serif" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TABLES ROW ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        {/* Recent bookings table */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>آخر الحجوزات</h3>
            <a href="/admin/bookings" style={{ fontSize: 11, color: 'var(--rose)', textDecoration: 'none' }}>عرض الكل ←</a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>المريض</th>
                  <th>التاريخ</th>
                  <th>النوع</th>
                  <th>الحالة</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_BOOKINGS.map((b, i) => {
                  const s = STATUS_MAP[b.status];
                  return (
                    <motion.tr key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                            background: 'linear-gradient(135deg, rgba(255,45,120,0.3), rgba(156,39,176,0.3))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700, color: '#fff',
                          }}>
                            {b.name[0]}
                          </div>
                          <span style={{ fontSize: 13, color: '#fff', whiteSpace: 'nowrap' }}>{b.name}</span>
                        </div>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{b.date} · {b.time}</td>
                      <td>
                        <span style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 999,
                          background: b.type === 'حضوري' ? 'rgba(255,45,120,0.1)' : 'rgba(212,175,55,0.1)',
                          color: b.type === 'حضوري' ? '#FF2D78' : '#D4AF37',
                          border: `1px solid ${b.type === 'حضوري' ? 'rgba(255,45,120,0.2)' : 'rgba(212,175,55,0.2)'}`,
                        }}>{b.type}</span>
                      </td>
                      <td><span className={s.cls}>{s.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button style={{
                            padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11,
                            background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)',
                            transition: 'all 0.15s',
                          }} title="عرض">👁</button>
                          <a href={`https://wa.me/${b.phone}`} target="_blank" rel="noopener noreferrer" style={{
                            padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11,
                            background: 'rgba(37,211,102,0.1)', color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center',
                          }} title="واتساب">💬</a>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>آخر النشاطات</h3>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E676', boxShadow: '0 0 8px #00E676', animation: 'pulse 2s infinite' }} title="تحديث تلقائي" />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {ACTIVITY.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} style={{
                display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer',
                transition: 'background 0.15s', marginBottom: 4,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{a.text}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{a.time}</p>
                </div>
                <div style={{ width: 1, flexShrink: 0, background: `${a.color}40`, borderRadius: 1, margin: '2px 0' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
