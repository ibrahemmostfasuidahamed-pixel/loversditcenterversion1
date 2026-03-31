'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProductsSection.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────
type Product = {
  id: string | number;
  name: string;
  name_ar: string;
  name_en: string;
  description: string;
  description_ar: string;
  description_en: string;
  price: string | number;
  discount_price?: string | number | null;
  category: string;
  image?: string | null;
  is_featured?: boolean;
  created_at: string;
};

// ─── Category Labels ───────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, { ar: string; en: string; icon: string }> = {
  meals: { ar: 'وجبات صحية', en: 'Healthy Meals', icon: '🍽️' },
  consultation: { ar: 'استشارات', en: 'Consultation', icon: '🌿' },
  fatburn: { ar: 'تكسير دهون', en: 'Fat Burning', icon: '💪' },
  supplements: { ar: 'مكملات', en: 'Supplements', icon: '💊' },
  vitamins: { ar: 'فيتامينات', en: 'Vitamins', icon: '🧪' },
  omega: { ar: 'أوميجا', en: 'Omega-3', icon: '🐟' },
  collagen: { ar: 'كولاجين', en: 'Collagen', icon: '✨' },
  minerals: { ar: 'معادن', en: 'Minerals', icon: '⚗️' },
  protein: { ar: 'بروتين', en: 'Protein', icon: '⚡' },
  general: { ar: 'عام', en: 'General', icon: '🌿' },
};

function getCategoryInfo(key: string) {
  return CATEGORY_LABELS[key] ?? { ar: key, en: key, icon: '🌿' };
}

// ─── Placeholder SVG when no image ────────────────────────────────────────────
function ProductPlaceholder({ category }: { category: string }) {
  const info = getCategoryInfo(category);
  return (
    <div className={styles.placeholder}>
      <div className={styles.placeholderIcon}>{info.icon}</div>
      <div className={styles.placeholderBg} />
    </div>
  );
}

// ─── Single Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, index, locale }: { product: Product; index: number; locale: string }) {
  const isRTL = locale === 'ar';
  const catInfo = getCategoryInfo(product.category);

  const hasDiscount =
    product.discount_price !== null &&
    product.discount_price !== undefined &&
    Number(product.discount_price) > 0;

  const displayPrice = hasDiscount
    ? Number(product.discount_price)
    : Number(product.price);

  const originalPrice = Number(product.price);

  const discountPct = hasDiscount
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  const arabicName = product.name_ar || product.name;
  const englishName = product.name_en || product.name;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      dir="rtl"
    >
      {/* ── Badge ────────────────────────────────────────── */}
      <div className={styles.badge}>
        <span>{catInfo.icon}</span>
        <span>{isRTL ? catInfo.ar : catInfo.en}</span>
      </div>

      {/* ── Discount badge ───────────────────────────────── */}
      {hasDiscount && (
        <div className={styles.discountBadge}>
          -{discountPct}%
        </div>
      )}

      {/* ── Featured star ────────────────────────────────── */}
      {product.is_featured && (
        <div className={styles.featuredBadge} title="منتج مميز">⭐</div>
      )}

      {/* ── Image / Placeholder ──────────────────────────── */}
      <div className={styles.imageWrap}>
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={arabicName}
            className={styles.image}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const ph = parent.querySelector(`.${styles.placeholder}`) as HTMLElement | null;
                if (ph) ph.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <ProductPlaceholder category={product.category} />
        <div className={styles.imageOverlay} />
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className={styles.content}>
        {/* Names */}
        <div className={styles.names}>
          <h3 className={styles.nameAr}>{arabicName}</h3>
          <p className={styles.nameEn}>{englishName}</p>
        </div>

        {/* Description */}
        <p className={styles.description}>
          {isRTL
            ? (product.description_ar || product.description)
            : (product.description_en || product.description)}
        </p>

        {/* Price row */}
        <div className={styles.priceRow}>
          <div className={styles.prices}>
            <span className={styles.price}>{displayPrice.toFixed(2)} <span className={styles.currency}>ج.م</span></span>
            {hasDiscount && (
              <span className={styles.originalPrice}>{originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* CTA button */}
        <button className={styles.cta} type="button">
          <span>اضغط للتفاصيل</span>
          <span className={styles.ctaArrow}>←</span>
        </button>
      </div>
    </motion.article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const locale = 'ar'; // change to dynamic locale if needed

  useEffect(() => {
    // Read optional category from URL when standalone page is accessed
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const catFromUrl = searchParams?.get('category');
    if (catFromUrl) {
      setActiveCategory(catFromUrl);
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('[ProductsSection] Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Unique categories from fetched products
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (!loading && products.length === 0) return null;

  return (
    <section className={styles.section} dir="rtl">
      {/* ── Ambient glow decorations ── */}
      <div className={styles.glowLeft} />
      <div className={styles.glowRight} />

      <div className={styles.inner}>
        {/* ── Section header ── */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.pill}>🌿 مكملاتنا الغذائية</div>
          <h2 className={styles.title}>
            منتجات <span className={styles.accent}>صحية</span> مختارة بعناية
          </h2>
          <p className={styles.subtitle}>
            فيتامينات ومكملات غذائية عالية الجودة لدعم صحتك وحيويتك اليومية
          </p>
        </motion.div>

        {/* ── Category filter tabs ── */}
        {!loading && categories.length > 2 && (
          <motion.div
            className={styles.filterRow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {categories.map((cat) => {
              const info = getCategoryInfo(cat);
              return (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'all' ? (
                    <><span>🛒</span> الكل</>
                  ) : (
                    <><span>{info.icon}</span> {info.ar}</>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${styles.card} ${styles.skeleton}`}>
                <div className={styles.skeletonImg} />
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonLine} style={{ width: '70%' }} />
                  <div className={styles.skeletonLine} style={{ width: '50%', height: '14px' }} />
                  <div className={styles.skeletonLine} style={{ width: '90%', height: '12px', marginTop: '12px' }} />
                  <div className={styles.skeletonLine} style={{ width: '80%', height: '12px' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Product grid ── */}
        {!loading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className={styles.grid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {filtered.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={idx}
                  locale={locale}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Empty state ── */}
        {!loading && filtered.length === 0 && (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={styles.emptyIcon}>🔍</div>
            <p>لا توجد منتجات في هذه الفئة</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
