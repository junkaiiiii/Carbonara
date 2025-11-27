<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization");

// allow preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include "../db_connect.php";
include "helpers.php";


//routing
$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET"){
    //get all rides
    $sql = "SELECT r.*, u.* FROM rides r
            INNER JOIN users u on r.driver_id = u.user_id"; //add where user status != banned later
            //add != session userId
    
    $result = mysqli_query($conn,$sql);

    $response = [];

    if ($result && mysqli_num_rows($result) > 0){
        while ($row = mysqli_fetch_assoc($result)){

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
                "status"            => $row["status"],
                "created_at"        => $row["created_at"],
                "room_code"         => $row["room_code"],

                // nested driver object
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

            //add requests//join status

            $response[] = $ride;
        }
    }

    respond($response);
}
