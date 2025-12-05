<?php
// Generate QR code for room code

header('Content-Type: application/json');

// Get room code from request
$room_code = isset($_GET['room_code']) ? $_GET['room_code'] : '';

if (empty($room_code)) {
   respond(['error' => 'Room code is required'],400);
}

$base_url = 'request_api.php';
$qr_url = $base_url . '?room_code=' . urlencode($room_code);

$qr_image_url = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' . urlencode($qr_url);


// Return QR code data
echo json_encode([
    'success' => true,
    'room_code' => $room_code,
    'qr_url' => $qr_url,
    'qr_image' => $qr_image_url
]);
?>