<?php
// ============================================================
//  Lover Diet Center — Secure MySQL Connection
//  Place this file at: /public_html/api/db_connect.php
//  Update credentials with your actual Hostinger DB details
// ============================================================

define('DB_HOST', 'localhost');          // Usually 'localhost' on Hostinger
define('DB_NAME', 'your_database_name'); // Your MySQL DB name from Hostinger panel
define('DB_USER', 'your_db_user');       // Your MySQL username
define('DB_PASS', 'your_db_password');   // Your MySQL password
define('DB_CHARSET', 'utf8mb4');

function get_db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Database connection failed']);
            exit;
        }
    }
    return $pdo;
}

// CORS headers — allow requests from your Next.js frontend domain
function set_cors_headers(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    // Restrict to your domain in production, e.g.: 'https://yourdomain.com'
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

function json_response(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
