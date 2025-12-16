<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization");

$env = parse_ini_file('.env');

    $orsApiKey = $env['ORS_API_KEY'];
    $geocodeToken = $env['GEOCODE_TOKEN'];

    echo json_encode([
        "orsApiKey" => $orsApiKey,
        "geocodeToken" => $geocodeToken,
        "success" => $orsApiKey !== null
    ]);
?>