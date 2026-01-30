<?php
session_start();

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

include "headers.php";
include "../db_connect.php";
include "helpers.php";


//routing
$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
    $id = $_GET['id'] ?? '';
    $mode = $_GET['mode'] ?? 'available';
    $sessionUserId = $_SESSION['user_id'];

    // return data for a single rie (ride details page)
    if (!empty($id)) {
        $sql =
            "SELECT
            r.ride_id,
            r.driver_id,
            r.origin_text,
            r.origin_lat,
            r.origin_lon,
            r.destination_text,
            r.destination_lat,
            r.destination_lon,
            r.departure_datetime,
            (r.available_seats -  COALESCE(taken_seats.taken_seats,0)) AS available_seats,
            r.ride_distance,
            r.ride_status,
            r.created_at,
            r.room_code,

            re.passenger_id,
            u.full_name,
            u.username,
            u.role,
            u.profile_picture_url,
            u.email,
            u.phone,
            COALESCE(passenger_stats.total_rides, 0) AS passenger_total_rides,
            COALESCE(passenger_stats.avg_rating, 0) AS passenger_avg_rating,
            COALESCE(passenger_stats.total_co2_saved, 0) AS passenger_total_co2_saved,
            dl.status,

            d.user_id,
            d.full_name,
            d.username,
            d.role,
            d.profile_picture_url,
            d.email,
            d.phone,
            COALESCE(driver_stats.total_rides, 0) AS driver_total_rides,
            COALESCE(driver_stats.avg_rating, 0) AS driver_avg_rating,
            COALESCE(driver_stats.total_co2_saved, 0) AS driver_total_co2_saved,
            dl2.status,

            vh.vehicle_id,
            vh.car_plate_number,
            vh.brand,
            vh.manufactured_year,
            vh.color,
            vh.type,
            vh.vehicle_image

        FROM rides r
        LEFT JOIN requests re ON r.ride_id = re.ride_id AND re.status = 'approved'
        LEFT JOIN users u ON re.passenger_id = u.user_id
        LEFT JOIN (
            SELECT
                u2.user_id,
                COUNT(DISTINCT rp.ride_id) AS total_rides,
                AVG(rat.score) AS avg_rating,
                SUM(co2.co2_saved) AS total_co2_saved
            FROM users u2
            LEFT JOIN ride_participants rp ON rp.user_id = u2.user_id
            LEFT JOIN ratings rat ON rat.rated_id = u2.user_id
            LEFT JOIN co2_log co2 ON co2.user_id = u2.user_id
            GROUP BY u2.user_id
        ) AS passenger_stats ON passenger_stats.user_id = re.passenger_id
        LEFT JOIN driving_license dl ON dl.user_id = re.passenger_id

        LEFT JOIN users d ON r.driver_id = d.user_id
        LEFT JOIN (
            SELECT
                d2.user_id,
                COUNT(DISTINCT rp.ride_id) AS total_rides,
                AVG(rat.score) AS avg_rating,
                SUM(co2.co2_saved) AS total_co2_saved
            FROM users d2
            LEFT JOIN ride_participants rp ON rp.user_id = d2.user_id
            LEFT JOIN ratings rat ON rat.rated_id = d2.user_id
            LEFT JOIN co2_log co2 ON co2.user_id = d2.user_id
            GROUP BY d2.user_id
        ) AS driver_stats ON driver_stats.user_id = r.driver_id
        LEFT JOIN driving_license dl2 ON dl2.user_id = r.driver_id

        LEFT JOIN (
            SELECT 
            	rp.ride_id,
                COUNT(rp.ride_id) AS taken_seats
            FROM ride_participants rp
            GROUP BY rp.ride_id
        ) AS taken_seats ON taken_seats.ride_id = r.ride_id

        LEFT JOIN vehicles vh ON vh.vehicle_id = r.vehicle_id

        WHERE r.ride_id = ?;
        ";

        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $route_geojson = '';
        mysqli_stmt_bind_result(
            $stmt,
            $ride_id,
            $driver_id,
            $origin_text,
            $origin_lat,
            $origin_lon,
            $destination_text,
            $destination_lat,
            $destination_lon,
            $departure_datetime,
            $available_seats,
            $ride_distance,
            $ride_status,
            $created_at,
            $room_code,

            $passenger_id,
            $passenger_full_name,
            $passenger_username,
            $passenger_role,
            $passenger_profile_picture_url,
            $passenger_email,
            $passenger_phone,
            $passenger_total_rides,
            $passenger_avg_rating,
            $passenger_total_co2_saved,
            $passenger_license_status,

            $driver_id,
            $driver_full_name,
            $driver_username,
            $driver_role,
            $driver_profile_picture_url,
            $driver_email,
            $driver_phone,
            $driver_total_rides,
            $driver_avg_rating,
            $driver_total_co2_saved,
            $driver_license_status,

            $vehicle_id,
            $car_plate_number,
            $brand,
            $manufactured_year,
            $color,
            $type,
            $vehicle_image
        );
        while (mysqli_stmt_fetch($stmt)) {

            // If ride not added yet, initialize it
            if (!isset($response)) {
                $response = [
                    'ride_id' => $ride_id,
                    'driver' => [
                        'user_id' => $driver_id,
                        'name' => $driver_full_name,
                        'username' => $driver_username,
                        'role' => $driver_role,
                        'profile_picture_url' => $driver_profile_picture_url,
                        'email' => $driver_email,
                        'phone' => $driver_phone,
                        'total_rides' => $driver_total_rides,
                        'avg_rating' => $driver_avg_rating,
                        'total_co2_saved' => $driver_total_co2_saved,
                        'license_status' => $driver_license_status ?? null
                    ],
                    'origin_text' => $origin_text,
                    'origin_lat' => $origin_lat,
                    'origin_lon' => $origin_lon,
                    'destination_text' => $destination_text,
                    'destination_lat' => $destination_lat,
                    'destination_lon' => $destination_lon,
                    'departure_datetime' => $departure_datetime,
                    'available_seats' => $available_seats,
                    'ride_distance' =>
                    $ride_distance,
                    'ride_status' =>
                    $ride_status,
                    'created_at' => $created_at,
                    'room_code' => $room_code,
                    'passengers' => [],  // create array
                    'vehicle' => [
                        'vehicle_id' => $vehicle_id,
                        'car_plate_number' => $car_plate_number,
                        'brand' => $brand,
                        'manufactured_year' => $manufactured_year,
                        'color' => $color,
                        'type' => $type,
                        'vehicle_image_url' => $vehicle_image
                    ]
                ];
            }

            // If passenger exists, push into list
            if ($passenger_id !== null) {
                $response['passengers'][] = [
                    'user_id' => $passenger_id,
                    'name' => $passenger_full_name,
                    'username' => $passenger_username,
                    'role' => $passenger_role,
                    'profile_picture_url' => $passenger_profile_picture_url,
                    'email' => $passenger_email,
                    'phone' => $passenger_phone,
                    'total_rides' => $passenger_total_rides,
                    'avg_rating' => $passenger_avg_rating,
                    'total_co2_saved' => $passenger_total_co2_saved,
                    'license_status' => $passenger_license_status ?? null
                ];
            }
        }

        respond($response, 200);
    }

    if ($mode === 'available') {
        $sql = "SELECT 
            r.ride_id,
            r.driver_id,
            r.origin_text,
            r.origin_lat,
            r.origin_lon,
            r.destination_text,
            r.destination_lat,
            r.destination_lon,
            r.departure_datetime,
            (r.available_seats -  COALESCE(taken_seats.taken_seats,0)) AS available_seats,
            r.ride_distance,
            r.ride_status,
            r.created_at,
            r.room_code,

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
                COUNT(DISTINCT rp.ride_id) AS total_rides,
                AVG(rat.score) AS avg_rating,
                SUM(co2.co2_saved) AS total_co2_saved
            FROM rides r2
            LEFT JOIN ride_participants rp ON rp.user_id = r2.driver_id
            LEFT JOIN ratings rat ON rat.ride_id = r2.ride_id AND rat.rated_id = r2.driver_id
            LEFT JOIN co2_log co2 ON co2.ride_id = r2.ride_id AND co2.user_id = r2.driver_id
            GROUP BY driver_id
        ) AS driver_stats ON driver_stats.driver_id = u.user_id

        LEFT JOIN (
            SELECT 
            	rp.ride_id,
                COUNT(rp.ride_id) AS taken_seats
            FROM ride_participants rp
            GROUP BY rp.ride_id
        ) AS taken_seats ON taken_seats.ride_id = r.ride_id
        
        WHERE u.user_id != '$sessionUserId'
        ";

        $result = mysqli_query($conn, $sql);
        $response = [];

        if ($result && mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_assoc($result)) {

                $ride = [
                    'ride_id' => $row['ride_id'],
                    'origin_text' => $row['origin_text'],
                    'origin_lat' => $row['origin_lat'],
                    'origin_lon' => $row['origin_lon'],
                    'destination_text' => $row['destination_text'],
                    'destination_lat' => $row['destination_lat'],
                    'destination_lon' => $row['destination_lon'],
                    'departure_datetime' => $row['departure_datetime'],
                    'available_seats' => $row['available_seats'],
                    'ride_distance' => $row['ride_distance'],
                    'ride_status' => $row['ride_status'],
                    'created_at' => $row['created_at'],
                    'room_code' => $row['room_code'],
                    "request_status"    => $row["user_request_status"] ?? null,
                    "joined"            => $row["participant_exists"] ? true : false,

                    "driver" => [
                        "user_id"            => $row["driver_id"],
                        "name"               => $row["full_name"],
                        "username"           => $row["username"],
                        "email"              => $row["email"],
                        "phone"              => $row["phone"],
                        "profile_picture_url"    => $row["profile_picture_url"],
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
        respond($response, 200);
    }
    // get hosted rides for driver
    elseif ($mode === 'hosted') {

        $sql =
            "SELECT
            r.ride_id,
            r.driver_id,
            r.origin_text,
            r.origin_lat,
            r.origin_lon,
            r.destination_text,
            r.destination_lat,
            r.destination_lon,
            r.departure_datetime,
            (r.available_seats -  COALESCE(taken_seats.taken_seats,0)) AS available_seats,
            r.ride_distance,
            r.ride_status,
            r.created_at,
            r.room_code,

            re.passenger_id,
            u.username,
            u.full_name,
            u.role,
            u.email,
            u.phone,
            u.profile_picture_url,
            COALESCE(passenger_stats.total_rides, 0) AS passenger_total_rides,
            COALESCE(passenger_stats.avg_rating, 0) AS passenger_avg_rating,
            COALESCE(passenger_stats.total_co2_saved, 0) AS passenger_total_co2_saved
        FROM rides r
        LEFT JOIN requests re ON r.ride_id = re.ride_id AND re.status = 'requested'
        LEFT JOIN users u ON re.passenger_id = u.user_id
        LEFT JOIN (
            SELECT
                u2.user_id,
                COUNT(DISTINCT rp.ride_id) AS total_rides,
                AVG(rat.score) AS avg_rating,
                SUM(co2.co2_saved) AS total_co2_saved
            FROM users u2
            LEFT JOIN ride_participants rp ON rp.user_id = u2.user_id
            LEFT JOIN ratings rat ON rat.rated_id = u2.user_id
            LEFT JOIN co2_log co2 ON co2.user_id = u2.user_id
            GROUP BY u2.user_id
        ) AS passenger_stats ON passenger_stats.user_id = re.passenger_id

        LEFT JOIN (
            SELECT 
            	rp.ride_id,
                COUNT(rp.ride_id) AS taken_seats
            FROM ride_participants rp
            GROUP BY rp.ride_id
        ) AS taken_seats ON taken_seats.ride_id = r.ride_id
        WHERE r.driver_id = ?
        ORDER BY r.created_at DESC;
    ";
    
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $sessionUserId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        $route_geojson = '';
        mysqli_stmt_bind_result(
            $stmt,
            $ride_id,
            $driver_id,
            $origin_text,
            $origin_lat,
            $origin_lon,
            $destination_text,
            $destination_lat,
            $destination_lon,
            $departure_datetime,
            $available_seats,
            $ride_distance,
            $ride_status,
            $created_at,
            $room_code,

            $passenger_id,

            $username,
            $full_name,
            $role,
            $email,
            $phone,
            $profile_picture_url,
            $passenger_total_rides,
            $passenger_avg_rating,
            $passenger_total_co2_saved
        );

        $response = [];
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
                    'departure_datetime' => $departure_datetime,
                    'available_seats' => $available_seats,
                    'ride_distance' =>
                    $ride_distance,
                    'ride_status' =>
                    $ride_status,
                    'created_at' => $created_at,
                    'room_code' => $room_code,
                    'passengers' => []  // create array
                ];
            }

            // If passenger exists, push into list
            if ($passenger_id !== null) {
                $response[$ride_id]['passengers'][] = [
                    'passenger_id' => $passenger_id,
                    'username' => $username,
                    'name' => $full_name,
                    'role' => $role,
                    'email' => $email,
                    'phone' => $phone,
                    'profile_picture_url' => $profile_picture_url,
                    'total_rides' => $passenger_total_rides,
                    'avg_rating' => $passenger_avg_rating,
                    'total_co2_saved' => $passenger_total_co2_saved
                ];
            }
        }

        respond($response, 200);
    }
    elseif($mode==="all"){
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
    
    ORDER BY r.created_at DESC";
    $result = mysqli_query($conn, $sql);
    $response = [];

    if ($result && mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {

            $ride = [
                'ride_id' => $row['ride_id'],
                'origin_text' => $row['origin_text'],
                'origin_lat' => $row['origin_lat'],
                'origin_lon' => $row['origin_lon'],
                'destination_text' => $row['destination_text'],
                'destination_lat' => $row['destination_lat'],
                'destination_lon' => $row['destination_lon'],
                'departure_datetime' => $row['departure_datetime'],
                'available_seats' => $row['available_seats'],
                'ride_distance' => $row['ride_distance'],
                'ride_status' => $row['ride_status'],
                'created_at' => $row['created_at'],
                'room_code' => $row['room_code'],
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
        respond($response, 200);
    }
} elseif ($method === "POST") {
    // create new ride
    $data = json_decode(file_get_contents("php://input"), true);

    // validate required fields
    $required = [
        "driver_id",
        "vehicle_id",
        "origin_text",
        "origin_lat",
        "origin_lon",
        "destination_text",
        "destination_lat",
        "destination_lon",
        "ride_distance",
        "departure_datetime",
        "available_seats"
    ];

    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            respond(["error" => "Missing required field: $field"], 400);
            exit;
        }
    }

    // generate unique room code
    do {
        $room_code = rand(100000, 999999);
    
        $check_sql = "SELECT ride_id FROM rides WHERE room_code = $room_code";
        $result = mysqli_query($conn, $check_sql);
    
    } while ($result && mysqli_num_rows($result) > 0);

    // prepare data
    $ride_id = generateId("RD_");
    $driver_id = mysqli_real_escape_string($conn, $data["driver_id"]);
    $vehicle_id = mysqli_real_escape_string($conn, $data["vehicle_id"]);
    $origin_text = mysqli_real_escape_string($conn, $data["origin_text"]);
    $origin_lat = floatval($data["origin_lat"]);
    $origin_lon = floatval($data["origin_lon"]);
    $destination_text = mysqli_real_escape_string($conn, $data["destination_text"]);
    $destination_lat = floatval($data["destination_lat"]);
    $destination_lon = floatval($data["destination_lon"]);
    $departure_datetime = str_replace('T', ' ', $data["departure_datetime"]);
    $available_seats = intval($data["available_seats"]);
    $ride_distance = floatval($data["ride_distance"]);
    $ride_status = "Incomplete";
    $created_at = date('Y-m-d H:i:s');


    // $created_at = isset($data["created_at"]);



    // insert ride
    $sql = "INSERT INTO rides (ride_id, driver_id, vehicle_id, origin_text, origin_lat, origin_lon, 
            destination_text, destination_lat, destination_lon, 
            departure_datetime, available_seats, ride_distance, ride_status, created_at, room_code) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        respond(["error" => "Database error: " . mysqli_error($conn)], 500);
        exit;
    }
    mysqli_stmt_bind_param(
        $stmt,
        "ssssddsddsidssi",
        $ride_id,
        $driver_id,
        $vehicle_id,
        $origin_text,
        $origin_lat,
        $origin_lon,
        $destination_text,
        $destination_lat,
        $destination_lon,
        $departure_datetime,
        $available_seats,
        $ride_distance,
        $ride_status,
        $created_at,
        $room_code
    );
    if (!mysqli_stmt_execute($stmt)) {
        respond(["error" => "Failed to create ride: " . mysqli_stmt_error($stmt)], 500);
        exit;
    }
    respond(["success" => "Ride created successfully", "ride_id" => $ride_id], 201);


    // if (mysqli_query($conn, $sql)) {

    //     // fetch created ride with driver info
    //     $sql = "SELECT r.*, u.* FROM rides r
    //             INNER JOIN users u on r.driver_id = u.user_id
    //             WHERE r.ride_id = $ride_id";

    //     $result = mysqli_query($conn, $sql);

    //     if ($result && mysqli_num_rows($result) > 0) {
    //         $row = mysqli_fetch_assoc($result);
    //         $response = [
    //             "ride_id"           => $row["ride_id"],
    //             "origin_text"       => $row["origin_text"],
    //             "origin_lat"        => $row["origin_lat"],
    //             "origin_lon"        => $row["origin_lon"],
    //             "destination_text"  => $row["destination_text"],
    //             "destination_lat"   => $row["destination_lat"],
    //             "destination_lon"   => $row["destination_lon"],
    //             "route_geojson"     => json_decode($row["route_geojson"], true),
    //             "departure_datetime"=> $row["departure_datetime"],
    //             "available_seats"   => $row["available_seats"],
    //             "created_at"        => $row["created_at"],
    //             "room_code"         => $row["room_code"],
    //             "driver" => [
    //                 "user_id"            => $row["user_id"],
    //                 "name"               => $row["full_name"],
    //                 "username"           => $row["username"],
    //                 "email"              => $row["email"],
    //                 "phone"              => $row["phone"],
    //                 "profile_picture"    => $row["profile_picture_url"],
    //                 "role"               => $row["role"],
    //                 "created_at"         => $row["created_at"]
    //             ]
    //         ];
    //         http_response_code(201);
    //         respond($response);
    //     }
    // } else {
    //     http_response_code(500);
    //     respond(["error" => "Failed to create ride: " . mysqli_error($conn)]);
    // }
} elseif ($method === "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);
    $valid_status = array('Cancelled', 'Completed', 'Incomplete');

    $ride_id = $data['ride_id'] ?? "";
    $status = in_array($data['status'], $valid_status) ? $data['status'] : "";

    if (empty($status)) {
        respond(["error" => "invalid request method"], 400);
    }

    $sql = "UPDATE rides SET ride_status = ?
            WHERE ride_id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $status, $ride_id);
    $executed = mysqli_stmt_execute($stmt);

    if (!$executed) {
        respond([
            "error" => "Database execution failed",
            "details" => mysqli_stmt_error($stmt)
        ], 500);
    }

    if (mysqli_stmt_affected_rows($stmt) === 0) {
        respond([
            "error" => "No rides updated"
        ], 404);
    }

    respond(["success"=>"Successfully $status the ride"]);

} else {
    respond(["error" => "Method not allowed"], 405);
}
