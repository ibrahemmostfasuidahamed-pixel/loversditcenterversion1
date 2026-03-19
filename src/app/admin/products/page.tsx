'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard from '@/components/admin/TiltCard';

type Product = {
  id: string; nameEn: string; nameAr: string; price: number;
  category: string; stock: number; featured: boolean; isActive: boolean; mainImage?: string;
};

const CATEGORIES = ['supplements', 'meal_plans', 'devices', 'other'];
const CAT_LABELS: Record<string, string> = { supplements: 'مكملات', meal_plans: 'وجبات', devices: 'أجهزة', other: 'أخرى' };
const CAT_COLORS: Record<string, string> = { supplements: '#FF2D78', meal_plans: '#D4AF37', devices: '#2979FF', other: '#00E676' };
const EMPTY: Omit<Product, 'id'> = { nameEn: '', nameAr: '', price: 0, category: 'supplements', stock: 0, featured: false, isActive: true, mainImage: '' };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const r = await fetch('/api/admin/products'); const d = await r.json(); setProducts(d.products || []); } catch { setProducts([]); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ nameEn: p.nameEn, nameAr: p.nameAr, price: p.price, category: p.category, stock: p.stock, featured: p.featured, isActive: p.isActive, mainImage: p.mainImage }); setShowForm(true); };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    await load(); setSaving(false); setShowForm(false);
  };
  const del = async (id: string) => {
    if (!confirm('حذف المنتج؟')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' }); await load();
  };

  const lg = (label: string) => (
    <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>{label}</label>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Cairo', sans-serif" }}>المنتجات</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{products.length} منتج</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['grid', 'table'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 18,
                background: view === v ? 'rgba(255,45,120,0.15)' : 'transparent',
                color: view === v ? '#FF2D78' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}>{v === 'grid' ? '⊞' : '☰'}</button>
            ))}
          </div>
          <button className="btn-rose" onClick={openAdd}>+ منتج جديد</button>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {loading ? (
            [...Array(8)].map((_, i) => <div key={i} className="shimmer" style={{ height: 260, borderRadius: 20 }} />)
          ) : products.map((p, i) => {
            const cc = CAT_COLORS[p.category] || '#FF2D78';
            return (
              <TiltCard key={p.id} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                {/* Image */}
                <div style={{ height: 140, position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                  {p.mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.mainImage} alt={p.nameAr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, opacity: 0.3 }}>🛍️</div>
                  )}
                  {/* Category badge */}
                  <span style={{
                    position: 'absolute', top: 8, right: 8, fontSize: 10, padding: '3px 8px', borderRadius: 999,
                    background: `${cc}20`, color: cc, border: `1px solid ${cc}40`, fontWeight: 700,
                  }}>{CAT_LABELS[p.category]}</span>
                  {/* Featured star */}
                  {p.featured && <span style={{ position: 'absolute', top: 8, left: 8, fontSize: 14 }}>⭐</span>}
                  {/* Stock dot */}
                  <div style={{
                    position: 'absolute', bottom: 8, left: 8, display: 'flex', alignItems: 'center', gap: 4,
                    background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 999, backdropFilter: 'blur(8px)',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.stock > 0 ? '#00E676' : '#FF1744' }} />
                    <span style={{ fontSize: 9, color: '#fff' }}>{p.stock > 0 ? `${p.stock} متاح` : 'نفد'}</span>
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding: '12px 14px' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 2px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.nameAr}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 10px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.nameEn}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#FF2D78', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}>{p.price} AED</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(p)} style={{
                      flex: 1, padding: '6px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: 12, transition: 'all 0.15s', fontFamily: 'inherit',
                    }}>✏️ تعديل</button>
                    <button onClick={() => del(p.id)} style={{
                      flex: 1, padding: '6px', borderRadius: 8, border: '1px solid rgba(255,23,68,0.2)',
                      background: 'rgba(255,23,68,0.08)', color: '#FF4D6A',
                      cursor: 'pointer', fontSize: 12, transition: 'all 0.15s', fontFamily: 'inherit',
                    }}>🗑️ حذف</button>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && !loading && (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 1 }}>
              <tr><th>المنتج</th><th>الفئة</th><th>السعر</th><th>المخزن</th><th>الحالة</th><th>إجراء</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                        {p.mainImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.mainImage} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
                        ) : '🛍️'}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{p.nameAr}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.nameEn}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: `${CAT_COLORS[p.category]}15`, color: CAT_COLORS[p.category], border: `1px solid ${CAT_COLORS[p.category]}30` }}>
                      {CAT_LABELS[p.category]}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'Bebas Neue'", fontSize: 15, color: '#FF2D78' }}>{p.price} AED</td>
                  <td style={{ color: p.stock > 0 ? '#00E676' : '#FF4D6A' }}>{p.stock > 0 ? p.stock : 'نفد'}</td>
                  <td>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: p.isActive ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.05)', color: p.isActive ? '#00E676' : 'var(--text-muted)', border: `1px solid ${p.isActive ? 'rgba(0,230,118,0.2)' : 'rgba(255,255,255,0.1)'}` }}>
                      {p.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => openEdit(p)} style={{ padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', fontSize: 11 }}>✏️</button>
                      <button onClick={() => del(p.id)} style={{ padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(255,23,68,0.1)', color: '#FF4D6A', fontSize: 11 }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="admin-card"
              style={{ width: '100%', maxWidth: 520, padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Cairo', sans-serif" }}>
                  {editing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer' }}>✕</button>
              </div>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>{lg('اسم المنتج (عربي) *')}<input required className="admin-input" value={form.nameAr} onChange={e => setForm({ ...form, nameAr: e.target.value })} /></div>
                  <div>{lg('Product Name (EN) *')}<input required className="admin-input" value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} dir="ltr" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>{lg('السعر (AED) *')}<input required type="number" min={0} className="admin-input" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} dir="ltr" /></div>
                  <div>{lg('الكمية')}<input type="number" min={0} className="admin-input" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} dir="ltr" /></div>
                </div>
                <div>
                  {lg('الفئة')}
                  <select className="admin-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ appearance: 'none' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>{lg('رابط الصورة')}<input className="admin-input" value={form.mainImage || ''} onChange={e => setForm({ ...form, mainImage: e.target.value })} placeholder="https://..." dir="ltr" /></div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#FF2D78' }} />
                    مميز ⭐
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#00E676' }} />
                    نشط
                  </label>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>إلغاء</button>
                  <button type="submit" disabled={saving} className="btn-rose" style={{ flex: 2, padding: '12px' }}>
                    {saving ? '⏳ جارٍ الحفظ...' : '💾 حفظ المنتج'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
