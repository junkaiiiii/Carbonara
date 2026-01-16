<?php
session_start();
if (empty($_SESSION['user_id'])){
    respond(['error'=> 'Please Login First'], 400);
}

include "headers.php";
include "helpers.php";
include "../db_connect.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET"){
    $sql = "SELECT 
    (
        COALESCE((SELECT SUM(points_earned) FROM points_log WHERE user_id = ?), 0) 
        - 
        COALESCE((SELECT SUM(cost) FROM redemption WHERE user_id = ?), 0)
    ) AS available_points;";
    $stmt = mysqli_prepare($conn,$sql);
    mysqli_stmt_bind_param($stmt, 'ss', $_SESSION['user_id'], $_SESSION['user_id']);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($result){
        $row = mysqli_fetch_assoc($result);

        respond(intval($row['available_points']));
    }
}else{
    respond(['error'=>'invalid request method'],400);
}