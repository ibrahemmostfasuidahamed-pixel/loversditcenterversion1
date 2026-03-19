'use client';

import { useState, useEffect } from 'react';

type AdminUser = { id: string; name: string; email: string; role: string; isActive: boolean; lastLoginAt?: string; };

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'editor' });
  const [saving, setSaving] = useState(false);

  const load = async () => { const r = await fetch('/api/admin/users'); const d = await r.json(); setUsers(d.users || []); };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    await load(); setSaving(false); setShowForm(false); setForm({ name: '', email: '', role: 'editor' });
  };
  const toggle = async (u: AdminUser) => { await fetch(`/api/admin/users/${u.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !u.isActive }) }); await load(); };
  const del = async (id: string) => { if (!confirm('حذف المستخدم؟')) return; await fetch(`/api/admin/users/${id}`, { method: 'DELETE' }); await load(); };

  const ROLE_LABELS: Record<string, string> = { super_admin: 'مدير عام', editor: 'محرر', viewer: 'مشاهد' };
  const ic = "w-full px-3 py-2.5 rounded-xl text-[13px] text-white outline-none"; const is = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '40px' };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-[15px] font-bold text-white">{users.length} مديرين</h2>
        <button onClick={() => setShowForm(true)} className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF2D78, #FF6B35)' }}>+ إضافة مستخدم</button>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.05)' }}>
        <table className="w-full text-right">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['الاسم', 'البريد', 'الصلاحية', 'آخر دخول', 'الحالة', 'إجراءات'].map(h => (
                <th key={h} className="px-4 py-3 text-[11px] font-medium text-white/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-[13px] text-white font-medium">{u.name}</td>
                <td className="px-4 py-3 text-[13px] text-white/50" dir="ltr">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: u.role === 'super_admin' ? 'rgba(255,45,120,0.15)' : 'rgba(255,255,255,0.05)', color: u.role === 'super_admin' ? '#FF2D78' : 'rgba(255,255,255,0.5)' }}>
                    {ROLE_LABELS[u.role] || u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-white/30">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('ar-AE') : '—'}</td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: u.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: u.isActive ? '#22C55E' : '#EF4444' }}>
                    {u.isActive ? 'نشط' : 'معطّل'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => toggle(u)} className="text-[11px] px-2 py-1 rounded-lg text-white/50 hover:text-white" style={{ background: 'rgba(255,255,255,0.04)' }}>{u.isActive ? 'تعطيل' : 'تفعيل'}</button>
                    <button onClick={() => del(u.id)} className="text-[11px] px-2 py-1 rounded-lg text-red-400" style={{ background: 'rgba(239,68,68,0.08)' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex justify-between mb-5"><h3 className="text-[15px] font-bold text-white">مستخدم جديد</h3><button onClick={() => setShowForm(false)} className="text-white/40 text-xl">✕</button></div>
            <form onSubmit={save} className="space-y-3">
              <input placeholder="الاسم الكامل *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={ic} style={is} />
              <input type="email" placeholder="البريد الإلكتروني *" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={ic} style={is} dir="ltr" />
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={ic} style={{ ...is, appearance: 'none' }}>
                <option value="editor" className="bg-[#1A1A1A]">محرر</option>
                <option value="viewer" className="bg-[#1A1A1A]">مشاهد</option>
                <option value="super_admin" className="bg-[#1A1A1A]">مدير عام</option>
              </select>
              <p className="text-[11px] text-white/30">سيتم إرسال كلمة مرور مؤقتة للبريد الإلكتروني</p>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-[13px] text-white/50" style={{ background: 'rgba(255,255,255,0.04)' }}>إلغاء</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF2D78, #FF6B35)' }}>{saving ? 'حفظ...' : 'إضافة'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
