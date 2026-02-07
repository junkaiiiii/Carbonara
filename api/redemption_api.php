<?php
session_start(); // starts session to access session functions 
if (empty($_SESSION['user_id'])){ // checks whether the current session has user id, if no sends error json to js 
    respond(['error' => 'Please Login'],400);
}

include("../db_connect.php");
include("headers.php");
include("helpers.php");

$method = $_SERVER["REQUEST_METHOD"]; // stores HTTP method

if ($method === "POST"){ 
    $data = json_decode(file_get_contents("php://input"),true); // file_get_contents get raw POST data because PHP doesnt automatically puts JSON into $_POST variables. Before getting them, theyre just a JSON encoded string within the HTTP request body
    // converts the JSON string to PHP variable , true returns them as an associative array
    $required = [
        "prize_id",
        "cost"
    ];

    foreach ($required as $field) { // for each item in required, store the item in field
        if (!isset($data[$field]) || empty($data[$field])) { // if the varibale doesnt exist or is empty
            respond(["error" => "Missing required field: $field"], 400); // sends the response array as JSON to javascript
        }
    } 

    $redemption_id = generateId("RED"); // generate unique ID with prefix RED
    $redeemed_at = date('Y-m-d H:i:s'); // date fomat 
    $cost = intval($data['cost']); // convert to integer 

    $sql = "INSERT INTO redemption
            (redemption_id, prize_id, user_id, cost, redeemed_at)
            VALUES
            (?,?,?,?,?)";
    $stmt = mysqli_prepare($conn,$sql); // prepare sql
    mysqli_stmt_bind_param($stmt,"sssis", $redemption_id, $data['prize_id'], $_SESSION['user_id'], $cost, $redeemed_at); // bind parameters
    mysqli_stmt_execute($stmt); // executes
    mysqli_stmt_close($stmt); // close good practice

    if (mysqli_stmt_affected_rows($stmt) > 0) { // if the data row is more than 0 then sends data back to JS as JSON
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