"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import TransformationAnimation from "./TransformationAnimation";
import FloatingStatCard from "./FloatingStatCard";
import Link from "next/link";

export default function HeroSection() {
    const { t } = useTranslation();

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden noise">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-rose/8 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left: Text content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-pill text-xs font-semibold bg-accent-rose/10 text-accent-rose border border-accent-rose/20 mb-6 tracking-wider uppercase">
                                {t("hero.tagline")}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] mb-6 tracking-tight"
                        >
                            <span className="text-text-primary">{t("hero.title1")}</span>
                            <br />
                            <span className="hero-gradient-text">{t("hero.title2")}</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-text-secondary text-base sm:text-lg max-w-lg mb-8 leading-relaxed"
                        >
                            {t("hero.desc")}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-wrap gap-4 mb-10"
                        >
                            <Link href="/booking" className="btn-rose">
                                {t("hero.cta1")}
                            </Link>
                            <Link href="/services" className="btn-outline">
                                {t("hero.cta2")}
                            </Link>
                        </motion.div>

                        {/* Client avatars */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="flex items-center gap-4"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full border-2 border-bg-primary bg-gradient-to-br from-accent-rose/40 to-accent-gold/40 flex items-center justify-center text-[10px] font-bold"
                                    >
                                        {["SA", "MK", "FA", "OH", "NR"][i - 1]}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-text-primary font-bold text-lg">1000+</p>
                                <p className="text-text-muted text-xs">{t("hero.clients")}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Transformation animations */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="relative h-[500px] lg:h-[600px]"
                    >
                        {/* Male silhouette */}
                        <div className="absolute left-0 top-0 w-1/2 h-full">
                            <TransformationAnimation gender="male" />

                            {/* Male floating stat cards */}
                            <div className="absolute top-8 -left-4 z-20">
                                <FloatingStatCard
                                    icon="⚖️"
                                    label={t("hero.stat.weight")}
                                    value={t("hero.stat.weight.val")}
                                />
                            </div>
                            <div className="absolute top-1/2 -left-8 z-20">
                                <FloatingStatCard
                                    icon="📅"
                                    label={t("hero.stat.duration")}
                                    value={t("hero.stat.duration.val")}
                                    delay="1s"
                                />
                            </div>
                            <div className="absolute bottom-20 -left-2 z-20">
                                <FloatingStatCard
                                    icon="🔥"
                                    label={t("hero.stat.calories")}
                                    value={t("hero.stat.calories.val")}
                                    delay="2s"
                                />
                            </div>
                        </div>

                        {/* Female silhouette */}
                        <div className="absolute right-0 top-0 w-1/2 h-full">
                            <TransformationAnimation gender="female" />

                            {/* Female floating stat cards */}
                            <div className="absolute top-12 -right-4 z-20">
                                <FloatingStatCard
                                    icon="📏"
                                    label={t("hero.stat.size")}
                                    value={t("hero.stat.size.val")}
                                    delay="0.5s"
                                />
                            </div>
                            <div className="absolute top-1/2 -right-6 z-20">
                                <FloatingStatCard
                                    icon="💪"
                                    label={t("hero.stat.bmi")}
                                    value={t("hero.stat.bmi.val")}
                                    delay="1.5s"
                                />
                            </div>
                            <div className="absolute bottom-24 -right-2 z-20">
                                <FloatingStatCard
                                    icon="⭐"
                                    label={t("hero.stat.result")}
                                    value={t("hero.stat.result.val")}
                                    delay="2.5s"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-10" />
        </section>
    );
}
