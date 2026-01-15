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
    $sql = "SELECT COALESCE(SUM(points_earned),0) AS points 
            FROM points_log
            WHERE user_id = ? 
            GROUP BY user_id";
    $stmt = mysqli_prepare($conn,$sql);
    mysqli_stmt_bind_param($stmt, 's', $_SESSION['user_id']);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($result){
        $row = mysqli_fetch_assoc($result);

        respond(intval($row['points']));
    }
}else{
    respond(['error'=>'invalid request method'],400);
}