"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { products } from "@/lib/utils";
import Link from "next/link";
import { Star, X, ShoppingBag } from "lucide-react";

const categories = ["all", "supplements", "meal-plans"];

export default function ProductsPage() {
    const { t, locale } = useTranslation();
    const [filter, setFilter] = useState("all");
    const [quickView, setQuickView] = useState<typeof products[0] | null>(null);

    const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);

    return (
        <main className="pt-24">
            <section className="section-padding relative noise">
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-accent-gold/8 rounded-full blur-[150px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                        <h1 className="text-5xl md:text-7xl font-display mb-4">{t("products.title")}</h1>
                    </motion.div>

                    {/* Filters */}
                    <div className="flex justify-center gap-3 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-5 py-2 rounded-pill text-sm font-medium border transition-all capitalize ${filter === cat
                                        ? "bg-accent-rose text-white border-accent-rose"
                                        : "bg-transparent text-text-secondary border-white/10 hover:border-white/30"
                                    }`}
                            >
                                {cat === "all" ? (locale === "ar" ? "الكل" : "All") :
                                    cat === "supplements" ? (locale === "ar" ? "مكملات" : "Supplements") :
                                        (locale === "ar" ? "خطط وجبات" : "Meal Plans")}
                            </button>
                        ))}
                    </div>

                    {/* Product grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filtered.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card p-6 group cursor-pointer"
                                    onClick={() => setQuickView(product)}
                                >
                                    <div className="w-full h-44 rounded-2xl bg-bg-elevated flex items-center justify-center text-5xl mb-4 group-hover:shadow-rose-glow-sm transition-shadow">
                                        {product.image}
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <Star key={j} size={13} className={j < Math.floor(product.rating) ? "text-accent-gold fill-accent-gold" : "text-text-muted"} />
                                        ))}
                                        <span className="text-xs text-text-muted ml-1">({product.reviews})</span>
                                    </div>
                                    <h3 className="font-bold mb-1">{locale === "ar" ? product.nameAr : product.name}</h3>
                                    <p className="text-text-muted text-xs mb-3 line-clamp-2">
                                        {locale === "ar" ? product.descAr : product.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-accent-rose font-bold text-xl">{product.price} <span className="text-xs text-text-muted">{product.currency}</span></span>
                                        <Link href={`/products/${product.id}`} className="px-4 py-2 rounded-pill bg-accent-rose/10 text-accent-rose text-xs font-semibold hover:bg-accent-rose hover:text-white transition-all">
                                            View Details
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Quick View Modal */}
            <AnimatePresence>
                {quickView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setQuickView(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card p-8 max-w-lg w-full relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setQuickView(null)} className="absolute top-4 right-4 text-text-muted hover:text-white">
                                <X size={20} />
                            </button>
                            <div className="w-full h-48 rounded-2xl bg-bg-elevated flex items-center justify-center text-6xl mb-6">{quickView.image}</div>
                            <h2 className="text-2xl font-bold mb-2">{locale === "ar" ? quickView.nameAr : quickView.name}</h2>
                            <p className="text-text-muted text-sm mb-4">{locale === "ar" ? quickView.descAr : quickView.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-accent-rose font-bold text-2xl">{quickView.price} {quickView.currency}</span>
                                <button className="btn-rose !text-sm">
                                    <ShoppingBag size={16} /> {t("products.addToCart")}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
