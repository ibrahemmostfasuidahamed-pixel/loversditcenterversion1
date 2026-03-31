<?php
// ============================================================
//  get_products.php v2 — Bilingual products (AR + EN)
//  URL: https://yourdomain.com/api/get_products.php
//  Method: GET
//  Optional query params:
//    ?category=vitamins
//    ?featured=1        (only featured products)
//    ?locale=ar|en      (preferred locale, default=ar)
// ============================================================
require_once __DIR__ . '/db_connect.php';

set_cors_headers();

$pdo      = get_db();
$category = isset($_GET['category']) ? trim($_GET['category']) : '';
$featured = isset($_GET['featured']) && $_GET['featured'] === '1';
$locale   = isset($_GET['locale']) && $_GET['locale'] === 'en' ? 'en' : 'ar';

// Build WHERE clause
$where  = ['p.is_active = 1'];
$params = [];

if ($category !== '') {
    $where[]            = 'p.category = :category';
    $params[':category'] = $category;
}
if ($featured) {
    $where[] = 'p.is_featured = 1';
}

$sql = 'SELECT
            p.id,
            p.name_ar,
            p.name_en,
            p.description_ar,
            p.description_en,
            p.price,
            p.discount_price,
            p.category,
            p.image_url,
            p.is_featured,
            p.created_at
        FROM products p
        WHERE ' . implode(' AND ', $where) . '
        ORDER BY p.is_featured DESC, p.created_at DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

// Resolve image URLs + format prices
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host     = $_SERVER['HTTP_HOST'] ?? 'localhost';

$products = [];
foreach ($rows as $p) {
    // Make image URL absolute if it's a relative path
    $imgUrl = $p['image_url'];
    if ($imgUrl && !str_starts_with($imgUrl, 'http')) {
        $imgUrl = $protocol . '://' . $host . '/uploads/' . ltrim($imgUrl, '/uploads/');
    }

    // Unified "name" and "description" based on locale (for backward compat)
    $name        = $locale === 'en' ? $p['name_en']        : $p['name_ar'];
    $description = $locale === 'en' ? $p['description_en'] : $p['description_ar'];

    $products[] = [
        'id'             => $p['id'],
        'name'           => $name,           // Active-locale shorthand
        'name_ar'        => $p['name_ar'],
        'name_en'        => $p['name_en'],
        'description'    => $description,    // Active-locale shorthand
        'description_ar' => $p['description_ar'],
        'description_en' => $p['description_en'],
        'price'          => $p['price'],
        'discount_price' => $p['discount_price'],
        'category'       => $p['category'],
        'image'          => $imgUrl,         // Kept as "image" for backward compat
        'is_featured'    => (bool)$p['is_featured'],
        'created_at'     => $p['created_at'],
    ];
}

json_response(['products' => $products, 'count' => count($products)]);
