<?php
    session_start();

    if(empty($_SESSION["user_id"])){
        respond(['error' => 'Please Log In First', 401]);
    }

    include("../db_connect.php");
    include("headers.php");
    include("helpers.php");

    $method = $_SERVER["REQUEST_METHOD"];
    $user_id = $_SESSION["user_id"];

    //GET ALL INVENTORY DATA

    if($method === "GET"){
        $mode = $_GET['mode'] ?? '';

        if(empty($mode)){
            respond(['error' => 'Invalid Request Attribute', 400]);
        }

        if($mode === "all"){
            $sql = "SELECT p.prize_id, p.prize_name, p.prize_type, p.prize_image_url, r.redemption_id, r.redeemed_at
                    FROM prizes p INNER JOIN redemption r ON p.prize_id = r.prize_id
                    WHERE r.user_id = ?
                    ORDER BY r.redeemed_at DESC";
        }

        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, 's', $user_id);
        mysqli_stmt_execute($stmt);     
        $result = mysqli_stmt_get_result($stmt);

        $response = [];
        while ($row = mysqli_fetch_assoc($result)){
            $response[] = [
                "prize_id"          => $row['prize_id'],
                "prize_name"        => $row['prize_name'],
                "prize_type"        => $row['prize_type'],
                "prize_image_url"   => $row['prize_image_url'],
                "redemption_id"     => $row['redemption_id'],
                "redeemed_at"       => $row['redeemed_at']
            ];
        }

        respond($response);
    }
?>