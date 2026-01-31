<?php
session_start();

include("headers.php");
include("helpers.php");
include("../db_connect.php");

// 1. Change target directory to license folder
$targetDir = "../assets/licenses/"; 
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['license_image'])) {
    $file = $_FILES['license_image'];
    $fileType = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    // Validate Image
    if (getimagesize($file['tmp_name']) === false) {
        respond(['success' => false, 'message' => 'File is not an image.']);
        exit;
    }

    // Validate Size (2MB)
    if ($file['size'] > 2000000) {
        respond(['success' => false, 'message' => 'File is too large (Max 2MB).']);
        exit;
    }

    // Generate Unique Name
    $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : exit(json_encode(['success' => false, 'message' => 'User not logged in']));
    
    // Create a unique License ID (matching your DL_... format)
    $licenseId = "DL_" . substr(md5(uniqid()), 0, 13);
    $newFileName = $licenseId . "." . $fileType;
    $targetFilePath = $targetDir . $newFileName;

    // Move File
    if (!move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        respond(['success' => false, 'message' => 'Failed to save file.']);
        exit;
    }

    // 2. Update driving_license table
    // If user already has a row, we update the image and reset status to 'Pending'
    $sql = "INSERT INTO driving_license (license_id, user_id, status, license_image_url) 
            VALUES ('$licenseId', '$userId', 'Pending', 'assets/licenses/$newFileName')
            ON DUPLICATE KEY UPDATE 
            license_image_url = 'assets/licenses/$newFileName', 
            status = 'Pending'";

    $result = mysqli_query($conn, $sql);

    if (mysqli_error($conn)) {
        respond(['success' => false, 'message' => 'Database error: ' . mysqli_error($conn)]);
        exit;
    }

    respond([
        'success' => true, 
        'message' => 'License uploaded! Awaiting admin approval.',
        'status' => 'Pending'
    ]);

} else {
    respond(['success' => false, 'message' => 'No file uploaded.']);
}
?>