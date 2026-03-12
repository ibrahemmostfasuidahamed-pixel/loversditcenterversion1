"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Package, MessageSquare, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetch("/api/bookings").then(r => r.json()).then(d => Array.isArray(d) && setBookings(d)).catch(() => { });
        fetch("/api/messages").then(r => r.json()).then(d => Array.isArray(d) && setMessages(d)).catch(() => { });
    }, []);

    const stats = [
        { icon: <Calendar className="text-accent-rose" />, label: "Total Bookings", value: bookings.length, gradient: "from-accent-rose/20" },
        { icon: <MessageSquare className="text-accent-gold" />, label: "Messages", value: messages.length, gradient: "from-accent-gold/20" },
        { icon: <Package className="text-blue-400" />, label: "Products", value: 6, gradient: "from-blue-400/20" },
        { icon: <TrendingUp className="text-green-400" />, label: "Conversion", value: "98%", gradient: "from-green-400/20" },
    ];

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-display mb-1">Dashboard</h1>
                <p className="text-text-muted text-sm mb-8">Welcome to the admin panel</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-5"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} to-transparent flex items-center justify-center`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs text-text-muted">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="glass-card p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Recent Bookings</h2>
                {bookings.length === 0 ? (
                    <p className="text-text-muted text-sm py-6 text-center">No bookings yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-text-muted border-b border-white/5">
                                    <th className="text-left pb-3 font-medium">Name</th>
                                    <th className="text-left pb-3 font-medium">Date</th>
                                    <th className="text-left pb-3 font-medium">Time</th>
                                    <th className="text-left pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(bookings as any[]).slice(0, 5).map((b: any) => (
                                    <tr key={b.id} className="border-b border-white/5">
                                        <td className="py-3 font-medium">{b.name}</td>
                                        <td className="py-3 text-text-muted">{b.date}</td>
                                        <td className="py-3 text-text-muted">{b.time}</td>
                                        <td className="py-3">
                                            <span className="px-2 py-1 rounded-full text-[10px] bg-accent-gold/10 text-accent-gold font-semibold">{b.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Recent Messages */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-bold mb-4">Recent Messages</h2>
                {messages.length === 0 ? (
                    <p className="text-text-muted text-sm py-6 text-center">No messages yet.</p>
                ) : (
                    <div className="space-y-3">
                        {(messages as any[]).slice(0, 5).map((m: any) => (
                            <div key={m.id} className="p-4 rounded-xl bg-bg-elevated border border-white/5">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-sm">{m.name}</span>
                                    <span className="text-xs text-text-muted">{new Date(m.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-text-muted line-clamp-2">{m.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
