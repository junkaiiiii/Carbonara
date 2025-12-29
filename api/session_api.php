<?php
session_start();

include "headers.php";
include "helpers.php";
include "../db_connect.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET"){
    $mode = $_GET["mode"];

    if (empty($mode)){
        respond(["error"=>"Invalid Request"],400);
    }

    if (empty($_SESSION['user_id'])){
        respond(["error"=>"Please Login First"],400);
    }

    $user_id = $_SESSION['user_id'];

    // general =>(username, email, role),  detailed => (edit profile page data)
    if ($mode === "general"){
        $sql = "SELECT username, email, role FROM users 
                WHERE user_id = '$user_id'";

        $result = mysqli_query($conn,$sql);

        $response = [];

        if ($result){
            while ($row = mysqli_fetch_assoc($result)){
                $response = $row;
                break;
            }
        }
        respond($response,200);
    } elseif($mode === "detailed") {
        // return profile page detail
    } else {
        respond (['error'=>'invalid mode'],400);
    }


} else {
    respond(["error"=>"Invalid request method"]);
}

?>