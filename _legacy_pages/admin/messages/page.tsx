"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Clock } from "lucide-react";

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/messages")
            .then((r) => r.json())
            .then((d) => { if (Array.isArray(d)) setMessages(d); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-display mb-1">Messages</h1>
                <p className="text-text-muted text-sm mb-8">Contact form submissions</p>
            </motion.div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-accent-rose border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            ) : messages.length === 0 ? (
                <div className="glass-card p-6">
                    <p className="text-text-muted text-sm py-12 text-center">No messages yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((m, i) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-5"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-semibold text-sm">{m.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                                        <span className="flex items-center gap-1"><Mail size={11} /> {m.email}</span>
                                        {m.phone && <span>📱 {m.phone}</span>}
                                    </div>
                                </div>
                                <span className="flex items-center gap-1 text-[10px] text-text-muted">
                                    <Clock size={10} /> {new Date(m.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed">{m.message}</p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
