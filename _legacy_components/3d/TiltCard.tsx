"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
}

export default function TiltCard({ children, className }: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glareX, setGlareX] = useState(50);
    const [glareY, setGlareY] = useState(50);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        setRotateX((y - centerY) / 12);
        setRotateY(-(x - centerX) / 12);
        setGlareX((x / rect.width) * 100);
        setGlareY((y / rect.height) * 100);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setGlareX(50);
        setGlareY(50);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn("relative group", className)}
            style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: "transform 0.15s ease-out",
                transformStyle: "preserve-3d",
            }}
        >
            {/* Glare overlay */}
            <div
                className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                style={{
                    background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
                }}
            />
            <div className="glass-card h-full">{children}</div>
        </motion.div>
    );
}
