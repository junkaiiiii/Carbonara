<?php
    session_start();

    include "headers.php";
    include "../db_connect.php";
    include "helpers.php";

    $method = $_SERVER["REQUEST_METHOD"];

    if ($method === "GET"){
        $mode = $_GET["mode"] ?? "";

        $sql = "SELECT re.*, 
        reporter.full_name AS reporter_name, 
        reporter.email AS reporter_email, 
        reporter.profile_picture_url AS reporter_pfp,
        reported.full_name AS reported_name, 
        reported.email AS reported_email,
        reported.profile_picture_url AS reported_pfp
        FROM reports re 
        INNER JOIN users reporter 
        ON re.reporter_id = reporter.user_id 
        INNER JOIN users reported 
        ON re.reported_user_id = reported.user_id";

        $result = mysqli_query($conn, $sql);
        $response = [];

        if ($result && mysqli_num_rows($result) > 0){
            while ($row = mysqli_fetch_assoc($result)){
                $reports = [
                    "report_id" => $row["report_id"],
                    "reporter_name" => $row["reporter_name"],
                    "reporter_email" => $row["reporter_email"],
                    "reporter_pfp" => $row["reporter_pfp"],
                    "reported_user_id" => $row["reported_user_id"],
                    "reported_name" => $row["reported_name"],
                    "reported_email" => $row["reported_email"],
                    "reported_pfp" => $row["reported_pfp"],
                    "description" => $row["description"],
                    "status" => $row["status"]
                ];
                $response[] = $reports; 
            }
            respond($response, 200);
        }
    }
    elseif ($method === "POST"){
        $data = getJsonInput();
        //check if data is not empty
        if (!$data){
            respond(["error" => "Invalid or empty JSON"], 400);
        }   
        // check if action and report id is not empty / is set
        if (!isset($data["action"], $data["report_id"])){
            respond(["error" => "Missing required fields"], 400);
        }

        $action = $data["action"]; // status
        $report_id = $data["report_id"];

        if ($action === "approve"){ // if 3 approve === ban
            $newStatus = "Approved";
        }
        elseif ($action === "reject"){ // rejects the report
            $newStatus = "Rejected";
        }
        elseif ($action === "unban"){
            $newStatus = "Pending";
        }
        else{
            respond(["error" => "Invalid action"], 400);
        }
        
        $sql = "UPDATE reports
                SET status = ?
                WHERE report_id = ?";
        
        $stmt = mysqli_prepare($conn, $sql);

        //if no statements === sql failed
        if (!$stmt) {
            respond(['error' => 'Database error: ' . mysqli_error($conn)], 500);
        }        

        //replace question mark with variables
        mysqli_stmt_bind_param($stmt, "ss", $newStatus, $report_id);
        mysqli_stmt_execute($stmt);      //execute sql / stmt


        if (mysqli_stmt_affected_rows($stmt) > 0){ //if row is affected
            respond(["message" => "Report Updated", "status" => $newStatus], 200);
        }
        else{ // no rows effected
            respond(["error" => "No rows updated"], 400);
        }
    }

?>