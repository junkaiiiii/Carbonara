<?php
    session_start();

    include "headers.php";
    include "../db_connect.php";
    include "helpers.php";

    $method = $_SERVER["REQUEST_METHOD"];

    if ($method === "GET"){
        $sql = "SELECT u.*, rt.rating_id, rt.rated_id, rt.score, co2.co2_id, co2.co2_saved,
                rater.user_id AS rater_user_id,
                rater.username AS rater_username,
                rater.full_name AS rater_full_name,
                rater.profile_picture_url AS rater_profile_picture,
                r.ride_id, r.ride_distance 
                FROM users u
                LEFT JOIN ratings rt
                ON u.user_id = rt.rated_id
                LEFT JOIN users rater
                ON rt.rater_id = rater.user_id
                LEFT JOIN co2_log co2
                ON u.user_id = co2.user_id
                LEFT JOIN rides r
                ON co2.ride_id = r.ride_id";

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
                    "co2_logs" => [],
                    "rides" => []
                    ];
                }


                
                //if row has rating (temporary)
                if ($row["rating_id"] !== null){
                    $response[$uid]["ratings"][] = [
                        "rating_id" => $row["rating_id"],
                        "score" => $row["score"],
                        "rater" => [
                            "rater_id" => $row['rater_user_id'],
                            "rater_username" => $row["rater_username"],
                            "rater_full_name" => $row['rater_full_name'],
                            "rater_profile_picture" => $row['rater_profile_picture']
                        ]
                    ];
                }

                if ($row["co2_id"] !== null){
                    $response[$uid]["co2_logs"][] = [
                        "co2_id" => $row["co2_id"],
                        "co2_saved" => $row["co2_saved"],
                        "total_distance" => $row["ride_distance"]
                    ];
                }


            } 
        }
        $response = array_values($response);

        respond($response, 200);
    }
    elseif($method === "POST"){
        $data = getJsonInput();
        //check if data is not empty
        if (!$data){
            respond(["error" => "Invalid or empty JSON"], 400);
        }   
        // check if action and report id is not empty / is set
        if (!isset($data["action"], $data["reported_email"])){
            respond(["error" => "Missing required fields"], 400);
        }

        $action = $data["action"]; // status
        $user_email = $data["reported_email"];

        if ($action === "Active"){
            $newStatus = "Active";
        }
        elseif($action === "Banned"){
            $newStatus = "Banned";
        }
        else{
            respond(["error" => "Invalid action"], 400);
        }

        $sql = "UPDATE users
                SET status = ?
                WHERE email = ?";
        $stmt = mysqli_prepare($conn,$sql);

        if (!$stmt){
            respond(['error' => 'Database error: '. mysqli_error($conn)], 500);
        }

        mysqli_stmt_bind_param($stmt, "ss", $newStatus, $user_email);
        mysqli_stmt_execute($stmt);

        if (mysqli_stmt_affected_rows($stmt) > 0){ //if row is affected
            respond(["message" => "Report Updated", "status" => $newStatus], 200);
        }
        else{ // no rows effected
            respond(["error" => "No rows updated"], 400);
        }



    }

?>