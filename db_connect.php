<?php

$conn = mysqli_connect("localhost","root","","ridegreen_practice");

if (!$conn){
    header("Content-Type: application/json");
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . mysqli_connect_error()]);
    exit;
}

// $sql = file_get_contents("carpooling_schema.sql");

// if (mysqli_multi_query($conn,$sql)){
//     echo "Tables created successfully";
// } else {
//     echo "Error when creating tables";
// }
?>