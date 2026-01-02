<?php
session_start();

include "headers.php";
include "helpers.php";
include "../db_connect.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if ($data) {
        $required = ['username', 'password'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                respond(['error' => $field . " is required"], 400);
            }
        }
        
        $username = $data['username'];
        $password = $data['password'];

        
        $sql = "SELECT user_id, username, password_hash, role, email FROM users WHERE username = ?";
        $stmt = mysqli_prepare($conn, $sql);
        
        if (!$stmt) {
            respond(['error' => 'Database error: ' . mysqli_error($conn)], 500);
        }

        
        mysqli_stmt_bind_param($stmt, 's', $username);
        mysqli_stmt_execute($stmt);
        $db_user_id = '';
        $db_username = '';
        $db_password_hash = '';
        $db_role = '';
        $db_email = '';
        mysqli_stmt_bind_result($stmt,$db_user_id, $db_username, $db_password_hash, $db_role,$db_email);
        
        if (mysqli_stmt_fetch($stmt)) {
            
            
            if (password_verify($password, $db_password_hash)) {
                $_SESSION['user_id'] = $db_user_id;
                $_SESSION['username'] = $db_username;
                $_SESSION['role'] = $db_role;
                $_SESSION['email'] = $db_email;

                respond(["success" => "Welcome back " . $db_username, "role"=> $db_role]);
            } else {
                respond(["error" => "Invalid credentials"], 401);
            }
        } else {
            respond(["error" => "User not found"], 401);
        }
        
        mysqli_stmt_close($stmt);
    } else {
        respond(['error' => 'Invalid JSON data'], 400);
    }
} else {
    respond(['error' => 'Method not allowed'], 405);
}

// Catch-all - if we reach here, something went wrong
respond(['error' => 'Unknown error occurred'], 500);
?>