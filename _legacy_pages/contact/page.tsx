"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Phone, Mail, MapPin, Clock, Send, Check } from "lucide-react";

export default function ContactPage() {
    const { t, locale } = useTranslation();
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        try {
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fd.get("name"),
                    email: fd.get("email"),
                    phone: fd.get("phone"),
                    message: fd.get("message"),
                }),
            });
            setSent(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        { icon: <Phone size={20} />, label: locale === "ar" ? "اتصل بنا" : "Call Us", value: "+971 50 123 4567" },
        { icon: <Mail size={20} />, label: locale === "ar" ? "راسلنا" : "Email Us", value: "info@loversdietcenter.ae" },
        { icon: <MapPin size={20} />, label: locale === "ar" ? "زورنا" : "Visit Us", value: locale === "ar" ? "دبي، الإمارات" : "Dubai, UAE" },
        { icon: <Clock size={20} />, label: locale === "ar" ? "ساعات العمل" : "Working Hours", value: locale === "ar" ? "السبت-الخميس: ٩ص - ٩م" : "Sat-Thu: 9AM - 9PM" },
    ];

    return (
        <main className="pt-24">
            <section className="section-padding relative noise">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-rose/8 rounded-full blur-[150px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                        <h1 className="text-5xl md:text-7xl font-display mb-4">{t("contact.title")}</h1>
                    </motion.div>

                    {/* Contact cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        {contactInfo.map((info, i) => (
                            <motion.div
                                key={info.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-6 text-center"
                            >
                                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-accent-rose/10 flex items-center justify-center text-accent-rose">
                                    {info.icon}
                                </div>
                                <p className="text-xs text-text-muted mb-1">{info.label}</p>
                                <p className="font-medium text-sm">{info.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            {sent ? (
                                <div className="glass-card p-8 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Check size={32} className="text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{t("contact.success")}</h3>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">{t("contact.name")}</label>
                                        <input name="name" required className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("contact.email")}</label>
                                            <input name="email" type="email" required className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("contact.phone")}</label>
                                            <input name="phone" className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">{t("contact.message")}</label>
                                        <textarea name="message" required rows={5} className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors resize-none" />
                                    </div>
                                    <button type="submit" disabled={loading} className="btn-rose w-full justify-center">
                                        {loading ? "..." : <><Send size={16} /> {t("contact.send")}</>}
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Map */}
                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card overflow-hidden h-full min-h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231280.23432061895!2d55.17274!3d25.0657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai!5e0!3m2!1sen!2sae"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
