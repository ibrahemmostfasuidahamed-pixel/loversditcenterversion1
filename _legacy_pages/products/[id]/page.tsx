"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { products } from "@/lib/utils";
import Link from "next/link";
import { Star, ArrowLeft, ShoppingBag, MessageCircle } from "lucide-react";

export default function ProductDetailPage() {
    const { id } = useParams();
    const { t, locale } = useTranslation();
    const product = products.find((p) => p.id === id);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center">
                    <h1 className="text-4xl font-display mb-4">Product Not Found</h1>
                    <Link href="/products" className="btn-outline">
                        <ArrowLeft size={16} /> Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const related = products.filter((p) => p.id !== id).slice(0, 3);

    return (
        <main className="pt-24">
            <section className="section-padding">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/products" className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-accent-rose transition-colors mb-8">
                        <ArrowLeft size={16} /> {locale === "ar" ? "العودة للمنتجات" : "Back to Products"}
                    </Link>

                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card flex items-center justify-center h-80 md:h-[450px] text-8xl"
                        >
                            {product.image}
                        </motion.div>

                        {/* Details */}
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                            <span className="px-3 py-1 rounded-pill bg-accent-rose/10 text-accent-rose text-xs font-semibold uppercase">
                                {product.category}
                            </span>

                            <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3">
                                {locale === "ar" ? product.nameAr : product.name}
                            </h1>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <Star key={j} size={16} className={j < Math.floor(product.rating) ? "text-accent-gold fill-accent-gold" : "text-text-muted"} />
                                    ))}
                                </div>
                                <span className="text-text-muted text-sm">({product.reviews} reviews)</span>
                            </div>

                            <p className="text-text-secondary leading-relaxed mb-6">
                                {locale === "ar" ? product.descAr : product.description}
                            </p>

                            <p className="text-4xl font-bold text-accent-rose mb-8">
                                {product.price} <span className="text-lg text-text-muted">{product.currency}</span>
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button className="btn-rose">
                                    <ShoppingBag size={18} /> {t("products.addToCart")}
                                </button>
                                <a
                                    href={`https://wa.me/971501234567?text=${encodeURIComponent(`I'm interested in ${product.name}`)}`}
                                    target="_blank"
                                    rel="noopener"
                                    className="btn-outline"
                                >
                                    <MessageCircle size={18} /> WhatsApp Order
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Related Products */}
                    {related.length > 0 && (
                        <div className="mt-20">
                            <h2 className="text-2xl font-display mb-8">{locale === "ar" ? "منتجات ذات صلة" : "Related Products"}</h2>
                            <div className="grid sm:grid-cols-3 gap-6">
                                {related.map((rp) => (
                                    <Link key={rp.id} href={`/products/${rp.id}`} className="glass-card p-6 group">
                                        <div className="h-32 rounded-2xl bg-bg-elevated flex items-center justify-center text-4xl mb-4 group-hover:shadow-rose-glow-sm transition-shadow">
                                            {rp.image}
                                        </div>
                                        <h3 className="font-bold text-sm mb-1">{locale === "ar" ? rp.nameAr : rp.name}</h3>
                                        <p className="text-accent-rose font-bold">{rp.price} {rp.currency}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
