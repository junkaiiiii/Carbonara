<?php
    session_start();

    include "headers.php";
    include "../db_connect.php";
    include "helpers.php";

    $method = $_SERVER["REQUEST_METHOD"];

    if ($method === "GET"){
        $sql = "SELECT dl.*, u.full_name, u.email, u.profile_picture_url 
                FROM driving_license dl
                INNER JOIN users u 
                ON dl.user_id = u.user_id
                ";
        $result = mysqli_query($conn, $sql);
        $response = [];

        if ($result && mysqli_num_rows($result) > 0){
            while ($row = mysqli_fetch_assoc($result)){

                $license = [
                    "license_id" => $row["license_id"],
                    "license_status" => $row['status'],
                    "license_img_url" => $row['license_image_url'],
                    "user" => [
                        "user_id" => $row['user_id'],
                        "name" => $row['full_name'],
                        "email" => $row['email'],
                        "pfp" => $row['profile_picture_url'],
                        ]
                    ];

                    $response[] = $license;
                }
            }
            respond($response, 200);
        }
    elseif ($method === "POST"){
        $data = getJsonInput();
        //check if data is not empty
        if (!$data){
            respond(["error" => "Invalid or empty JSON"], 400);
        }   
        // check if action and license id is not empty / is set
        if (!isset($data["action"], $data["license_id"])){
            respond(["error" => "Missing required fields"], 400);
        }

        $action = $data["action"];
        $license_id = $data["license_id"];

        if ($action === "approve"){
            $newStatus = "Approved";
            $sql = "UPDATE driving_license dl 
                    INNER JOIN users u ON u.user_id = dl.user_id
                    SET dl.status = ?, u.role = 'Driver'
                    WHERE dl.license_id = ?";
        }
        elseif ($action === "reject"){
            $newStatus = "Rejected";
            $sql = "UPDATE driving_license 
                    SET status = ?
                    WHERE license_id = ?";
        }
        else{
            respond(["error" => "Invalid action"], 400);
        }
        

        
        $stmt = mysqli_prepare($conn, $sql);

        //if no statements === sql failed
        if (!$stmt) {
            respond(['error' => 'Database error: ' . mysqli_error($conn)], 500);
        }        

        //replace question mark with variables
        mysqli_stmt_bind_param($stmt, "ss", $newStatus, $license_id);
        mysqli_stmt_execute($stmt);      //execute sql / stmt


        if (mysqli_stmt_affected_rows($stmt) > 0){ //if row is affected
            respond(["message" => "License Updated", "status" => $newStatus], 200);
        }
        else{ // no rows effected
            respond(["error" => "No rows updated"], 400);
        }

    }
?>