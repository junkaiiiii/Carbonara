<?php
session_start();
if (empty($_SESSION['user_id'])){
    respond(['error' => 'Please Login'],400);
}

include("../db_connect.php");
include("headers.php");
include("helpers.php");

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST"){
    $data = json_decode(file_get_contents("php://input"),true);

    $required = [
        "prize_id",
        "cost"
    ];

    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            respond(["error" => "Missing required field: $field"], 400);
        }
    }

    $redemption_id = generateId("RED");
    $redeemed_at = date('Y-m-d H:i:s');
    $cost = intval($data['cost']);

    $sql = "INSERT INTO redemption
            (redemption_id, prize_id, user_id, cost, redeemed_at)
            VALUES
            (?,?,?,?,?)";
    $stmt = mysqli_prepare($conn,$sql);
    mysqli_stmt_bind_param($stmt,"sssis", $redemption_id, $data['prize_id'], $_SESSION['user_id'], $cost, $redeemed_at);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    if (mysqli_stmt_affected_rows($stmt) > 0) {
        respond([
            "success" => true, 
            "message" => "Redemption successful",
            "redemption_id" => $redemption_id
        ], 201);
    } else {

        respond(["error" => "Failed to create redemption record."], 500);
    }
    
    mysqli_stmt_close($stmt);



}else {
    respond(['Error'=>"Invalid Request Method"]);
}
?>