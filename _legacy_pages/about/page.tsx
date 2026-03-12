"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { doctors } from "@/lib/utils";
import { Heart, Eye, Target, Award, Shield, Users } from "lucide-react";

export default function AboutPage() {
    const { t, locale } = useTranslation();

    const values = [
        { icon: <Heart className="text-accent-rose" />, en: "Compassionate Care", ar: "رعاية بالحب" },
        { icon: <Shield className="text-accent-gold" />, en: "Medical Excellence", ar: "التميز الطبي" },
        { icon: <Users className="text-accent-rose-light" />, en: "Patient-First", ar: "المريض أولاً" },
        { icon: <Award className="text-accent-gold" />, en: "Proven Results", ar: "نتائج مثبتة" },
    ];

    return (
        <main className="pt-24">
            {/* Hero */}
            <section className="section-padding relative noise">
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-accent-rose/8 rounded-full blur-[150px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-display mb-4">
                        {t("about.title")}
                    </motion.h1>
                </div>
            </section>

            {/* Story */}
            <section className="pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-10 text-center">
                        <h2 className="text-3xl font-display mb-6 gradient-text-rose">{t("about.story")}</h2>
                        <p className="text-text-secondary leading-relaxed text-lg">
                            {locale === "ar"
                                ? "بدأت لوفر دايت سنتر برؤية بسيطة: جعل فقدان الوزن آمناً وفعالاً ومستداماً للجميع. مع سنوات من الخبرة في التغذية السريرية وطب السمنة، بنينا عيادة تجمع بين العلم والرعاية الشخصية."
                                : "Lover Diet Center started with a simple vision: making weight loss safe, effective, and sustainable for everyone. With years of experience in clinical nutrition and bariatric medicine, we've built a clinic that combines science with personalized care."}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-8">
                        <div className="w-14 h-14 rounded-2xl bg-accent-rose/10 flex items-center justify-center mb-4">
                            <Target className="text-accent-rose" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{t("about.mission")}</h3>
                        <p className="text-text-muted leading-relaxed">
                            {locale === "ar"
                                ? "تمكين الأفراد من تحقيق أهدافهم الصحية من خلال برامج تخسيس طبية مدعومة بالعلم، في بيئة داعمة ومحبة."
                                : "To empower individuals to achieve their health goals through science-backed medical weight loss programs in a supportive, caring environment."}
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card p-8">
                        <div className="w-14 h-14 rounded-2xl bg-accent-gold/10 flex items-center justify-center mb-4">
                            <Eye className="text-accent-gold" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{t("about.vision")}</h3>
                        <p className="text-text-muted leading-relaxed">
                            {locale === "ar"
                                ? "أن نصبح المرجع الأول في منطقة الخليج لخدمات التخسيس الطبي، معروفين بنتائجنا المتميزة ونهجنا المتمحور حول المريض."
                                : "To become the Gulf region's leading reference for medical weight loss services, known for our exceptional results and patient-centered approach."}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((val, i) => (
                            <motion.div
                                key={val.en}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-6 text-center"
                            >
                                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                                    {val.icon}
                                </div>
                                <h3 className="font-bold">{locale === "ar" ? val.ar : val.en}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="section-padding noise">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-display text-center mb-12">{t("doctors.title")}</h2>
                    <div className="grid sm:grid-cols-3 gap-8">
                        {doctors.map((doc, i) => (
                            <motion.div key={doc.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass-card p-8 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-rose/30 to-accent-gold/20 flex items-center justify-center text-2xl font-bold border-2 border-white/10">
                                    {doc.avatar}
                                </div>
                                <h3 className="text-lg font-bold mb-1">{locale === "ar" ? doc.nameAr : doc.name}</h3>
                                <p className="text-accent-rose text-sm">{locale === "ar" ? doc.specialtyAr : doc.specialty}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
