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
else {
    respond('Invalid Request method');
}


?>