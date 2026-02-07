<?php
session_start(); // starts session to access session variables

if (empty($_SESSION["user_id"])) { // if the current session has no user id then 
    respond(['error' => 'Please Log In First', 400]); // sends the response array as JSON to javascript
}

include("../db_connect.php");
include("headers.php");
include("helpers.php");

$method = $_SERVER["REQUEST_METHOD"]; // get HTTP method 
$user_id = $_SESSION['user_id'];  

if ($method === "GET") { // if the HTTP method is get, checks whats the mode 
    $mode = $_GET['mode'] ?? ''; // if we dont get the mode set it to ''

    if (empty($mode)) { // no mode = '', thus sends error JSON to js
        respond(['error' => 'Invalid Request Attribute', 400]);
    }

    if ($mode === "all") { // if mode = all
        $sql = "SELECT p.prize_id, 
                    p.prize_name,
                    p.points_required,
                    p.stock,
                    p.prize_type,
                    p.prize_image_url,

                    r.redemption_id

                 FROM prizes p
                LEFT JOIN redemption r ON p.prize_id = r.prize_id AND r.user_id= ?;
                "; // shows all the prizes even if not redeemed
                
        $stmt = mysqli_prepare($conn, $sql); // prepares the sql statement
        mysqli_stmt_bind_param($stmt, 's', $user_id); // bind parameters
        mysqli_stmt_execute($stmt); // executes the prepared sql statement
        $result = mysqli_stmt_get_result($stmt); // get the result and store them

        $response = []; // creates an empty array
        while ($row = mysqli_fetch_assoc($result)) { // loop through each row and append it into the empty array
            $response[] = [
                "prize_id"        => $row['prize_id'],
                "prize_name"      => $row['prize_name'],
                "points_required" => (int)$row['points_required'], 
                "stock"           => $row['stock'] ? (int)$row['stock'] : null,           
                "prize_type"      => $row['prize_type'],
                "prize_image_url" => $row['prize_image_url'],
                
                // LOGIC: If redemption_id is NOT empty (meaning not NULL), return true.
                "redeemed"        => !empty($row['redemption_id']) 
            ];
        }
    }
    else if($mode === "admin_all"){ // admin obtain all data 
        $sql = "SELECT prize_id, prize_name, points_required, stock, prize_type, prize_image_url FROM prizes;";
        $result = mysqli_query($conn, $sql);
        $response = [];
        while ($row = mysqli_fetch_assoc($result)){
            $response[] = [
                "prize_id"        => $row['prize_id'],
                "prize_name"      => $row['prize_name'],
                "points_required" => (int)$row['points_required'],
                "stock"           => (int)$row['stock'],
                "prize_type"      => $row['prize_type'],
                "prize_image_url" => $row['prize_image_url']
            ];
        }
    }

    respond($response); // sends JSON to js
}
else if($method === "POST") {
    // Admin Adding New Prize
    // $data = json_decode(file_get_contents("php://input"), true);

    $required = [
        'prize_name',
        'points_required',
        'stock',
        'prize_type',
        'prize_image_url'
    ];
    if(!isset($_FILES['prize_image_url'])){
        respond(['error' => 'Prize Image URL is required', 400]);
    }

    $file = $_FILES['prize_image_url'] ?? null;

    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowed_types)) {
        respond(['error' => 'Invalid image type. Allowed types: JPEG, JPG, PNG, GIF, WEBP', 400]);
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION); // gives the end of the dot eg :png, jpg, webpg etc
    $filename = uniqid('prize_', true) . '.' . $extension;

    $upload_dir = '../assets/img/';
    $target_file = $upload_dir . $filename;

    //moves file from temp storage to folder

    if (!move_uploaded_file($file['tmp_name'], $target_file)) {
        respond(['error' => 'Failed to move uploaded file', 500]);
    }

    $prize_image_url = $filename;

    $prize_id = generateId("PR_");
    $prize_name      = mysqli_real_escape_string($conn, $_POST['prize_name']);
    $points_required = intval($_POST['points_required']);
    $prize_type      = $_POST['prize_type'];
    // $prize_image_url = $_POST['prize_image_url'];

    if ($_POST['stock'] === "null" || $_POST['stock'] ===""){
        $stock = null;
    }
    else{
        $stock = intval($_POST['stock']);        
    }

    if (empty($prize_name)){
        respond(['error' => 'Prize Image URL is required', 400]);
    }

    if (empty($prize_name) || empty($points_required) || empty($prize_type) || empty($prize_image_url)) {
        respond(['error' => 'Missing Required Fields', 400]);
    }

    $sql = "INSERT INTO prizes (prize_id, prize_name, points_required, stock, prize_type, prize_image_url)
            VALUES (?, ?, ?, ?, ?, ?);";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, 'ssiiss', $prize_id, $prize_name, $points_required, $stock, $prize_type, $prize_image_url);

    if (mysqli_stmt_execute($stmt)) {
        respond(['message' => 'Prize Added Successfully', 'prize_id' => $prize_id, 'image_url' => $prize_image_url], 201);
    } else {
        // Delete uploaded file if database insertion fails
        if (file_exists($upload_path)) {
            unlink($upload_path);
        }

        respond(['error' => 'Database Insertion Failed', 500]);
    }
} 
else if($method === "PUT"){
    $mode = $_GET['mode'] ?? "";
    

    if ($mode === "stock"){
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['prize_id']) || !isset($data['new_stock'])){
            respond(['error' => 'Missing prize_id or new_stock'], 400);
        }
        $prize_id = mysqli_real_escape_string($conn, $data['prize_id']);
        $new_stock = intval($data['new_stock']);

        if ($new_stock < 0){
            respond(['error' => 'Stock cannot be negative'],400);
        }

        $sql = "UPDATE prizes SET stock = ? WHERE prize_id = ?";
        $stmt = mysqli_prepare($conn,$sql);
        mysqli_stmt_bind_param($stmt, "is", $new_stock, $prize_id);

        if (mysqli_stmt_execute($stmt)){
            if (mysqli_stmt_affected_rows($stmt) > 0){
                respond(['message' => "Stock Updated", "stock" => $new_stock], 200);
            }
            else{
                respond(["error" => "No rows updated"], 400);
            }
        }
    }
    else if($mode ==="points"){
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['prize_id']) || !isset($data['new_point'])){
            respond(['error' => 'Missing prize_id or new_point'], 400);
        }

        $prize_id = mysqli_real_escape_string($conn,$data['prize_id']);
        $new_point = intval($data['new_point']);

        if ($new_point < 0){
            respond(['error' => 'Points cannot be negative'],400);
        }

        $sql = "UPDATE prizes SET points_required = ? WHERE prize_id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "is", $new_point, $prize_id);
         if (mysqli_stmt_execute($stmt)){
            if (mysqli_stmt_affected_rows($stmt) > 0){
                respond(['message' => "Point Updated", "points" => $new_point], 200);
            }
            else{
                respond(["error" => "No rows updated"], 400);
            }
        }
    }


}

else {
    respond(['error' => 'Invalid Request Method', 405]);
}