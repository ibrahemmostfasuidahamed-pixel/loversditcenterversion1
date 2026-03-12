"use client";

interface FloatingStatCardProps {
    icon: string;
    label: string;
    value: string;
    className?: string;
    delay?: string;
}

export default function FloatingStatCard({ icon, label, value, className = "", delay = "0s" }: FloatingStatCardProps) {
    return (
        <div
            className={`stat-card animate-float ${className}`}
            style={{ animationDelay: delay }}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-rose/20 flex items-center justify-center text-lg">
                    {icon}
                </div>
                <div>
                    <p className="text-[11px] text-text-muted uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-bold text-text-primary">{value}</p>
                </div>
            </div>
        </div>
    );
}
