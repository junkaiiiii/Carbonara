<?php

session_start();
include "headers.php";
include "helpers.php";
include "../db_connect.php";

$method = $_SERVER["REQUEST_METHOD"];
$room_code = $_GET['room_code'] ?? '';





if ($method === "GET") {
    if (empty($room_code)) {
        respond(["error" => "Room code is required."], 400);
    }

    $session_user_id = $_SESSION['user_id'];
    if (empty($session_user_id)) {
        respond(["error" => "Please login to request."], 400);
    }

    // 1. Get ride_id and check if it exists
    $ride_sql = "SELECT ride_id FROM rides WHERE room_code = ?";
    $ride_stmt = mysqli_prepare($conn, $ride_sql);
    mysqli_stmt_bind_param($ride_stmt, "s", $room_code);
    mysqli_stmt_execute($ride_stmt);
    $result = mysqli_stmt_get_result($ride_stmt);
    $ride = mysqli_fetch_assoc($result);

    if (!$ride) {
        respond(["error" => "No ride found for room_code: '$room_code'"], 400);
    }
    $ride_id = $ride['ride_id'];

    // 2. Check for an EXISTING request (including cancelled or rejected)
    $check_sql = "SELECT request_id, status FROM requests WHERE passenger_id = ? AND ride_id = ?";
    $check_stmt = mysqli_prepare($conn, $check_sql);
    mysqli_stmt_bind_param($check_stmt, "ss", $session_user_id, $ride_id);
    mysqli_stmt_execute($check_stmt);
    $check_result = mysqli_stmt_get_result($check_stmt);
    $existing_request = mysqli_fetch_assoc($check_result);

    if ($existing_request) {
        // If it's already active or joined, don't allow a new request
        if ($existing_request['status'] === 'requested' || $existing_request['status'] === 'approved') {
            respond(["error" => "The Ride is Already Requested or Joined"]);
        }

        // 3. If it was cancelled or rejected, UPDATE the existing row instead of inserting
        $update_sql = "UPDATE requests SET status = 'requested', requested_at = NOW() WHERE request_id = ?";
        $update_stmt = mysqli_prepare($conn, $update_sql);
        mysqli_stmt_bind_param($update_stmt, "s", $existing_request['request_id']);
        
        if (mysqli_stmt_execute($update_stmt)) {
            respond(["success" => "Request re-sent successfully", "request_id" => $existing_request['request_id']]);
        } else {
            respond(["error" => "Failed to update request"], 500);
        }
    } else {
        // 4. No previous record exists, perform a fresh INSERT
        $new_request_id = uniqid("RQ_");
        $status = 'requested';
        $requested_at = date('Y-m-d H:i:s');

        $insert_sql = "INSERT INTO requests (request_id, ride_id, passenger_id, status, requested_at) VALUES (?, ?, ?, ?, ?)";
        $insert_stmt = mysqli_prepare($conn, $insert_sql);
        mysqli_stmt_bind_param($insert_stmt, "sssss", $new_request_id, $ride_id, $session_user_id, $status, $requested_at);

        if (mysqli_stmt_execute($insert_stmt)) {
            respond(["success" => "Request created successfully", "request_id" => $new_request_id]);
        } else {
            respond(["error" => "Failed to create request"], 500);
        }
    }
} elseif ($method === "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);
    $valid_status = array('requested', 'approved', 'rejected', 'cancelled');

    $ride_id = $data['ride_id'] ?? "";
    $status = in_array($data['status'], $valid_status) ? $data['status'] : "";
    $passenger_username = $data['passenger_username'] ?? "";

    if (empty($status)) {
        respond(["error" => "invalid request method"], 400);
    }

    $sql = "UPDATE requests AS r
            LEFT JOIN users AS u ON r.passenger_id = u.user_id
            SET r.status = ? 
            WHERE r.ride_id = ? AND u.username = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sss", $status, $ride_id, $passenger_username);
    $executed = mysqli_stmt_execute($stmt);

    if (!$executed) {
        respond([
            "error" => "Database execution failed",
            "details" => mysqli_stmt_error($stmt)
        ], 500);
    }

    if (mysqli_stmt_affected_rows($stmt) === 0) {
        respond([
            "error" => "No request updated (already cancelled or not found)"
        ], 404);
    }

    respond(["success" => "Successfully $status the request"]);
} else {
    respond(["error" => "dont know"], 400);
}
