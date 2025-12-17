<?php
session_start();

include "headers.php";
include "../db_connect.php";
include "helpers.php";


//routing
$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET"){
    $id = $_GET['id'] ?? '';
    $mode = $_GET['mode'] ?? 'available';
    $sessionUserId = $_SESSION['user_id']; // or however you store session user ID
    $sessionRole = $_SESSION['role'];
    // get role also and return hosted if its driver

    if (!empty($id)){
        
    }

    if ($mode === 'available'){
        $sql = "SELECT 
            r.*, 
            u.full_name, u.username, u.email, u.phone, u.profile_picture_url, u.role, u.status AS user_status, u.created_at AS user_created,
            
            req.status AS user_request_status,
            
            rp.participant_id AS participant_exists,

            dl.status AS license_status,
            
            COALESCE(driver_stats.total_rides, 0) AS driver_total_rides,
            COALESCE(driver_stats.avg_rating, 0) AS driver_avg_rating,
            COALESCE(driver_stats.total_co2_saved, 0) AS driver_total_co2_saved

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

        -- check driver license status
        LEFT JOIN driving_license dl
            ON r.driver_id = dl.user_id
        
        -- Driver statistics subquery
        LEFT JOIN (
            SELECT 
                driver_id,
                COUNT(DISTINCT r2.ride_id) AS total_rides,
                AVG(rat.score) AS avg_rating,
                SUM(co2.co2_saved) AS total_co2_saved
            FROM rides r2
            LEFT JOIN ratings rat ON rat.ride_id = r2.ride_id AND rat.rated_id = r2.driver_id
            LEFT JOIN co2_log co2 ON co2.ride_id = r2.ride_id AND co2.user_id = r2.driver_id
            GROUP BY driver_id
        ) AS driver_stats ON driver_stats.driver_id = u.user_id
        
        WHERE u.user_id != '$sessionUserId'
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
                        "created_at"         => $row["user_created"],
                        "total_rides"        => (int)$row["driver_total_rides"],
                        "avg_rating"         => round((float)$row["driver_avg_rating"], 1),
                        "total_co2_saved"    => round((float)$row["driver_total_co2_saved"], 2),
                        "license_status"     => $row['license_status']
                    ]

                    
                ];

                $response[] = $ride;
            }
        }
        respond($response,200);
    }
    // get hosted rides for driver
    elseif ($mode === 'hosted') {

        $sql = "
            SELECT r.*, re.passenger_id, u.full_name, u.username, u.email, u.role, u.status, 
                   u.phone, u.profile_picture_url, u.created_at
            FROM rides r
            INNER JOIN requests re ON r.ride_id = re.ride_id
            INNER JOIN users u ON re.passenger_id = u.user_id
            WHERE re.status = 'requested' AND r.driver_id = ?
        ";
    
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $sessionUserId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);
        
        $route_geojson = '';
        mysqli_stmt_bind_result($stmt,
            $ride_id, $driver_id, $origin_text, $origin_lat, $origin_lon,
            $destination_text, $destination_lat, $destination_lon,
            $route_geojson, $departure_datetime, $available_seats,
            $created_at, $room_code,
            $passenger_id, $full_name, $username, $email, $role, $status,
            $phone, $profile_picture_url, $user_created_at
        );
    
        while (mysqli_stmt_fetch($stmt)) {
    
            // If ride not added yet, initialize it
            if (!isset($response[$ride_id])) {

                $response[$ride_id] = [
                    'ride_id' => $ride_id,
                    'driver_id' => $driver_id,
                    'origin_text' => $origin_text,
                    'origin_lat' => $origin_lat,
                    'origin_lon' => $origin_lon,
                    'destination_text' => $destination_text,
                    'destination_lat' => $destination_lat,
                    'destination_lon' => $destination_lon,
                    'route_geojson' => json_decode($route_geojson, true),
                    'departure_datetime' => $departure_datetime,
                    'available_seats' => $available_seats,
                    'created_at' => $created_at,
                    'room_code' => $room_code,
                    'passengers' => []  // create array
                ];
            }

            // If passenger exists, push into list
            if ($passenger_id !== null) {
                $response[$ride_id]['passengers'][] = [
                    'passenger_id' => $passenger_id,
                    'full_name' => $full_name,
                    'username' => $username,
                    'email' => $email,
                    'role' => $role_p,
                    'status' => $status,
                    'phone' => $phone,
                    'profile_picture_url' => $profile_picture_url,
                    'user_created_at' => $user_created_at
                ];
            }
        }

        respond($response,200);
    }

    
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