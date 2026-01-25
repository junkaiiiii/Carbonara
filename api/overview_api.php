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
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COALESCE(SUM(co2_saved), 0) FROM co2_log) AS total_co2_saved,
    (SELECT COUNT(*) FROM rides) AS total_rides,
    (SELECT COUNT(*) FROM reports WHERE status = 'Pending') AS pending_reports,
    (SELECT COUNT(*) FROM users WHERE role = 'Admin') AS admins,
    (SELECT COUNT(*) FROM users WHERE role = 'Driver') AS drivers,
    (SELECT COUNT(*) FROM users WHERE role = 'Passenger') AS passengers,
    (SELECT COUNT(*) FROM users WHERE status = 'Banned') AS banned_users;";

    $result = mysqli_query($conn, $sql);
    $response = [];

    if ($result && mysqli_num_rows($result) > 0){
        while ($row = mysqli_fetch_assoc($result)){
            $response = [
                "total_users" => intval($row["total_users"]),
                "total_co2_saved" => floatval($row["total_co2_saved"]),
                "total_rides" => intval($row["total_rides"]),
                "pending_reports" => intval($row["pending_reports"]),
                "admins" => intval($row["admins"]),
                "drivers" => intval($row["drivers"]),
                "passengers" => intval($row["passengers"]),
                "banned_users" => intval($row["banned_users"])
            ];
            
        }
    }
    respond($response,200);
}