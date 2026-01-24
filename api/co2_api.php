<?php
include "headers.php";
include "../db_connect.php";
include "helpers.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET"){
    $mode = $_GET['mode'] ?? "ranking";

    if ($mode === "ranking"){
        $sql = "SELECT u.username, u.role, COALESCE(SUM(c.co2_saved),0) as saved_co2 FROM users u
            LEFT JOIN co2_log c ON u.user_id = c.user_id
            GROUP BY u.username, u.role
            ORDER BY saved_co2 DESC;";

        $result = mysqli_query($conn, $sql);

        $response = [];

        if ($result && mysqli_num_rows($result) > 0){
            while ($row = mysqli_fetch_assoc($result)){
                $response[] = $row;
            }
        }
        respond($response,200);
    }elseif($mode === "total"){
        $sql = "SELECT  COALESCE(SUM(c.co2_saved),0) as total_saved_co2 
                FROM co2_log c";

        $result = mysqli_query($conn,$sql);

        $response = 0;

        if ($result){
            while ($row = mysqli_fetch_assoc($result)){
                $response = $row['total_saved_co2'];
            }
        }

        respond($response,200);
    }else{
        respond(["error"=>"Invalid Mode"],200);
    }
    
}
elseif ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"),true);
    $required = ['userId','rideId','co2Saved'];

    // validate data passed from front end
    foreach ($required as $r){
        if (empty($data[$r])){
            respond(['error'=>'missing required field'],400);
        }
    }


    $sql = "INSERT INTO co2_log (co2_id, ride_id, user_id, co2_saved, log_at) 
    VALUES (?, ?, ?, ?, ?);
    ";

    $stmt = mysqli_prepare($conn, $sql);

    $co2_id = generateId("CO");
    $log_at = date('Y-m-d H:i:s');
    mysqli_stmt_bind_param($stmt,"sssds", $co2_id, $data['rideId'], $data['userId'], $data['co2Saved'], $log_at);
    $executed = mysqli_stmt_execute($stmt);

    if (!$executed) {
        respond([
            "error" => "Database execution failed",
            "details" => mysqli_stmt_error($stmt)
        ], 500);
    }

    if (mysqli_stmt_affected_rows($stmt) === 0) {
        respond([
            "error" => "No new co2 data is inserted"
        ], 404);
    }

    respond(["success" => "Successfully created a new co2 entry $co2_id"],200);
}


?>