'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Booking = {
  id: string; name: string; phone: string;
  date: string; time: string; type: string; status: string;
  weight?: number; target?: number; notes?: string;
  email?: string;
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'قيد الانتظار', cls: 'badge-pending' },
  confirmed: { label: 'مؤكد', cls: 'badge-confirmed' },
  done:      { label: 'مكتمل', cls: 'badge-done' },
  cancelled: { label: 'ملغي', cls: 'badge-cancelled' },
};

const FILTERS = ['الكل', 'قيد الانتظار', 'مؤكد', 'مكتمل', 'ملغي'];
const STATUS_KEYS = ['all', 'pending', 'confirmed', 'done', 'cancelled'];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterIdx, setFilterIdx] = useState(0);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const status = STATUS_KEYS[filterIdx];
      const res = await fetch(`/api/admin/bookings${status !== 'all' ? `?status=${status}` : ''}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch { setBookings([]); }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [filterIdx]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await load();
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    setUpdatingId(null);
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('حذف الحجز نهائياً؟')) return;
    await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    await load();
    if (selected?.id === id) setSelected(null);
  };

  const filtered = bookings.filter(b =>
    !search || b.name?.toLowerCase().includes(search.toLowerCase()) || b.phone?.includes(search)
  );

  const ic = 'admin-input';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Cairo', sans-serif" }}>إدارة الحجوزات</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{filtered.length} حجز</p>
        </div>
        <button className="btn-rose">+ حجز جديد</button>
      </div>

      {/* Filter + Search Bar */}
      <div className="admin-card" style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map((f, i) => (
            <button key={f} onClick={() => setFilterIdx(i)} style={{
              padding: '5px 12px', borderRadius: 10, border: '1px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s', fontFamily: "'Cairo', sans-serif",
              background: filterIdx === i ? 'rgba(255,45,120,0.15)' : 'rgba(255,255,255,0.04)',
              borderColor: filterIdx === i ? 'rgba(255,45,120,0.4)' : 'rgba(255,255,255,0.08)',
              color: filterIdx === i ? '#FF2D78' : 'var(--text-muted)',
            }}>{f}</button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 160, position: 'relative' }}>
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14, pointerEvents: 'none' }}>🔍</span>
          <input className={ic} value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الهاتف..." style={{ paddingRight: 36 }} />
        </div>
      </div>

      {/* Main layout: table + detail panel */}
      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Table */}
        <div className="admin-card" style={{ flex: 1, minWidth: 0, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
              <p style={{ fontSize: 13 }}>جارٍ التحميل...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
              <p style={{ fontSize: 13 }}>لا توجد حجوزات</p>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <table className="admin-table">
                <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 1 }}>
                  <tr>
                    <th>المريض</th>
                    <th>التاريخ والوقت</th>
                    <th>النوع</th>
                    <th>الحالة</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => {
                    const s = STATUS_MAP[b.status] || STATUS_MAP.pending;
                    const isUpdating = updatingId === b.id;
                    return (
                      <motion.tr
                        key={b.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setSelected(b)}
                        style={{ cursor: 'pointer', background: selected?.id === b.id ? 'rgba(255,45,120,0.06)' : undefined }}
                      >
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                              background: 'linear-gradient(135deg, rgba(255,45,120,0.25), rgba(156,39,176,0.25))',
                              border: '1px solid rgba(255,45,120,0.2)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, fontWeight: 700, color: '#ff80ab',
                            }}>{b.name?.[0] || '?'}</div>
                            <div>
                              <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{b.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{b.date}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.time}</div>
                        </td>
                        <td>
                          <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600,
                            background: b.type === 'video' ? 'rgba(212,175,55,0.1)' : 'rgba(255,45,120,0.1)',
                            color: b.type === 'video' ? '#D4AF37' : '#FF2D78',
                            border: `1px solid ${b.type === 'video' ? 'rgba(212,175,55,0.25)' : 'rgba(255,45,120,0.25)'}`,
                          }}>
                            {b.type === 'video' ? '🎥 فيديو' : '🏥 حضوري'}
                          </span>
                        </td>
                        <td><span className={s.cls} style={{ opacity: isUpdating ? 0.5 : 1 }}>{s.label}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                            {b.status === 'pending' && (
                              <button onClick={() => updateStatus(b.id, 'confirmed')} style={{
                                padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11,
                                background: 'rgba(41,121,255,0.15)', color: '#5B9BFF', transition: 'all 0.15s',
                              }} disabled={!!updatingId}>✅</button>
                            )}
                            <a href={`https://wa.me/${b.phone}`} target="_blank" rel="noopener noreferrer" style={{
                              padding: '4px 8px', borderRadius: 6, fontSize: 11, textDecoration: 'none',
                              background: 'rgba(37,211,102,0.1)', color: '#25D366', display: 'flex', alignItems: 'center',
                            }}>💬</a>
                            <button onClick={() => deleteBooking(b.id)} style={{
                              padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11,
                              background: 'rgba(255,23,68,0.1)', color: '#FF4D6A', transition: 'all 0.15s',
                            }}>🗑️</button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel - slides in from left */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 30, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 320 }}
              exit={{ opacity: 0, x: 30, width: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="admin-card"
              style={{ flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>تفاصيل الحجز</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Avatar + name */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'linear-gradient(135deg, rgba(255,45,120,0.3), rgba(156,39,176,0.3))',
                    border: '2px solid rgba(255,45,120,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, fontWeight: 700, color: '#ff80ab',
                  }}>{selected.name?.[0]}</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{selected.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{selected.phone}</div>
                  </div>
                </div>

                {/* Info rows */}
                {[
                  { label: 'التاريخ', value: `${selected.date} - ${selected.time}` },
                  { label: 'النوع', value: selected.type === 'video' ? '🎥 استشارة فيديو' : '🏥 حضوري' },
                  { label: 'الحالة', value: STATUS_MAP[selected.status]?.label },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.label}</span>
                    <span style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{r.value}</span>
                  </div>
                ))}

                {/* Status change */}
                <div>
                  <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>تغيير الحالة</label>
                  <select className="admin-input" value={selected.status} onChange={e => {
                    updateStatus(selected.id, e.target.value);
                    setSelected({ ...selected, status: e.target.value });
                  }}>
                    {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k} className="bg-[#0F0F15]">{v.label}</option>)}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>ملاحظات</label>
                  <textarea className="admin-input" rows={3} placeholder="ملاحظاتك..." defaultValue={selected.notes || ''} style={{ resize: 'none', lineHeight: 1.5 }} />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <a
                    href={`https://wa.me/${selected.phone}?text=${encodeURIComponent(`مرحباً ${selected.name}، نود تأكيد موعدك يوم ${selected.date}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      flex: 1, padding: '10px', borderRadius: 12, textAlign: 'center',
                      background: 'rgba(37,211,102,0.15)', color: '#25D366',
                      border: '1px solid rgba(37,211,102,0.25)', textDecoration: 'none',
                      fontSize: 12, fontWeight: 700,
                    }}
                  >💬 واتساب</a>
                  <button
                    onClick={() => deleteBooking(selected.id)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: 12, border: '1px solid rgba(255,23,68,0.25)',
                      background: 'rgba(255,23,68,0.1)', color: '#FF4D6A',
                      cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                    }}
                  >🗑️ حذف</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
