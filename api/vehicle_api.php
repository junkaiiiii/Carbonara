<?php
    session_start();

    include "headers.php";
    include "../db_connect.php";
    include "helpers.php";

    $method = $_SERVER["REQUEST_METHOD"];
    $sessionId = $_SESSION['user_id'] ?? null;
    if ($method === "GET"){
        if (!$sessionId){
            respond(["error" => "Unauthorized"], 401);
            exit;
        }

        $sql = "SELECT u.*, vh.vehicle_id, vh.car_plate_number, vh.color, vh.type
                FROM users u
                INNER JOIN vehicles vh
                ON u.user_id = vh.driver_id
                WHERE vh.driver_id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        if (!$stmt){
            respond(["error" => "Database error: " . mysqli_error($conn)], 500);
            exit;
        }

        mysqli_stmt_bind_param($stmt, 's', $sessionId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $response = [];

        if ($result && mysqli_num_rows($result) > 0){
            while($row = mysqli_fetch_assoc($result)){
                $vehicle = [
                    "vehicle_id" => $row["vehicle_id"],
                    "driver_id" => $row["user_id"],
                    "car_plate_number" => $row["car_plate_number"],
                    "color" => $row["color"],
                    "type" => $row["type"],
                    "created_at" => $row["created_at"]
                ];
                $response[] = $vehicle;
            }
            respond($response, 200);
        }
        else{
            respond(["message" => "No vehicles found"], 404);
        }
    }
?>