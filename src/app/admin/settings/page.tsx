'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'social', label: '📱 السوشيال' },
  { id: 'clinic', label: '🏥 العيادة' },
  { id: 'whatsapp', label: '💬 واتساب' },
  { id: 'notifications', label: '🔔 الإشعارات' },
  { id: 'security', label: '🔐 الأمان' },
];

const SOCIAL_KEYS = [
  { key: 'instagram_url', label: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/...' },
  { key: 'tiktok_url',    label: 'TikTok',    icon: '🎵', placeholder: 'https://tiktok.com/...' },
  { key: 'youtube_url',   label: 'YouTube',   icon: '▶️', placeholder: 'https://youtube.com/...' },
  { key: 'snapchat_url',  label: 'Snapchat',  icon: '👻', placeholder: 'https://snapchat.com/...' },
  { key: 'trendyol_url',  label: 'Trendyol',  icon: '🛍️', placeholder: 'https://trendyol.com/...' },
  { key: 'whatsapp_number', label: 'WhatsApp', icon: '💬', placeholder: '+971XXXXXXXXX' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('social');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [passSaving, setPassSaving] = useState(false);
  const [passErr, setPassErr] = useState('');
  const [passOk, setPassOk] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      const map: Record<string, string> = {};
      (d.settings || []).forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  const saveSetting = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) { setPassErr('كلمات المرور غير متطابقة'); return; }
    if (passwords.newPass.length < 8) { setPassErr('كلمة المرور قصيرة جداً'); return; }
    setPassSaving(true); setPassErr('');
    await fetch('/api/admin/auth/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newPassword: passwords.newPass }) });
    setPassSaving(false);
    setPassOk(true);
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPassOk(false), 3000);
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-[13px] text-white outline-none";
  const inputStl = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '42px' };
  const labelCls = "text-[11px] text-white/40 mb-1 block";

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className="px-3 py-2 rounded-xl text-[12px] font-medium transition-all" style={{ background: activeTab === t.id ? 'rgba(255,45,120,0.15)' : 'rgba(255,255,255,0.04)', color: activeTab === t.id ? '#FF2D78' : 'rgba(255,255,255,0.4)', border: activeTab === t.id ? '1px solid rgba(255,45,120,0.3)' : '1px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-12 text-white/30">⏳ جارٍ التحميل...</p>
      ) : (
        <div className="rounded-2xl p-6 space-y-5" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Social tab */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <h3 className="text-[14px] font-bold text-white">روابط السوشيال ميديا</h3>
              {SOCIAL_KEYS.map(s => (
                <div key={s.key}>
                  <label className={labelCls}>{s.icon} {s.label}</label>
                  <input value={settings[s.key] || ''} onChange={e => saveSetting(s.key, e.target.value)} placeholder={s.placeholder} className={inputCls} style={inputStl} dir="ltr" />
                </div>
              ))}
            </div>
          )}

          {/* Clinic tab */}
          {activeTab === 'clinic' && (
            <div className="space-y-4">
              <h3 className="text-[14px] font-bold text-white">معلومات العيادة</h3>
              {[
                { key: 'clinic_name_ar', label: 'اسم العيادة (عربي)' },
                { key: 'clinic_name_en', label: 'Clinic Name (EN)', dir: 'ltr' as const },
                { key: 'clinic_address_ar', label: 'العنوان (عربي)' },
                { key: 'clinic_phone', label: 'رقم الهاتف', dir: 'ltr' as const },
                { key: 'clinic_email', label: 'البريد الإلكتروني', dir: 'ltr' as const },
                { key: 'google_maps_url', label: 'رابط خرائط Google', dir: 'ltr' as const },
              ].map(f => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <input value={settings[f.key] || ''} onChange={e => saveSetting(f.key, e.target.value)} className={inputCls} style={inputStl} dir={f.dir} />
                </div>
              ))}
            </div>
          )}

          {/* WhatsApp tab */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <h3 className="text-[14px] font-bold text-white">زر واتساب العائم</h3>
              <div>
                <label className={labelCls}>رقم الهاتف</label>
                <input value={settings['whatsapp_number'] || ''} onChange={e => saveSetting('whatsapp_number', e.target.value)} placeholder="+971XXXXXXXXX" className={inputCls} style={inputStl} dir="ltr" />
              </div>
              <div>
                <label className={labelCls}>رسالة ترحيب (عربي)</label>
                <input value={settings['whatsapp_msg_ar'] || ''} onChange={e => saveSetting('whatsapp_msg_ar', e.target.value)} placeholder="مرحباً، أريد الاستفسار عن..." className={inputCls} style={inputStl} />
              </div>
              <div>
                <label className={labelCls}>Welcome Message (EN)</label>
                <input value={settings['whatsapp_msg_en'] || ''} onChange={e => saveSetting('whatsapp_msg_en', e.target.value)} placeholder="Hello, I'd like to inquire about..." className={inputCls} style={inputStl} dir="ltr" />
              </div>
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-[14px] font-bold text-white">إعدادات الإشعارات</h3>
              <div>
                <label className={labelCls}>بريد استلام إشعارات الحجوزات</label>
                <input value={settings['notify_bookings_email'] || ''} onChange={e => saveSetting('notify_bookings_email', e.target.value)} type="email" className={inputCls} style={inputStl} dir="ltr" />
              </div>
              <div>
                <label className={labelCls}>بريد استلام إشعارات الرسائل</label>
                <input value={settings['notify_messages_email'] || ''} onChange={e => saveSetting('notify_messages_email', e.target.value)} type="email" className={inputCls} style={inputStl} dir="ltr" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={settings['whatsapp_alerts'] === 'true'} onChange={e => saveSetting('whatsapp_alerts', e.target.checked ? 'true' : 'false')} className="w-4 h-4 rounded" />
                <span className="text-[13px] text-white/70">تنبيهات واتساب عند حجز جديد</span>
              </label>
            </div>
          )}

          {/* Security tab */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <h3 className="text-[14px] font-bold text-white">🔐 تغيير كلمة المرور</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {[
                  { label: 'كلمة المرور الجديدة', key: 'newPass' as const },
                  { label: 'تأكيد كلمة المرور', key: 'confirm' as const },
                ].map(f => (
                  <div key={f.key}>
                    <label className={labelCls}>{f.label}</label>
                    <input type="password" value={passwords[f.key]} onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))} required className={inputCls} style={inputStl} dir="ltr" />
                  </div>
                ))}
                {passErr && <p className="text-red-400 text-[12px]">⚠️ {passErr}</p>}
                {passOk && <p className="text-green-400 text-[12px]">✅ تم تغيير كلمة المرور</p>}
                <button type="submit" disabled={passSaving} className="px-4 py-2.5 rounded-xl text-[13px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #FF2D78, #FF6B35)' }}>
                  {passSaving ? 'جارٍ الحفظ...' : 'تغيير كلمة المرور'}
                </button>
              </form>
            </div>
          )}

          {/* Save Button (non-security tabs) */}
          {activeTab !== 'security' && (
            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 rounded-xl text-[13px] font-bold text-white transition-all"
                style={{ background: saved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #FF2D78, #FF6B35)', border: saved ? '1px solid rgba(34,197,94,0.4)' : 'none', color: saved ? '#22C55E' : 'white' }}
              >
                {saved ? '✅ تم الحفظ!' : saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
              </motion.button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
