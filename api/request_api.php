<?php

session_start();
include "headers.php";
include "helpers.php";
include "../db_connect.php";

$method = $_SERVER["REQUEST_METHOD"];
$room_code = $_GET['room_code'] ?? '';

if (empty($room_code)){
    respond(["error"=>"Room code is required."],400);
}

$session_user_id = $_SESSION['user_id'];
if (empty($session_user_id)){
    respond(["error"=>"Please login to request. User id is required"],400);
}

if ($method === "GET"){
    //check if the same user already rquested the same ride or not
    $check_sql = "
        SELECT request_id FROM requests re
        INNER JOIN rides r ON re.ride_id = r.ride_id
        WHERE re.passenger_id = ? AND r.room_code = ?
    ";
    $check_stmt = mysqli_prepare($conn,$check_sql);
    mysqli_stmt_bind_param($check_stmt,"ss",$session_user_id,$room_code);
    mysqli_stmt_execute($check_stmt);
    mysqli_stmt_store_result($check_stmt);
    mysqli_stmt_bind_result($check_stmt,$ride_id);
    if (mysqli_stmt_fetch($check_stmt)){
        respond(["error"=>"The Ride is Already Requested"]);
    }


    // get ride_id from room_code (check the validity of the room_code)
    $check_sql = "
        SELECT ride_id FROM rides
        WHERE room_code = ?;
    ";
    $check_stmt = mysqli_prepare($conn,$check_sql);
    mysqli_stmt_bind_param($check_stmt,"s",$room_code);
    mysqli_stmt_execute($check_stmt);
    mysqli_stmt_store_result($check_stmt);
    mysqli_stmt_bind_result($check_stmt,$ride_id);

    
    
    //mysqli_stmt_fetch($stmt) returns true if there is a row. 
    if (mysqli_stmt_fetch($check_stmt)){
        // request logic
        $request_id = uniqid("RQ_");
        $status = 'requested';
        $requested_at = date('Y-m-d H:i:s');

        $sql = "INSERT INTO requests (request_id, ride_id, passenger_id, status, requested_at)
                VALUES (?, ?, ?, ?, ?)";
        
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "sssss", $request_id, $ride_id, $session_user_id, $status, $requested_at);
        
        if (mysqli_stmt_execute($stmt)) {
            respond(["success" => "Request created successfully", "request_id" => $request_id]);
        } else {
            respond(["error" => "Failed to create request: " . mysqli_error($conn)], 500);
        }
        
        mysqli_stmt_close($stmt);

    }else {
        respond(["error"=>"No ride found for room_code:'$room_code'"],400);
    } 
}else {
    respond(["error"=>"dont know"],400);
} 

?>