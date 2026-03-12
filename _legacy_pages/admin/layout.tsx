"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Calendar, Package, MessageSquare, Menu, X, BarChart3 } from "lucide-react";

interface AdminStats {
    bookings: number;
    messages: number;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState<AdminStats>({ bookings: 0, messages: 0 });

    useEffect(() => {
        Promise.all([
            fetch("/api/bookings").then(r => r.json()).catch(() => []),
            fetch("/api/messages").then(r => r.json()).catch(() => []),
        ]).then(([bookings, messages]) => {
            setStats({
                bookings: Array.isArray(bookings) ? bookings.length : 0,
                messages: Array.isArray(messages) ? messages.length : 0,
            });
        });
    }, []);

    const navItems = [
        { href: "/admin", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
        { href: "/admin/bookings", icon: <Calendar size={18} />, label: "Bookings", badge: stats.bookings },
        { href: "/admin/products", icon: <Package size={18} />, label: "Products" },
        { href: "/admin/messages", icon: <MessageSquare size={18} />, label: "Messages", badge: stats.messages },
    ];

    return (
        <div className="min-h-screen pt-20">
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-24 left-4 z-40 lg:hidden p-2 rounded-xl bg-bg-card border border-white/10"
            >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <aside className={`fixed top-20 left-0 h-[calc(100vh-5rem)] w-60 bg-bg-secondary border-r border-white/5 p-4 z-30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}>
                <div className="mb-8 px-3">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={20} className="text-accent-rose" />
                        <h2 className="text-sm font-bold">Admin Panel</h2>
                    </div>
                    <p className="text-[10px] text-text-muted mt-1">Lover Diet Center</p>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-white/5 hover:text-accent-rose transition-all"
                        >
                            {item.icon}
                            {item.label}
                            {item.badge ? (
                                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] bg-accent-rose/10 text-accent-rose font-bold">
                                    {item.badge}
                                </span>
                            ) : null}
                        </Link>
                    ))}
                </nav>
            </aside>

            <div className="lg:ml-60 p-6">{children}</div>
        </div>
    );
}
