<?php
session_start();

include("headers.php");
include("helpers.php");
include("../db_connect.php");

// if doesnt exist create new one
$targetDir = "../assets/profile/";
if (!file_exists($targetDir)) {
    mkdir($targetDir);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['profile_pic'])) {
    $file = $_FILES['profile_pic'];
    $fileType = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    // Validate Image
    $check = getimagesize($file['tmp_name']);
    if ($check === false) {
        respond(['success' => false, 'message' => 'File is not an image.']);
        exit;
    }

    // Validate Size
    if ($file['size'] > 2000000) {
        respond(['success' => false, 'message' => 'File is too large (Max 2MB).']);
        exit;
    }

    // Generate Name
    // Ensure user_id exists to prevent errors
    $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'guest';
    $newFileName = $userId . time() . "." . $fileType;
    $targetFilePath = $targetDir . $newFileName;

    // Move and Respond
    if (!move_uploaded_file($file['tmp_name'], $targetFilePath)) {
    //     respond(['success' => true, 'path' => $targetFilePath]);
    // } else {
        respond(['success' => false, 'message' => 'Failed to save file.']);
    }

    $sql = "UPDATE users SET profile_picture_url = 'assets/profile/$newFileName'
            WHERE user_id = '$userId'";;

    $result = mysqli_query($conn, $sql);

    if (mysqli_affected_rows($conn) < 1){
        respond(['error'=>'path is not updated to database']);
    }

    respond(['success'=>'Image is added and path is created in database', 'path'=>$targetFilePath]);
} else {
    // Handle case where file is missing
    respond(['success' => false, 'message' => 'No file uploaded or wrong request method.']);
}
?>