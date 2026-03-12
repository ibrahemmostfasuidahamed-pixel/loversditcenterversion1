"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

const transformations = [
    { id: 1, name: "Ahmed K.", nameAr: "أحمد ك.", gender: "male", weightLost: 30, duration: 4, before: "🫃", after: "🧍‍♂️" },
    { id: 2, name: "Fatima S.", nameAr: "فاطمة س.", gender: "female", weightLost: 22, duration: 3, before: "🧍‍♀️", after: "💃" },
    { id: 3, name: "Omar M.", nameAr: "عمر م.", gender: "male", weightLost: 35, duration: 5, before: "🫃", after: "🧍‍♂️" },
    { id: 4, name: "Sara H.", nameAr: "سارة ح.", gender: "female", weightLost: 18, duration: 3, before: "🧍‍♀️", after: "💃" },
    { id: 5, name: "Khalid A.", nameAr: "خالد ع.", gender: "male", weightLost: 28, duration: 4, before: "🫃", after: "🧍‍♂️" },
    { id: 6, name: "Noor R.", nameAr: "نور ر.", gender: "female", weightLost: 15, duration: 2, before: "🧍‍♀️", after: "💃" },
];

export default function TransformationPage() {
    const { t, locale } = useTranslation();
    const [filter, setFilter] = useState("all");

    const filtered = filter === "all"
        ? transformations
        : transformations.filter((t) => t.gender === filter);

    return (
        <main className="pt-24">
            <section className="section-padding relative noise">
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-accent-rose/8 rounded-full blur-[150px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                        <h1 className="text-5xl md:text-7xl font-display mb-4">{t("results.title")}</h1>
                        <p className="text-text-muted text-lg">{t("results.subtitle")}</p>
                    </motion.div>

                    {/* Filters */}
                    <div className="flex justify-center gap-3 mb-12">
                        {[
                            { key: "all", en: "All", ar: "الكل" },
                            { key: "male", en: "Male", ar: "ذكور" },
                            { key: "female", en: "Female", ar: "إناث" },
                        ].map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-5 py-2 rounded-pill text-sm font-medium border transition-all ${filter === f.key
                                        ? "bg-accent-rose text-white border-accent-rose"
                                        : "bg-transparent text-text-secondary border-white/10 hover:border-white/30"
                                    }`}
                            >
                                {locale === "ar" ? f.ar : f.en}
                            </button>
                        ))}
                    </div>

                    {/* Transformation grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-6 group"
                            >
                                {/* Before / After */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="bg-bg-elevated rounded-xl h-40 flex flex-col items-center justify-center relative">
                                        <span className="text-5xl grayscale opacity-60">{item.before}</span>
                                        <span className="absolute bottom-2 text-[10px] text-text-muted font-semibold uppercase tracking-wider">
                                            {locale === "ar" ? "قبل" : "Before"}
                                        </span>
                                    </div>
                                    <div className="bg-bg-elevated rounded-xl h-40 flex flex-col items-center justify-center relative">
                                        <span className="text-5xl">{item.after}</span>
                                        <span className="absolute bottom-2 text-[10px] text-accent-rose font-semibold uppercase tracking-wider">
                                            {locale === "ar" ? "بعد" : "After"}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg mb-2">{locale === "ar" ? item.nameAr : item.name}</h3>

                                <div className="flex gap-3">
                                    <span className="px-3 py-1 rounded-pill bg-accent-rose/10 text-accent-rose text-xs font-bold">
                                        -{item.weightLost} kg
                                    </span>
                                    <span className="px-3 py-1 rounded-pill bg-accent-gold/10 text-accent-gold text-xs font-bold">
                                        {item.duration} {locale === "ar" ? "أشهر" : "months"}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
