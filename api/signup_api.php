<?php
session_start();
include "headers.php";
include "helpers.php";
include "../db_connect.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST"){

    $data = json_decode(file_get_contents("php://input"), true);

    

    if ($data){
        // validate if received all required inputs  
        $required = ['fullName', 'username', 'email', 'password', 'phoneNumber'];
        foreach ($required as $field){
            if (!isset($data[$field]) || empty($data[$field])){
                respond(["error" => "Missing required field"],400);
                exit;
            }
    }
        //check if username taken
        $username = $data['username'] ?? '';
        $check_sql = "SELECT username FROM users WHERE username = ?";
        $check_stmt = mysqli_prepare($conn,$check_sql);
        mysqli_stmt_bind_param($check_stmt, 's', $username);
        mysqli_stmt_execute($check_stmt);
        mysqli_stmt_store_result($check_stmt);

        if (mysqli_stmt_num_rows($check_stmt) > 0){
            respond(['error'=>'Username already exists'],400);
            exit;
        }




        $sql = "INSERT INTO users (user_id, full_name, username, email, password_hash, role, phone, created_at)
                VALUES (?,?,?,?,?,?,?,?)";

        $stmt = mysqli_prepare($conn, $sql);
        $username = $data['username'] ?? '';
        $user_id = generateId("US_");
        $full_name = $data['fullName'] ?? '';
        $email = $data['email'] ?? '';
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        $role = 'Passenger';
        $phone = $data['phoneNumber'] ?? '';
        $created_at = date('Y-m-d H:i:s');


        mysqli_stmt_bind_param(
            $stmt, "ssssssss",
            $user_id,$full_name,$username,$email,$password_hash,$role,$phone,$created_at
        );

        if (!mysqli_stmt_execute($stmt)) {
            die("Execute failed: " . mysqli_stmt_error($stmt));
        }

        $_SESSION['user_id'] = $user_id;

        respond(["success" => true, "user_id" => $user_id]);
    }
}
?>