<?php
session_start();

include("headers.php");
include("helpers.php");
include("../db_connect.php");

$method = $_SERVER["REQUEST_METHOD"] ?? "";

if ($method === "GET"){
    $user_id = $_GET['user_id'] ?? '';
    $ride_id= $_GET['ride_id'] ?? '';
    //check if whether the user rated a ride already

    if  (!empty($user_id) && !empty($ride_id)){
        $sql = 'SELECT rating_id FROM ratings WHERE ride_id = ? AND rater_id = ?';
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, 'ss', $ride_id, $user_id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);

        if (mysqli_stmt_fetch($stmt)){
            respond(true);
        } else {
            respond(false);
        }
    }

    respond(['error'=>'invalid request']);

    
}else if ($method === "POST"){
    $data = json_decode(file_get_contents("php://input"),true);
    $required = ['rater_id', 'rated_id', 'ride_id', 'score'];

    foreach ($data["ratings"] as $rating){
        
        foreach ($required as $r){
            if (empty($rating[$r])){
                respond(['error'=>"Please provide $r"]);
            }
        }
    }

    $sql = "INSERT INTO ratings(rating_id, ride_id, rater_id, rated_id, score, created_at)
            VALUES(?,?,?,?,?,?)";
    foreach ($data["ratings"] as $rating){
        $rating_id = generateId("RT");
        $created_at = date('Y-m-d H:i:s');

        $stmt = mysqli_prepare($conn,$sql);
        mysqli_stmt_bind_param($stmt, 'ssssis', $rating_id, $rating["ride_id"], $rating['rater_id'], $rating["rated_id"], $rating['score'], $created_at);
        $executed = mysqli_stmt_execute($stmt);
        if (!$executed) {
            respond([
                "error" => "Database execution failed",
                "details" => mysqli_stmt_error($stmt)
            ], 500);
        }
    
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            respond([
                "error" => "No request inserted"
            ]);
        }
        mysqli_stmt_close($stmt);
    }

    respond(["success" => "Successfully create the rating entries"]);
}


?>