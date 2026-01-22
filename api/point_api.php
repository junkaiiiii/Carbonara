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
}elseif($method === "POST"){
    $data = json_decode(file_get_contents("php://input"),true);
    $required = ['userId','rideId','points'];

    // validate data passed from front end
    foreach ($required as $r){
        if (empty($data[$r])){
            respond(['error'=>'missing required field'],400);
        }
    }
    

    $sql = "INSERT INTO points_log ('point_id', 'ride_id', 'user_id', 'points_earned', 'log_at') 
    VALUES (?, ?, ?, ?, ?);
    ";

    $stmt = mysqli_prepare($conn, $sql);

    $point_id = generateId("PO");
    $log_at = date('Y-m-d H:i:s');
    respond($data, $point_id, $log_at);
    mysqli_stmt_bind_param($stmt,"sssis", $point_id, $data['rideId'], $data['userId'], intval($data['points']), $log_at);
    $executed = mysqli_stmt_execute($stmt);

    if (!$executed) {
        respond([
            "error" => "Database execution failed",
            "details" => mysqli_stmt_error($stmt)
        ], 500);
    }

    if (mysqli_stmt_affected_rows($stmt) === 0) {
        respond([
            "error" => "No new point data is inserted"
        ], 404);
    }

    respond(["success" => "Successfully created a new point entry $point_id"],200);
}else{
    respond(['error'=>'invalid request method'],400);
}