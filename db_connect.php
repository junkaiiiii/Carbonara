<?php

$conn = mysqli_connect("localhost","root","","ridegreen_practice");

if (!$conn){
    echo "Error";
}

// $sql = file_get_contents("carpooling_schema.sql");

// if (mysqli_multi_query($conn,$sql)){
//     echo "Tables created successfully";
// } else {
//     echo "Error when creating tables";
// }
?>