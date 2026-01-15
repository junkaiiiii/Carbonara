<?php
session_start();

if (empty($_SESSION["user_id"])) {
    respond(['error' => 'Please Log In First', 400]);
}

include("../db_connect.php");
include("headers.php");
include("helpers.php");

$method = $_SERVER["REQUEST_METHOD"];
$user_id = $_SESSION['user_id'];

if ($method === "GET") {
    $mode = $_GET['mode'] ?? '';

    if (empty($mode)) {
        respond(['error' => 'Invalid Request Attribute', 400]);
    }

    if ($mode === "all") {
        $sql = "SELECT p.prize_id, 
                    p.prize_name,
                    p.points_required,
                    p.stock,
                    p.prize_type,
                    p.prize_image_url,

                    r.redemption_id

                 FROM prizes p
                LEFT JOIN redemption r ON p.prize_id = r.prize_id AND r.user_id= ? 
                WHERE p.stock > 0;
                ";
                
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, 's', $user_id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        $response = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $response[] = [
                "prize_id"        => $row['prize_id'],
                "prize_name"      => $row['prize_name'],
                "points_required" => (int)$row['points_required'], // Cast to int for safety
                "stock"           => (int)$row['stock'],           // Cast to int for safety
                "prize_type"      => $row['prize_type'],
                "prize_image_url" => $row['prize_image_url'],
                
                // LOGIC: If redemption_id is NOT empty (meaning not NULL), return true.
                "redeemed"        => !empty($row['redemption_id']) 
            ];
        }
    }

    respond($response);
}
