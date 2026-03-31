'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard from '@/components/admin/TiltCard';

// Using the correct product shape from the new PHP backend
type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  video?: string;
  created_at: string;
};

const CATEGORIES = ['supplements', 'meal_plans', 'devices', 'other'];
const CAT_LABELS: Record<string, string> = { supplements: 'مكملات', meal_plans: 'وجبات', devices: 'أجهزة', other: 'أخرى' };
const CAT_COLORS: Record<string, string> = { supplements: '#FF2D78', meal_plans: '#D4AF37', devices: '#2979FF', other: '#00E676' };

const EMPTY = { name: '', description: '', price: '', category: 'supplements' };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/products');
      const d = await r.json();
      setProducts(d.products || []);
    } catch (e) {
      console.error(e);
      setProducts([]);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, description: p.description, price: p.price, category: p.category }); setShowForm(true); };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Use FormData for file uploads
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('category', form.category);

    if (imageRef.current?.files?.[0]) {
      formData.append('image', imageRef.current.files[0]);
    }
    if (videoRef.current?.files?.[0]) {
      formData.append('video', videoRef.current.files[0]);
    }

    const url = editing ? `/api/products/${editing.id}` : '/api/products';
    const method = editing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        await load();
        setShowForm(false);
      } else {
        const error = await res.json();
        alert('Error saving product: ' + (error.error || 'Server error'));
      }
    } catch (err) {
      alert('Network error');
    }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm('حذف المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    await load();
  };

  const lg = (label: string) => (
    <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>{label}</label>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Cairo', sans-serif" }}>المنتجات وتدريب الأونلاين</h2>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {loading ? (
            [...Array(8)].map((_, i) => <div key={i} className="shimmer" style={{ height: 260, borderRadius: 20 }} />)
          ) : products.map((p, i) => {
            const cc = CAT_COLORS[p.category] || '#FF2D78';
            return (
              <TiltCard key={p.id} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                {/* Image/Video section */}
                <div style={{ height: 160, position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : p.video ? (
                    <video src={p.video} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop autoPlay playsInline />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, opacity: 0.3 }}>🛍️</div>
                  )}
                  {/* Category badge */}
                  <span style={{
                    position: 'absolute', top: 8, right: 8, fontSize: 10, padding: '3px 8px', borderRadius: 999,
                    background: `${cc}30`, color: '#fff', border: `1px solid ${cc}50`, fontWeight: 700, backdropFilter: 'blur(4px)'
                  }}>{CAT_LABELS[p.category] || p.category}</span>
                </div>
                {/* Info */}
                <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {p.description || 'لا يوجد وصف'}
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#00E676', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
                      {Number(p.price) > 0 ? `${p.price} AED` : 'مجاني'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(p)} style={{
                      flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: 13, transition: 'all 0.15s', fontFamily: 'inherit',
                    }}>✏️ تعديل</button>
                    <button onClick={() => del(p.id)} style={{
                      flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(255,23,68,0.2)',
                      background: 'rgba(255,23,68,0.08)', color: '#FF4D6A',
                      cursor: 'pointer', fontSize: 13, transition: 'all 0.15s', fontFamily: 'inherit',
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
              <tr><th>المنتج</th><th>الوصف</th><th>الفئة</th><th>السعر</th><th>إجراء</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, overflow: 'hidden' }}>
                        {p.image ? (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : p.video ? (
                           <video src={p.video} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                        ) : '🛍️'}
                      </div>
                      <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{p.name}</div>
                    </div>
                  </td>
                  <td>
                     <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                       {p.description}
                     </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: `${CAT_COLORS[p.category] || '#FF2D78'}15`, color: CAT_COLORS[p.category] || '#FF2D78', border: `1px solid ${CAT_COLORS[p.category] || '#FF2D78'}30` }}>
                      {CAT_LABELS[p.category] || p.category}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'Bebas Neue'", fontSize: 16, color: '#00E676' }}>
                     {Number(p.price) > 0 ? `${p.price} AED` : 'Free'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', fontSize: 12 }}>✏️ تعديل</button>
                      <button onClick={() => del(p.id)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,23,68,0.1)', color: '#FF4D6A', fontSize: 12 }}>🗑️</button>
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
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="admin-card"
              style={{ width: '100%', maxWidth: 540, padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, fontFamily: "'Cairo', sans-serif" }}>
                  {editing ? 'تعديل المنتج' : 'إضافة منتج أو تدريب جديد'}
                </h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 24, cursor: 'pointer' }}>✕</button>
              </div>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  {lg('الاسم / العنوان *')}
                  <input required className="admin-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  {lg('الوصف')}
                  <textarea className="admin-input" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    {lg('السعر (درهم إماراتي) *')}
                    <input required type="text" className="admin-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} dir="ltr" placeholder="مثال: 150 أو 0" />
                  </div>
                  <div>
                    {lg('الفصيلة')}
                    <select className="admin-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ appearance: 'none', cursor: 'pointer' }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    {lg(`ارفع صورة ${editing && editing.image ? '(موجودة مسبقاً)' : ''}`)}
                    <label style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
                        padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.2)', color: 'var(--text-secondary)', fontSize: 12
                    }}>
                        🖼️ اختيار صورة
                        <input type="file" ref={imageRef} accept="image/*" style={{ display: 'none' }} />
                    </label>
                  </div>
                  <div>
                    {lg(`ارفع فيديو ${editing && editing.video ? '(موجود مسبقاً)' : ''}`)}
                    <label style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
                        padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.2)', color: 'var(--text-secondary)', fontSize: 12
                    }}>
                        🎥 اختيار فيديو
                        <input type="file" ref={videoRef} accept="video/*" style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>إلغاء</button>
                  <button type="submit" disabled={saving} className="btn-rose" style={{ flex: 2, padding: '14px', fontSize: 15 }}>
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
