<?php
    session_start();

    include "headers.php";
    include "../db_connect.php";
    include "helpers.php";

    $method = $_SERVER["REQUEST_METHOD"];

    if ($method === "GET"){
        $sql = "SELECT 
                u.*, 
                (SELECT AVG(score) FROM ratings r WHERE r.rated_id = u.user_id) as average_rating,
                (SELECT SUM(co2_saved) FROM co2_log c WHERE c.user_id = u.user_id) as total_co2,
                (SELECT SUM(r.ride_distance) FROM rides r 
                WHERE r.ride_id IN (
                    SELECT DISTINCT c.ride_id 
                    FROM co2_log c 
                    WHERE c.user_id = u.user_id
                )
                AND r.ride_status = 'Completed') as total_distance
                
                FROM users u";
                

        $result = mysqli_query($conn, $sql);
        $response = [];

        if ($result && mysqli_num_rows($result) > 0){
            while ($row = mysqli_fetch_assoc($result)){
            $response[] = [
                "user_id" => $row["user_id"],
                "full_name" => $row["full_name"],
                "username" => $row["username"],
                "email" => $row["email"],
                "role" => $row["role"],
                "status" => $row["status"],
                "phone" => $row["phone"],
                "profile_picture" => $row["profile_picture_url"],
                "created_at" => $row["created_at"],
        
                "average_rating" => number_format((float)$row['average_rating'], 1),
                "total_co2" => number_format((float)$row['total_co2'], 2),
                "total_distance" => number_format((float)$row['total_distance'], 2),
            ];


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