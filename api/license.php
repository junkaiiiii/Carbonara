<?php
    session_start();

    include "headers.php";
    include "../db_connect.php";
    include "helpers.php";

    $method = $_SERVER["REQUEST_METHOD"];

    if ($method === "GET"){
        $sql = "SELECT dl.*, u.full_name, u.email, u.profile_picture_url 
                FROM driving_license dl
                INNER JOIN users u 
                ON dl.user_id = u.user_id
                ";
        $result = mysqli_query($conn, $sql);
        $response = [];

        if ($result && mysqli_num_rows($result) > 0){
            // echo "IT WORKED <br>";
            while ($row = mysqli_fetch_assoc($result)){

                $license = [
                    "license_id" => $row["license_id"],
                    "license_status" => $row['status'],
                    "license_img_url" => $row['license_image_url'],
                    "user" => [
                        "user_id" => $row['user_id'],
                        "name" => $row['full_name'],
                        "email" => $row['email'],
                        "pfp" => $row['profile_picture_url'],
                        ]
                    ];

                    $response[] = $license;
                }
            }
            respond($response, 200);
        }

?>