"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { services } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const features = [
    ["Personalized Plans", "Regular Monitoring", "Medical Supervision"],
    ["Natural Supplements", "Meal Replacements", "Quality Certified"],
    ["Clinical Protocols", "Condition Management", "Expert Dietitians"],
    ["InBody Analysis", "Fat Tracking", "Metabolic Rate"],
    ["B12 Injections", "Lipotropic", "Vitamin Therapy"],
    ["Behavioral Support", "Habit Formation", "Ongoing Care"],
];

export default function ServicesPage() {
    const { t } = useTranslation();

    return (
        <main className="pt-24">
            {/* Hero */}
            <section className="section-padding relative noise">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent-rose/8 rounded-full blur-[150px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-accent-rose text-sm font-semibold tracking-widest uppercase mb-4 block"
                    >
                        {t("services.subtitle")}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-display mb-4"
                    >
                        {t("services.title")}
                    </motion.h1>
                </div>
            </section>

            {/* Services detail */}
            <section className="pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 md:p-10 grid md:grid-cols-[auto_1fr_auto] gap-8 items-center"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-accent-rose/10 flex items-center justify-center text-4xl shrink-0">
                                {service.icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-3">{t(service.nameKey)}</h2>
                                <p className="text-text-muted text-sm leading-relaxed mb-4">{t(service.descKey)}</p>
                                <div className="flex flex-wrap gap-3">
                                    {features[i]?.map((feat) => (
                                        <span key={feat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-white/5 border border-white/10 text-xs text-text-secondary">
                                            <Check size={12} className="text-accent-rose" />
                                            {feat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Link href="/booking" className="btn-rose !text-sm shrink-0">
                                {t("nav.booking")} <ArrowRight size={14} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
