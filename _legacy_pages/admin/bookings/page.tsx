"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/bookings")
            .then((r) => r.json())
            .then((d) => { if (Array.isArray(d)) setBookings(d); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-display mb-1">Bookings</h1>
                <p className="text-text-muted text-sm mb-8">Manage consultation bookings</p>
            </motion.div>

            <div className="glass-card p-6">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-accent-rose border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : bookings.length === 0 ? (
                    <p className="text-text-muted text-sm py-12 text-center">No bookings yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-text-muted border-b border-white/5">
                                    <th className="text-left pb-3 font-medium">Name</th>
                                    <th className="text-left pb-3 font-medium">Email</th>
                                    <th className="text-left pb-3 font-medium">Phone</th>
                                    <th className="text-left pb-3 font-medium">Date</th>
                                    <th className="text-left pb-3 font-medium">Time</th>
                                    <th className="text-left pb-3 font-medium">Weight</th>
                                    <th className="text-left pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b.id} className="border-b border-white/5">
                                        <td className="py-3 font-medium">{b.name}</td>
                                        <td className="py-3 text-text-muted">{b.email}</td>
                                        <td className="py-3 text-text-muted">{b.phone}</td>
                                        <td className="py-3 text-text-muted">{b.date}</td>
                                        <td className="py-3 text-text-muted">{b.time}</td>
                                        <td className="py-3 text-text-muted">{b.currentWeight}→{b.targetWeight} kg</td>
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
        </div>
    );
}
