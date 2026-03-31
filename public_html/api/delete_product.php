<?php
// ============================================================
//  delete_product.php — Delete a product by ID
//  URL: https://yourdomain.com/api/delete_product.php
//  Method: DELETE or POST  (send: id=123)
// ============================================================
require_once __DIR__ . '/db_connect.php';

set_cors_headers();

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'DELETE' && $method !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

// Read ID from body or query string
$id = 0;
if ($method === 'DELETE') {
    parse_str(file_get_contents('php://input'), $input);
    $id = (int)($input['id'] ?? $_GET['id'] ?? 0);
} else {
    $id = (int)($_POST['id'] ?? $_GET['id'] ?? 0);
}

if ($id <= 0) {
    json_response(['error' => 'Valid product ID is required'], 422);
}

$pdo = get_db();

// Fetch first (to delete files)
$stmt = $pdo->prepare('SELECT image, video FROM products WHERE id = :id');
$stmt->execute([':id' => $id]);
$product = $stmt->fetch();

if (!$product) {
    json_response(['error' => 'Product not found'], 404);
}

// Delete associated files from disk
$base = dirname(__DIR__) . '/';
foreach (['image', 'video'] as $field) {
    if (!empty($product[$field])) {
        $path = $base . ltrim($product[$field], '/');
        if (file_exists($path)) {
            @unlink($path);
        }
    }
}

// Delete from DB
$del = $pdo->prepare('DELETE FROM products WHERE id = :id');
$del->execute([':id' => $id]);

json_response(['success' => true, 'deleted_id' => $id]);
