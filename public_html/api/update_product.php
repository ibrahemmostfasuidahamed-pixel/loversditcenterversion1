<?php
// ============================================================
//  update_product.php — Update product details + optional re-upload
//  URL: https://yourdomain.com/api/update_product.php
//  Method: POST (multipart/form-data)
//  Required: id, + any fields to update
// ============================================================
require_once __DIR__ . '/db_connect.php';

set_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$id = (int)($_POST['id'] ?? 0);
if ($id <= 0) {
    json_response(['error' => 'Valid product ID is required'], 422);
}

$pdo = get_db();

// Fetch existing product
$existing = $pdo->prepare('SELECT * FROM products WHERE id = :id');
$existing->execute([':id' => $id]);
$product = $existing->fetch();

if (!$product) {
    json_response(['error' => 'Product not found'], 404);
}

// ── Sanitize text fields ──────────────────────────────────
$name        = isset($_POST['name'])        ? htmlspecialchars(trim($_POST['name']),        ENT_QUOTES, 'UTF-8') : $product['name'];
$description = isset($_POST['description']) ? htmlspecialchars(trim($_POST['description']), ENT_QUOTES, 'UTF-8') : $product['description'];
$price       = isset($_POST['price'])       ? htmlspecialchars(trim($_POST['price']),       ENT_QUOTES, 'UTF-8') : $product['price'];
$category    = isset($_POST['category'])    ? htmlspecialchars(trim($_POST['category']),    ENT_QUOTES, 'UTF-8') : $product['category'];

if ($name === '') {
    json_response(['error' => 'Product name cannot be empty'], 422);
}

// ── Handle optional file re-uploads ──────────────────────
$upload_dir = dirname(__DIR__) . '/uploads/';
if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

function handle_upload_update(string $field, string $upload_dir, array $allowed_types): string|null {
    if (empty($_FILES[$field]['tmp_name'])) return null;
    $file = $_FILES[$field];
    $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $mime = mime_content_type($file['tmp_name']);
    if (!in_array($mime, $allowed_types, true)) {
        json_response(['error' => "Invalid file type for $field"], 422);
    }
    if ($file['size'] > 50 * 1024 * 1024) {
        json_response(['error' => "File $field exceeds 50 MB limit"], 422);
    }
    $filename = uniqid('ldc_', true) . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], $upload_dir . $filename)) {
        json_response(['error' => "Failed to save $field"], 500);
    }
    return 'uploads/' . $filename;
}

$image_path = handle_upload_update('image', $upload_dir, ['image/jpeg','image/png','image/webp','image/gif','image/avif'])
              ?? $product['image'];

$video_path = handle_upload_update('video', $upload_dir, ['video/mp4','video/webm','video/ogg','video/quicktime'])
              ?? $product['video'];

// ── Update DB ─────────────────────────────────────────────
$stmt = $pdo->prepare(
    'UPDATE products
     SET name = :name, description = :description, price = :price,
         image = :image, video = :video, category = :category
     WHERE id = :id'
);
$stmt->execute([
    ':name'        => $name,
    ':description' => $description,
    ':price'       => $price,
    ':image'       => $image_path,
    ':video'       => $video_path,
    ':category'    => $category,
    ':id'          => $id,
]);

$updated = $pdo->prepare('SELECT * FROM products WHERE id = :id');
$updated->execute([':id' => $id]);

json_response(['success' => true, 'product' => $updated->fetch()]);
