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
        respond(["error"=>"Please Login First"]);
    }

    $user_id = $_SESSION['user_id'];

    // general =>(username, email, role),  detailed => (edit profile page data)
    if ($mode === "general"){
        $sql = "SELECT user_id, username, email, role FROM users 
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
        $sql = "SELECT u.user_id, u.username, u.full_name, u.gender, u.role, u.email, u.phone, u.profile_picture_url, 
                COALESCE(user_stats.total_rides,0) AS total_rides,  
                COALESCE(user_stats.rating,0) AS rating, 
                COALESCE(user_stats.co2_saved,0) AS co2_saved 
                FROM users u
                LEFT JOIN 
                (
                    SELECT u2.user_id, COUNT(DISTINCT rp.participant_id) AS total_rides, AVG(rt.score) AS rating, SUM(co.co2_saved) AS co2_saved
                    FROM users u2
                    LEFT JOIN ride_participants rp ON u2.user_id = rp.user_id
                    LEFT JOIN ratings rt ON u2.user_id = rt.rated_id
                    LEFT JOIN co2_log co ON u2.user_id = co.user_id
                    GROUP BY u2.user_id
                )as user_stats ON u.user_id = user_stats.user_id
                WHERE u.user_id = '$user_id';";
        $result = mysqli_query($conn,$sql);

        $response = [];

        if ($result){
            while ($row = mysqli_fetch_assoc($result)){
                $response = $row;
                break;
            }
        }
        respond($response,200);

    } else {
        respond (['error'=>'invalid mode'],400);
    }


} else {
    respond(["error"=>"Invalid request method"]);
}

?>