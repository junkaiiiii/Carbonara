<?php
session_start();

include "headers.php";
include "../db_connect.php";
include "helpers.php";


//routing
$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET"){

    $user_id = $_SESSION['user_id']; // or however you store session user ID

    $sql = "SELECT 
                r.*, 
                u.full_name, u.username, u.email, u.phone, u.profile_picture_url, u.role, u.status AS user_status, u.created_at AS user_created,
                
                -- Request status for this user
                req.status AS user_request_status,
                
                -- Join check
                rp.participant_id AS participant_exists

            FROM rides r
            INNER JOIN users u ON r.driver_id = u.user_id

            -- check if current user requested this ride
            LEFT JOIN requests req 
                ON req.ride_id = r.ride_id 
                AND req.passenger_id = '$sessionUserId'

            -- check if current user already joined this ride
            LEFT JOIN ride_participants rp 
                ON rp.ride_id = r.ride_id 
                AND rp.user_id = '$sessionUserId'
    ";

    $result = mysqli_query($conn, $sql);
    $response = [];

    if ($result && mysqli_num_rows($result) > 0){
        while ($row = mysqli_fetch_assoc($result)) {

            $ride = [
                "ride_id"           => $row["ride_id"],
                "origin_text"       => $row["origin_text"],
                "origin_lat"        => $row["origin_lat"],
                "origin_lon"        => $row["origin_lon"],
                "destination_text"  => $row["destination_text"],
                "destination_lat"   => $row["destination_lat"],
                "destination_lon"   => $row["destination_lon"],
                "route_geojson"     => json_decode($row["route_geojson"], true),
                "departure_datetime"=> $row["departure_datetime"],
                "available_seats"   => $row["available_seats"],
                "created_at"        => $row["created_at"],
                "room_code"         => $row["room_code"],

                // NEW FIELDS
                "request_status"    => $row["user_request_status"] ?? null,
                "joined"            => $row["participant_exists"] ? true : false,

                "driver" => [
                    "user_id"            => $row["driver_id"],
                    "name"               => $row["full_name"],
                    "username"           => $row["username"],
                    "email"              => $row["email"],
                    "phone"              => $row["phone"],
                    "profile_picture"    => $row["profile_picture_url"],
                    "role"               => $row["role"],
                    "created_at"         => $row["user_created"]
                ]
            ];

            $response[] = $ride;
        }
    }

    respond($response,200);
}

elseif ($method === "POST") {
    // create new ride
    $data = json_decode(file_get_contents("php://input"), true);
    
    // validate required fields
    $required = ["driver_id", "origin_text", "origin_lat", "origin_lon", 
                 "destination_text", "destination_lat", "destination_lon","route_geojson", 
                 "departure_datetime", "available_seats","status",];
    
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            respond(["error" => "Missing required field: $field"],400);
            exit;
        }
    }
    
    // generate unique room code
    $room_code = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
    
    // prepare data
    $ride_id = generateId("RD_");
    $driver_id = mysqli_real_escape_string($conn, $data["driver_id"]);
    $origin_text = mysqli_real_escape_string($conn, $data["origin_text"]);
    $origin_lat = floatval($data["origin_lat"]);
    $origin_lon = floatval($data["origin_lon"]);
    $destination_text = mysqli_real_escape_string($conn, $data["destination_text"]);
    $destination_lat = floatval($data["destination_lat"]);
    $destination_lon = floatval($data["destination_lon"]);
    $route_geojson = isset($data["route_geojson"]) ? mysqli_real_escape_string($conn, json_encode($data["route_geojson"])) : null;
    $departure_datetime = mysqli_real_escape_string($conn, $data["departure_datetime"]);
    $available_seats = intval($data["available_seats"]);
    $status = isset($data["status"]) ? mysqli_real_escape_string($conn, $data["status"]) : "active";
    
    // insert ride
    $sql = "INSERT INTO rides (driver_id, origin_text, origin_lat, origin_lon, 
            destination_text, destination_lat, destination_lon, route_geojson, 
            departure_datetime, available_seats, status, room_code) 
            VALUES ('$driver_id', '$origin_text', $origin_lat, $origin_lon, 
            '$destination_text', $destination_lat, $destination_lon, '$route_geojson', 
            '$departure_datetime', $available_seats, '$status', '$room_code')";
    
    if (mysqli_query($conn, $sql)) {
        
        // fetch created ride with driver info
        $sql = "SELECT r.*, u.* FROM rides r
                INNER JOIN users u on r.driver_id = u.user_id
                WHERE r.ride_id = $ride_id";
        
        $result = mysqli_query($conn, $sql);
        
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $response = [
                "ride_id"           => $row["ride_id"],
                "origin_text"       => $row["origin_text"],
                "origin_lat"        => $row["origin_lat"],
                "origin_lon"        => $row["origin_lon"],
                "destination_text"  => $row["destination_text"],
                "destination_lat"   => $row["destination_lat"],
                "destination_lon"   => $row["destination_lon"],
                "route_geojson"     => json_decode($row["route_geojson"], true),
                "departure_datetime"=> $row["departure_datetime"],
                "available_seats"   => $row["available_seats"],
                "status"            => $row["status"],
                "created_at"        => $row["created_at"],
                "room_code"         => $row["room_code"],
                "driver" => [
                    "user_id"            => $row["user_id"],
                    "name"               => $row["full_name"],
                    "username"           => $row["username"],
                    "email"              => $row["email"],
                    "phone"              => $row["phone"],
                    "profile_picture"    => $row["profile_picture_url"],
                    "role"               => $row["role"],
                    "created_at"         => $row["created_at"]
                ]
            ];
            http_response_code(201);
            respond($response);
        }
    } else {
        http_response_code(500);
        respond(["error" => "Failed to create ride: " . mysqli_error($conn)]);
    }
}
elseif ($method === "DELETE") {
    // delete ride by ride_id
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data["ride_id"]) || empty($data["ride_id"])) {
        http_response_code(400);
        respond(["error" => "Missing ride_id"]);
        exit;
    }
    
    $ride_id = $data["ride_id"];
    
    // optionally verify driver_id matches (authorization)
    if (isset($data["driver_id"])) {
        $driver_id = $data["driver_id"];
        $check_sql = "SELECT driver_id FROM rides WHERE ride_id = $ride_id";
        $check_result = mysqli_query($conn, $check_sql);
        
        if ($check_result && mysqli_num_rows($check_result) > 0) {
            $ride = mysqli_fetch_assoc($check_result);
            if ($ride["driver_id"] != $driver_id) {
                http_response_code(403);
                respond(["error" => "Unauthorized: You can only delete your own rides"]);
                exit;
            }
        } else {
            http_response_code(404);
            respond(["error" => "Ride not found"]);
            exit;
        }
    }
    
    // delete ride
    $sql = "DELETE FROM rides WHERE ride_id = $ride_id";
    
    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) > 0) {
            respond(["message" => "Ride deleted successfully", "ride_id" => $ride_id],200);
        } else {
            respond(["error" => "Ride not found"],404);
        }
    } else {
        respond(["error" => "Failed to delete ride: " . mysqli_error($conn)],500);
    }
}

else {
    respond(["error" => "Method not allowed"],405);
}
?>