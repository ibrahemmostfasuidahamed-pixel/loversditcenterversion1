"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Check, Calendar, Clock } from "lucide-react";

const schema = z.object({
    name: z.string().min(2),
    age: z.string().min(1),
    gender: z.string().min(1),
    phone: z.string().min(8),
    email: z.string().email(),
    currentWeight: z.string().min(1),
    targetWeight: z.string().min(1),
    height: z.string().optional(),
    conditions: z.string().optional(),
    date: z.string().min(1),
    time: z.string().min(1),
    type: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "02:00 PM", "03:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM",
];

export default function BookingPage() {
    const { t } = useTranslation();
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const { register, watch, trigger, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { gender: "male", type: "in-person" },
    });

    const steps = [t("booking.step1"), t("booking.step2"), t("booking.step3"), t("booking.step4")];

    const next = async () => {
        const fieldsPerStep: (keyof FormData)[][] = [
            ["name", "age", "gender", "phone", "email"],
            ["currentWeight", "targetWeight"],
            ["date", "time", "type"],
        ];
        const isValid = await trigger(fieldsPerStep[step]);
        if (isValid) setStep((s) => Math.min(s + 1, 3));
    };

    const onSubmit = async (data: FormData) => {
        try {
            await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            setSubmitted(true);
        } catch (e) {
            console.error(e);
        }
    };

    if (submitted) {
        return (
            <main className="pt-24 min-h-screen flex items-center justify-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center glass-card p-12 max-w-md mx-4">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check size={40} className="text-green-400" />
                    </div>
                    <h2 className="text-3xl font-display mb-3">{t("booking.success")}</h2>
                    <p className="text-text-muted mb-6">{t("booking.successMsg")}</p>
                    <a href="/" className="btn-rose">{t("nav.home")}</a>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="pt-24 min-h-screen">
            <section className="section-padding relative noise">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent-rose/8 rounded-full blur-[150px]" />
                </div>
                <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="text-4xl md:text-6xl font-display mb-3 hero-gradient-text">{t("booking.title")}</h1>
                        <p className="text-text-muted">{t("booking.subtitle")}</p>
                    </motion.div>

                    {/* Stepper */}
                    <div className="flex items-center justify-center gap-0 mb-10">
                        {steps.map((label, i) => (
                            <div key={label} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${i <= step ? "bg-accent-rose border-accent-rose text-white" : "border-white/20 text-text-muted"
                                        }`}>
                                        {i < step ? <Check size={16} /> : i + 1}
                                    </div>
                                    <span className="text-[10px] mt-2 text-text-muted max-w-[60px] text-center">{label}</span>
                                </div>
                                {i < 3 && <div className={`w-12 sm:w-20 h-px mx-1 ${i < step ? "bg-accent-rose" : "bg-white/10"}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="glass-card p-8">
                            <AnimatePresence mode="wait">
                                {/* Step 1: Personal Info */}
                                {step === 0 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("booking.name")}</label>
                                            <input {...register("name")} className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors" />
                                            {errors.name && <p className="text-red-400 text-xs mt-1">Required</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">{t("booking.age")}</label>
                                                <input type="number" {...register("age")} className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">{t("booking.gender")}</label>
                                                <div className="flex gap-2">
                                                    {["male", "female"].map((g) => (
                                                        <button key={g} type="button" onClick={() => setValue("gender", g)}
                                                            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all border ${watch("gender") === g ? "bg-accent-rose/20 border-accent-rose text-accent-rose" : "bg-bg-elevated border-white/10 text-text-muted"
                                                                }`}
                                                        >
                                                            {g === "male" ? t("booking.male") : t("booking.female")}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("booking.phone")}</label>
                                            <input {...register("phone")} placeholder="+971 50 XXX XXXX" className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("booking.email")}</label>
                                            <input type="email" {...register("email")} className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors" />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Health Profile */}
                                {step === 1 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">{t("booking.currentWeight")}</label>
                                                <input type="number" {...register("currentWeight")} className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">{t("booking.targetWeight")}</label>
                                                <input type="number" {...register("targetWeight")} className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("booking.height")}</label>
                                            <input type="number" {...register("height")} className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("booking.conditions")}</label>
                                            <textarea {...register("conditions")} rows={3} className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors resize-none" />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Schedule */}
                                {step === 2 && (
                                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium mb-2"><Calendar size={14} className="inline mr-1" />{t("booking.date")}</label>
                                            <input type="date" {...register("date")} className="w-full bg-bg-elevated border border-white/10 rounded-2xl px-4 py-3 text-sm focus:border-accent-rose focus:outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2"><Clock size={14} className="inline mr-1" />{t("booking.time")}</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {timeSlots.map((slot) => (
                                                    <button key={slot} type="button" onClick={() => setValue("time", slot)}
                                                        className={`py-2.5 rounded-xl text-xs font-medium transition-all border ${watch("time") === slot ? "bg-accent-rose/20 border-accent-rose text-accent-rose" : "bg-bg-elevated border-white/10 text-text-muted hover:border-white/30"
                                                            }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t("booking.type")}</label>
                                            <div className="flex gap-3">
                                                {[{ key: "in-person", label: t("booking.inPerson") }, { key: "video", label: t("booking.video") }].map((opt) => (
                                                    <button key={opt.key} type="button" onClick={() => setValue("type", opt.key)}
                                                        className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all border ${watch("type") === opt.key ? "bg-accent-rose/20 border-accent-rose text-accent-rose" : "bg-bg-elevated border-white/10 text-text-muted"
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 4: Confirmation */}
                                {step === 3 && (
                                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <h3 className="text-xl font-bold mb-6">{t("booking.step4")}</h3>
                                        <div className="space-y-3 text-sm">
                                            {[
                                                [t("booking.name"), watch("name")],
                                                [t("booking.phone"), watch("phone")],
                                                [t("booking.email"), watch("email")],
                                                [t("booking.currentWeight"), watch("currentWeight") + " kg"],
                                                [t("booking.targetWeight"), watch("targetWeight") + " kg"],
                                                [t("booking.date"), watch("date")],
                                                [t("booking.time"), watch("time")],
                                                [t("booking.type"), watch("type")],
                                            ].map(([label, value]) => (
                                                <div key={label} className="flex justify-between py-2 border-b border-white/5">
                                                    <span className="text-text-muted">{label}</span>
                                                    <span className="font-medium">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="flex justify-between mt-8">
                                {step > 0 ? (
                                    <button type="button" onClick={() => setStep(s => s - 1)} className="btn-outline !text-sm">
                                        <ArrowLeft size={16} /> {t("booking.back")}
                                    </button>
                                ) : <div />}
                                {step < 3 ? (
                                    <button type="button" onClick={next} className="btn-rose !text-sm">
                                        {t("booking.next")} <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button type="submit" className="btn-rose !text-sm">
                                        {t("booking.confirm")} <Check size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}
