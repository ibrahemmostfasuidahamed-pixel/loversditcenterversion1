'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Message = { id: string; name: string; email?: string; phone?: string; message: string; read: boolean; archived: boolean; createdAt: string; };

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [selected, setSelected] = useState<Message | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/messages');
    const data = await res.json();
    setMessages(data.messages || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const archive = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archived: true }) });
    await load();
    setSelected(null);
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.read && !m.archived;
    if (filter === 'archived') return m.archived;
    return !m.archived;
  });

  const openMsg = (m: Message) => { setSelected(m); if (!m.read) markRead(m.id); };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(['all', 'unread', 'archived'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-xl text-[12px] font-medium transition-all" style={{ background: filter === f ? 'rgba(255,45,120,0.15)' : 'rgba(255,255,255,0.04)', color: filter === f ? '#FF2D78' : 'rgba(255,255,255,0.4)', border: filter === f ? '1px solid rgba(255,45,120,0.3)' : '1px solid transparent' }}>
            {f === 'all' ? 'الكل' : f === 'unread' ? 'غير مقروءة' : 'المؤرشفة'}
            {f === 'unread' && <span className="mr-2 px-1.5 py-0.5 rounded-full text-[10px] bg-[#FF2D78] text-white">{messages.filter(m => !m.read && !m.archived).length}</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* List */}
        <div className="space-y-2">
          {loading ? (
            <p className="text-center py-12 text-white/30 text-[13px]">⏳ جارٍ التحميل...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12 text-white/30 text-[13px]">لا توجد رسائل</p>
          ) : (
            filtered.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => openMsg(m)}
                className="p-4 rounded-xl cursor-pointer transition-all group"
                style={{
                  background: selected?.id === m.id ? 'rgba(255,45,120,0.08)' : '#1A1A1A',
                  border: selected?.id === m.id ? '1px solid rgba(255,45,120,0.3)' : '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {!m.read && <div className="w-2 h-2 rounded-full bg-[#FF2D78] shrink-0" />}
                    <span className="text-[13px] font-bold text-white">{m.name}</span>
                  </div>
                  <span className="text-[10px] text-white/30">{new Date(m.createdAt).toLocaleDateString('ar-AE')}</span>
                </div>
                <p className="text-[12px] text-white/50 line-clamp-2 mr-4">{m.message}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="rounded-2xl p-5 min-h-[200px]" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.05)' }}>
          {!selected ? (
            <div className="flex items-center justify-center h-full min-h-[150px]">
              <p className="text-white/20 text-[13px]">اختر رسالة للعرض</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-white">{selected.name}</h3>
                  {selected.email && <p className="text-[12px] text-white/40" dir="ltr">{selected.email}</p>}
                  {selected.phone && <p className="text-[12px] text-white/40" dir="ltr">{selected.phone}</p>}
                </div>
                <span className="text-[11px] text-white/30">{new Date(selected.createdAt).toLocaleString('ar-AE')}</span>
              </div>
              <div className="p-4 rounded-xl text-[13px] text-white/80 leading-relaxed" style={{ background: 'rgba(255,255,255,0.03)' }}>
                {selected.message}
              </div>
              <div className="flex gap-2">
                {selected.phone && (
                  <a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-xl text-[12px] text-white text-center font-medium" style={{ background: 'rgba(37,211,102,0.15)' }}>
                    💬 رد واتساب
                  </a>
                )}
                {!selected.archived && (
                  <button onClick={() => archive(selected.id)} className="flex-1 py-2.5 rounded-xl text-[12px] text-white/60 font-medium" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    📁 أرشفة
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
