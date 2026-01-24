<?php
session_start();

// if doesnt exist create new one
$targetDir = "../assets/profile/";
if (!file_exists($targetDir)) {
    mkdir($targetDir);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['profile_pic'])) {
    $file = $_FILES['profile_pic'];
    $fileType = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    // check if its an imag
    $check = getimagesize($file['tmp_name']);
    if ($check === false) {
        echo json_encode(['success' => false, 'message' => 'File is not an image.']);
        exit;
    }

    // check file size
    if ($file['size'] > 2000000) {
        echo json_encode(['success' => false, 'message' => 'File is too large (Max 2MB).']);
        exit;
    }

    // generate unique file name
    $newFileName = "$_SESSION['user_id']" . time() . "." . $fileType;
    $targetFilePath = $targetDir . $newFileName;

    // move file to target directory, send message to front end
    if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        echo json_encode(['success' => true, 'path' => $targetFilePath]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save file.']);
    }
}
?>