<?php
    session_start(); // starts session to access session variables

    if(empty($_SESSION["user_id"])){ // checks whether the current session's user id is empty
        respond(['error' => 'Please Log In First', 401]);
    }

    include("../db_connect.php");
    include("headers.php");
    include("helpers.php");

    $method = $_SERVER["REQUEST_METHOD"]; // gets HTTP request method
    $user_id = $_SESSION["user_id"]; // retrieves logged in user id

    //GET ALL INVENTORY DATA

    if($method === "GET"){
        $mode = $_GET['mode'] ?? ''; // if get mode doesnt exist make it to '' just as safety precaution

        if(empty($mode)){
            respond(['error' => 'Invalid Request Attribute', 400]);
        }

        if($mode === "all"){ // if value and type is "all" then proceed
            $sql = "SELECT p.prize_id, p.prize_name, p.prize_type, p.prize_image_url, r.redemption_id, r.redeemed_at
                    FROM prizes p INNER JOIN redemption r ON p.prize_id = r.prize_id
                    WHERE r.user_id = ?
                    ORDER BY r.redeemed_at DESC";
        }

        $stmt = mysqli_prepare($conn, $sql); // prepares the sql 
        mysqli_stmt_bind_param($stmt, 's', $user_id); // bind parameters
        mysqli_stmt_execute($stmt);      // execute
        $result = mysqli_stmt_get_result($stmt); //saves

        $response = [];
        while ($row = mysqli_fetch_assoc($result)){ 
            $response[] = [ // append each row from $result to the response's empty array
                "prize_id"          => $row['prize_id'],
                "prize_name"        => $row['prize_name'],
                "prize_type"        => $row['prize_type'],
                "prize_image_url"   => $row['prize_image_url'],
                "redemption_id"     => $row['redemption_id'],
                "redeemed_at"       => $row['redeemed_at'] // i can just do $row wth am i doing oh its based on database we do it manually so that if the name changes in database it will still work
            ];
        }

        respond($response); // sends the response array as JSON to javascript
    }
?>