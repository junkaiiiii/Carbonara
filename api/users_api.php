<?php
    session_start();

    include "headers.php";
    include "../db_connect.php";
    include "helpers.php";

    $method = $_SERVER["REQUEST_METHOD"];

    if ($method === "GET"){
        $sql = "SELECT u.*, rt.rating_id, rt.rated_id, rt.score, co2.co2_id, co2.co2_saved, co2.distance_km 
                FROM users u
                LEFT JOIN ratings rt
                ON u.user_id = rt.rated_id
                LEFT JOIN co2_log co2
                ON u.user_id = co2.user_id";

        $result = mysqli_query($conn, $sql);
        $response = [];

        if ($result && mysqli_num_rows($result) > 0){
            while ($row = mysqli_fetch_assoc($result)){

                $uid = $row['user_id'];

                //check if user already inside response
                if (!isset($response[$uid])){
                    $response[$uid] = [
                    "user_id" => $row["user_id"],
                    "full_name" => $row["full_name"],
                    "username" => $row["username"],
                    "email" => $row["email"],
                    "role" => $row["role"],
                    "status" => $row["status"],
                    "phone" => $row["phone"],
                    "profile_picture" => $row["profile_picture_url"],
                    "created_at" => $row["created_at"],
                    "ratings" => [],
                    "co2_logs" => []
                    ];
                }


                
                //if row has rating (temporary)
                if ($row["rating_id"] !== null){
                    $response[$uid]["ratings"][] = [
                        "rating_id" => $row["rating_id"],
                        "score" => $row["score"]
                    ];
                }

                if ($row["co2_id"] !== null){
                    $response[$uid]["co2_logs"][] = [
                        "co2_id" => $row["co2_id"],
                        "co2_saved" => $row["co2_saved"],
                        "total_distance" => $row["distance_km"]
                    ];
                }
            } 
        }
        $response = array_values($response);

        respond($response, 200);
    }

?>