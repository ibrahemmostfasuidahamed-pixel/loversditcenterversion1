'use client';

import { useState, useEffect } from 'react';

type Testimonial = { id: string; nameAr: string; nameEn: string; reviewAr: string; rating: number; photo?: string; showOnHome: boolean; createdAt: string; };
const EMPTY = { nameAr: '', nameEn: '', reviewAr: '', rating: 5, photo: '', showOnHome: false };

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => { const r = await fetch('/api/admin/testimonials'); const d = await r.json(); setItems(d.testimonials || []); };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const url = editing ? `/api/admin/testimonials/${editing}` : '/api/admin/testimonials';
    await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    await load(); setSaving(false); setShowForm(false); setEditing(null); setForm(EMPTY);
  };
  const del = async (id: string) => { if (!confirm('حذف؟')) return; await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' }); await load(); };
  const toggle = async (t: Testimonial) => { await fetch(`/api/admin/testimonials/${t.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...t, showOnHome: !t.showOnHome }) }); await load(); };

  const ic = "w-full px-3 py-2.5 rounded-xl text-[13px] text-white outline-none"; const is = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '40px' };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-[15px] font-bold text-white">{items.length} رأي</h2>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); }} className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF2D78, #FF6B35)' }}>+ إضافة</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(t => (
          <div key={t.id} className="p-4 rounded-2xl space-y-3" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-white">{t.nameAr}</span>
              <div className="flex gap-1 text-[#F4A01C]">{'★'.repeat(t.rating)}</div>
            </div>
            <p className="text-[12px] text-white/60 line-clamp-3">{t.reviewAr}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle(t)} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: t.showOnHome ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', color: t.showOnHome ? '#22C55E' : 'rgba(255,255,255,0.4)' }}>{t.showOnHome ? '🌐 يظهر' : '🙈 مخفي'}</button>
              <button onClick={() => { setEditing(t.id); setForm({ nameAr: t.nameAr, nameEn: t.nameEn, reviewAr: t.reviewAr, rating: t.rating, photo: t.photo || '', showOnHome: t.showOnHome }); setShowForm(true); }} className="text-[11px] px-2.5 py-1 rounded-full text-white/50" style={{ background: 'rgba(255,255,255,0.05)' }}>✏️ تعديل</button>
              <button onClick={() => del(t.id)} className="text-[11px] px-2.5 py-1 rounded-full text-red-400" style={{ background: 'rgba(239,68,68,0.1)' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex justify-between mb-5"><h3 className="text-[15px] font-bold text-white">رأي جديد</h3><button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white text-xl">✕</button></div>
            <form onSubmit={save} className="space-y-3">
              <input placeholder="الاسم (عربي)" required value={form.nameAr} onChange={e => setForm({ ...form, nameAr: e.target.value })} className={ic} style={is} />
              <input placeholder="Name (EN)" value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} className={ic} style={is} dir="ltr" />
              <textarea placeholder="نص الرأي..." required value={form.reviewAr} onChange={e => setForm({ ...form, reviewAr: e.target.value })} rows={3} className={ic} style={is} />
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-white/40">التقييم:</span>
                {[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })} className={`text-xl ${form.rating >= s ? 'text-[#F4A01C]' : 'text-white/20'}`}>★</button>)}
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.showOnHome} onChange={e => setForm({ ...form, showOnHome: e.target.checked })} />
                <span className="text-[13px] text-white/70">عرض على الصفحة الرئيسية</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-[13px] text-white/50" style={{ background: 'rgba(255,255,255,0.04)' }}>إلغاء</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF2D78, #FF6B35)' }}>{saving ? 'حفظ...' : 'حفظ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
