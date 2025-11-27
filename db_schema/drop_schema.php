<?php
include "../db_connect.php";

// $sql = "DROP TABLE IF EXISTS vehicles;
// DROP TABLE IF EXISTS driving_license;
// DROP TABLE IF EXISTS redemption;
// DROP TABLE IF EXISTS reports;
// DROP TABLE IF EXISTS ratings;
// DROP TABLE IF EXISTS requests;
// DROP TABLE IF EXISTS ride_participants;
// DROP TABLE IF EXISTS co2_log;
// DROP TABLE IF EXISTS points_log;
// DROP TABLE IF EXISTS prizes;
// DROP TABLE IF EXISTS rides;
// DROP TABLE IF EXISTS users;";

$sql = file_get_contents('drop_all_tables.sql');

if (mysqli_multi_query($conn, $sql)){
    echo "Tables Dropped!";
}
?>