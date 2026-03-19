'use client';

import { useState, useEffect } from 'react';

type Transform = { id: string; beforeImage: string; afterImage: string; patientName?: string; gender?: string; weightBefore?: number; weightAfter?: number; duration?: number; featured: boolean; published: boolean; };
const EMPTY = { beforeImage: '', afterImage: '', patientName: '', gender: 'female', weightBefore: 0, weightAfter: 0, duration: 3, featured: false, published: true };

export default function TransformationsPage() {
  const [items, setItems] = useState<Transform[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => { const r = await fetch('/api/admin/transformations'); const d = await r.json(); setItems(d.transformations || []); };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    await fetch('/api/admin/transformations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    await load(); setSaving(false); setShowForm(false); setForm(EMPTY);
  };
  const del = async (id: string) => { if (!confirm('حذف؟')) return; await fetch(`/api/admin/transformations/${id}`, { method: 'DELETE' }); await load(); };

  const ic = "w-full px-3 py-2.5 rounded-xl text-[13px] text-white outline-none"; const is = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '40px' };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-[15px] font-bold text-white">{items.length} تحول</h2>
        <button onClick={() => setShowForm(true)} className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF2D78, #FF6B35)' }}>+ إضافة</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(t => (
          <div key={t.id} className="rounded-2xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex h-28">
              <div className="w-1/2 relative">
                {t.beforeImage ? <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.beforeImage} className="w-full h-full object-cover" alt="before" /></> : <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20 text-xs">قبل</div>}
                <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded">قبل</span>
              </div>
              <div className="w-1/2 relative">
                {t.afterImage ? <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.afterImage} className="w-full h-full object-cover" alt="after" /></> : <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20 text-xs">بعد</div>}
                <span className="absolute bottom-1 left-1 text-[9px] bg-[#22C55E]/80 text-white px-1.5 py-0.5 rounded">بعد</span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-[12px] font-bold text-white">{t.patientName || 'مجهول'}</p>
              {t.weightBefore && t.weightAfter && (
                <p className="text-[11px] text-white/40">{t.weightBefore}kg → {t.weightAfter}kg • {t.duration} شهر</p>
              )}
              <button onClick={() => del(t.id)} className="mt-2 text-[11px] text-red-400">🗑️ حذف</button>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex justify-between mb-5"><h3 className="text-[15px] font-bold text-white">تحول جديد</h3><button onClick={() => setShowForm(false)} className="text-white/40 text-xl">✕</button></div>
            <form onSubmit={save} className="space-y-3">
              <input placeholder="رابط صورة قبل *" required value={form.beforeImage} onChange={e => setForm({ ...form, beforeImage: e.target.value })} className={ic} style={is} dir="ltr" />
              <input placeholder="رابط صورة بعد *" required value={form.afterImage} onChange={e => setForm({ ...form, afterImage: e.target.value })} className={ic} style={is} dir="ltr" />
              <input placeholder="اسم المريض (اختياري)" value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} className={ic} style={is} />
              <div className="grid grid-cols-3 gap-2">
                <input type="number" placeholder="وزن قبل" value={form.weightBefore} onChange={e => setForm({ ...form, weightBefore: +e.target.value })} className={ic} style={is} />
                <input type="number" placeholder="وزن بعد" value={form.weightAfter} onChange={e => setForm({ ...form, weightAfter: +e.target.value })} className={ic} style={is} />
                <input type="number" placeholder="أشهر" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })} className={ic} style={is} />
              </div>
              <div className="flex gap-3">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /><span className="text-[12px] text-white/60">مميز</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /><span className="text-[12px] text-white/60">منشور</span></label>
              </div>
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
