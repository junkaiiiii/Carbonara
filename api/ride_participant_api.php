<?php

include("headers.php");
include("helpers.php");
include("../db_connect.php");

$method = $_SERVER['REQUEST_METHOD'] ?? '';

if ($method === "POST") {
    $data = getJsonInput();
    $required = ['ride_id', 'user_id'];

    foreach ($required as $r) {
        if (empty($data[$r])) {
            respond(['error' => 'Missing required field']);
        }
    }

    $sql = "INSERT INTO ride_participants (participant_id, ride_id, user_id, joined_at) VALUE (?,?,?,NOW()); ";

    $stmt = mysqli_prepare($conn, $sql);

    $participant_id = generateId("RP_");
    mysqli_stmt_bind_param($stmt, 'sss', $participant_id, $data['ride_id'], $data['user_id']);

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

    respond(['success'=>'successfully create ride_participant entry'],200);
}
