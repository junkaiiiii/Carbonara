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
    $data = json_decode(file_get_contents("php://input",true));

    $required = [
        "user_id",
        "prize_id",
        "cost"
    ];

    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            respond(["error" => "Missing required field: $field"], 400);
        }
    }


}
?>