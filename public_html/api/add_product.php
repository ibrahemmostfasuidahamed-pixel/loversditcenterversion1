<?php
// ============================================================
//  add_product.php — Add a new product (with file upload)
//  URL: https://yourdomain.com/api/add_product.php
//  Method: POST (multipart/form-data for file uploads)
//  Fields: name, description, price, category, image (file), video (file)
// ============================================================
require_once __DIR__ . '/db_connect.php';

set_cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

// ── Validate required fields ──────────────────────────────
$name        = trim($_POST['name']        ?? '');
$description = trim($_POST['description'] ?? '');
$price       = trim($_POST['price']       ?? '0');
$category    = trim($_POST['category']    ?? 'other');

if ($name === '') {
    json_response(['error' => 'Product name is required'], 422);
}

// ── Sanitize ──────────────────────────────────────────────
$name        = htmlspecialchars($name,        ENT_QUOTES, 'UTF-8');
$description = htmlspecialchars($description, ENT_QUOTES, 'UTF-8');
$price       = htmlspecialchars($price,       ENT_QUOTES, 'UTF-8');
$category    = htmlspecialchars($category,    ENT_QUOTES, 'UTF-8');

// ── File upload helper ────────────────────────────────────
$upload_dir = dirname(__DIR__) . '/uploads/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

function handle_upload(string $field, string $upload_dir, array $allowed_types): string|null {
    if (empty($_FILES[$field]['tmp_name'])) return null;

    $file     = $_FILES[$field];
    $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $mime     = mime_content_type($file['tmp_name']);

    if (!in_array($mime, $allowed_types, true)) {
        json_response(['error' => "Invalid file type for $field: $mime"], 422);
    }

    if ($file['size'] > 50 * 1024 * 1024) { // 50 MB cap
        json_response(['error' => "File $field exceeds 50 MB limit"], 422);
    }

    $filename  = uniqid('ldc_', true) . '.' . $ext;
    $dest      = $upload_dir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        json_response(['error' => "Failed to save $field"], 500);
    }

    return 'uploads/' . $filename;
}

$image_path = handle_upload('image', $upload_dir, [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
]);

$video_path = handle_upload('video', $upload_dir, [
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
]);

// ── Insert into DB ────────────────────────────────────────
$pdo  = get_db();
$stmt = $pdo->prepare(
    'INSERT INTO products (name, description, price, image, video, category)
     VALUES (:name, :description, :price, :image, :video, :category)'
);

$stmt->execute([
    ':name'        => $name,
    ':description' => $description,
    ':price'       => $price,
    ':image'       => $image_path,
    ':video'       => $video_path,
    ':category'    => $category,
]);

$new_id = $pdo->lastInsertId();
$product = $pdo->prepare('SELECT * FROM products WHERE id = :id');
$product->execute([':id' => $new_id]);

json_response(['success' => true, 'product' => $product->fetch()], 201);
