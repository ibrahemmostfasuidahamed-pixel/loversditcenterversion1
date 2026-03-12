"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
    target: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    label: string;
}

export default function AnimatedCounter({
    target,
    suffix = "",
    prefix = "",
    duration = 2,
    label,
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        const startVal = 0;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(startVal + (target - startVal) * eased));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, target, duration]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
        >
            <div className="text-4xl md:text-5xl font-bold gradient-text">
                {prefix}
                {count.toLocaleString()}
                {suffix}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                {label}
            </p>
        </motion.div>
    );
}
