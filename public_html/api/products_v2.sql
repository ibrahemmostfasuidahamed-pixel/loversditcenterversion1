-- ============================================================
--  Lover Diet Center — Products Table v2
--  Run this in phpMyAdmin → SQL tab on your Hostinger database
--  This replaces the old single-language products table
-- ============================================================

-- Drop old table if it exists (CAREFUL in production!)
-- DROP TABLE IF EXISTS `products`;

CREATE TABLE IF NOT EXISTS `products` (
  `id`              INT            NOT NULL AUTO_INCREMENT,
  `name_ar`         VARCHAR(255)   NOT NULL COMMENT 'Arabic product name',
  `name_en`         VARCHAR(255)   NOT NULL COMMENT 'English product name',
  `description_ar`  TEXT                    COMMENT 'Arabic description',
  `description_en`  TEXT                    COMMENT 'English description',
  `price`           DECIMAL(10,2)  NOT NULL COMMENT 'Regular price (EGP/AED)',
  `discount_price`  DECIMAL(10,2)  DEFAULT NULL COMMENT 'Sale price (NULL = no discount)',
  `category`        VARCHAR(100)   DEFAULT 'general',
  `image_url`       VARCHAR(500)   DEFAULT NULL,
  `is_featured`     BOOLEAN        DEFAULT 0,
  `is_active`       BOOLEAN        DEFAULT 1,
  `created_at`      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `idx_category`   (`category`),
  INDEX `idx_is_active`  (`is_active`),
  INDEX `idx_is_featured`(`is_featured`),
  INDEX `idx_created`    (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  Seed Data — 6 Medical Supplements & Vitamins
-- ============================================================

INSERT INTO `products`
  (`name_ar`, `name_en`, `description_ar`, `description_en`, `price`, `discount_price`, `category`, `image_url`, `is_featured`, `is_active`)
VALUES

-- 1. Multivitamins
(
  'مالتي فيتامين متكامل',
  'Complete Multivitamin',
  'مجموعة شاملة من الفيتامينات والمعادن الأساسية لدعم المناعة والطاقة اليومية. مصنوع من مستخلصات طبيعية 100٪.',
  'A comprehensive blend of essential vitamins and minerals to support immunity and daily energy. Made from 100% natural extracts.',
  85.00,
  65.00,
  'vitamins',
  NULL,
  1,
  1
),

-- 2. Omega-3
(
  'أوميجا 3 عالي النقاء',
  'Premium Omega-3 Fish Oil',
  'زيت السمك الغني بأحماض أوميجا 3 الدهنية EPA وDHA لدعم صحة القلب والدماغ والمفاصل.',
  'Rich fish oil with EPA & DHA omega-3 fatty acids for heart, brain, and joint health support.',
  120.00,
  95.00,
  'omega',
  NULL,
  1,
  1
),

-- 3. Collagen
(
  'كولاجين بحري فاخر',
  'Marine Collagen Peptides',
  'كولاجين مستخرج من أعماق البحار يساعد على تحسين مرونة الجلد وصحة المفاصل والشعر والأظافر.',
  'Deep-sea extracted collagen that helps improve skin elasticity, joint health, hair, and nails.',
  150.00,
  NULL,
  'collagen',
  NULL,
  0,
  1
),

-- 4. Zinc
(
  'زنك مع فيتامين سي',
  'Zinc + Vitamin C Complex',
  'مزيج مقوٍ من الزنك وفيتامين C لتعزيز المناعة، التئام الجروح، وحماية الخلايا من الأكسدة.',
  'A powerful combination of Zinc and Vitamin C to boost immunity, wound healing, and protect cells from oxidation.',
  55.00,
  45.00,
  'minerals',
  NULL,
  0,
  1
),

-- 5. Vitamin D3
(
  'فيتامين د3 + ك2',
  'Vitamin D3 + K2 Complex',
  'فيتامين د3 بجرعة عالية مع ك2 لتحسين امتصاص الكالسيوم وتعزيز صحة العظام والمناعة.',
  'High-dose Vitamin D3 with K2 for improved calcium absorption and enhanced bone and immune health.',
  90.00,
  NULL,
  'vitamins',
  NULL,
  1,
  1
),

-- 6. Magnesium
(
  'مغنيسيوم جلايسينات',
  'Magnesium Glycinate',
  'أفضل أشكال المغنيسيوم امتصاصاً لتحسين جودة النوم، تخفيف التوتر، والحد من تشنجات العضلات.',
  'The most bioavailable form of magnesium for better sleep quality, stress relief, and muscle cramp reduction.',
  75.00,
  60.00,
  'minerals',
  NULL,
  0,
  1
);
