"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface IOSButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "gold";
    href?: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit";
    disabled?: boolean;
}

export default function IOSButton({
    children,
    variant = "primary",
    href,
    onClick,
    className,
    type = "button",
    disabled = false,
}: IOSButtonProps) {
    const variants = {
        primary: "bg-gradient-to-r from-rose-primary to-rose-light text-white shadow-glass",
        secondary: "glass text-gray-800 dark:text-white border border-white/20",
        gold: "bg-gradient-to-r from-gold-primary to-gold-light text-white shadow-gold",
    };

    const baseClasses = cn(
        "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-[15px] transition-all duration-300",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
    );

    const Wrapper = ({ children: c }: { children: React.ReactNode }) =>
        href ? (
            <Link href={href} className={baseClasses}>
                {c}
            </Link>
        ) : (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={baseClasses}
            >
                {c}
            </button>
        );

    return (
        <motion.div
            whileHover={{ scale: disabled ? 1 : 1.03 }}
            whileTap={{ scale: disabled ? 1 : 0.97 }}
        >
            <Wrapper>{children}</Wrapper>
        </motion.div>
    );
}
