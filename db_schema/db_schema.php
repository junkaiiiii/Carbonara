<?php

include "../db_connect.php";

$sql = "
CREATE TABLE users (
    user_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(30),
    username VARCHAR(20) UNIQUE,
    email VARCHAR(20) UNIQUE,
    password_hash VARCHAR(20),
    role ENUM('Driver','Passenger','Admin'),
    phone VARCHAR(15),
    profile_picture_url VARCHAR(30),
    created_at DATETIME
);";

$sql .= "
CREATE TABLE rides (
    ride_id VARCHAR(20) PRIMARY KEY,
    driver_id VARCHAR(20),
    origin_text VARCHAR(50),
    origin_lat DECIMAL(10,6),
    origin_lon DECIMAL(10,6),
    destination_text VARCHAR(50),
    destination_lat DECIMAL(10,6),
    destination_lon DECIMAL(10,6),
    route_geojson JSON,
    departure_datetime DATETIME,
    available_seats INT,
    status ENUM('Upcoming','Ongoing','Completed','Cancelled'),
    created_at DATETIME,
    room_code INT,
    FOREIGN KEY (driver_id) REFERENCES users(user_id)
);";


$sql .= "
CREATE TABLE points_log (
    point_id VARCHAR(20) PRIMARY KEY,
    ride_id VARCHAR(20),
    user_id VARCHAR(20),
    points_earned INT,
    log_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);";

$sql .= "
CREATE TABLE co2_log (
    co2_id VARCHAR(20) PRIMARY KEY,
    ride_id VARCHAR(20),
    user_id VARCHAR(20),
    co2_saved DECIMAL(10,2),
    log_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);";

$sql .= "
CREATE TABLE ride_participants (
    participant_id VARCHAR(20) PRIMARY KEY,
    ride_id VARCHAR(20),
    user_id VARCHAR(20),
    joined_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);";

$sql .= "
CREATE TABLE requests (
    request_id VARCHAR(20) PRIMARY KEY,
    ride_id VARCHAR(20),
    passenger_id VARCHAR(20),
    status ENUM('requested','approved','rejected','cancelled'),
    requested_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (passenger_id) REFERENCES users(user_id)
);";

$sql .= "
CREATE TABLE ratings (
    rating_id VARCHAR(20) PRIMARY KEY,
    ride_id VARCHAR(20),
    rater_id VARCHAR(20),
    rated_id VARCHAR(20),
    score DECIMAL(3,1),
    description VARCHAR(30),
    created_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (rater_id) REFERENCES users(user_id),
    FOREIGN KEY (rated_id) REFERENCES users(user_id)
);";

$sql .= "
CREATE TABLE reports (
    report_id VARCHAR(20) PRIMARY KEY,
    ride_id VARCHAR(20),
    reporter_id VARCHAR(20),
    reported_user_id VARCHAR(20),
    description VARCHAR(30),
    status ENUM('Pending','Approved','Rejected'),
    created_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (reporter_id) REFERENCES users(user_id),
    FOREIGN KEY (reported_user_id) REFERENCES users(user_id)
);";

$sql .= "
CREATE TABLE prizes (
    prize_id VARCHAR(20) PRIMARY KEY,
    prize_name VARCHAR(20),
    points_required INT,
    stock INT,
    prize_image_url VARCHAR(17)
);";

$sql .= "
CREATE TABLE redemption (
    redemption_id VARCHAR(20) PRIMARY KEY,
    prize_id VARCHAR(20),
    user_id VARCHAR(20),
    cost INT,
    redeemed_at DATETIME,
    FOREIGN KEY (prize_id) REFERENCES prizes(prize_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);";

$sql .= "
CREATE TABLE driving_license (
    license_id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20),
    status ENUM('Pending','Approved','Rejected'),
    license_image_url VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);";

$sql .= "
CREATE TABLE vehicles (
    vehicle_id VARCHAR(20) PRIMARY KEY,
    driver_id VARCHAR(20),
    car_plate_number VARCHAR(8),
    color VARCHAR(30),
    type VARCHAR(20),
    registered_at DATETIME,
    FOREIGN KEY (driver_id) REFERENCES users(user_id)
);";

$sql .= "
SET FOREIGN_KEY_CHECKS = 0;

-- Users
INSERT INTO users (user_id, full_name, username, email, password_hash, role, phone, profile_picture_url, created_at) VALUES
('US_001', 'Tan Jian Shen', 'tanjian', 'jian@example.com', 'hash123', 'Driver', '0123456789', 'pic1.png', '2025-11-30 11:30'),
('US_002', 'Alice Lee', 'alicelee', 'alice@example.com', 'hash456', 'Passenger', '0118886666', 'pic2.png', '2025-11-30 12:00'),
('US_003', 'Michael Chan', 'mikechan', 'mike@example.com', 'hash789', 'Passenger', '0172233445', 'pic3.png', '2025-12-01 09:45'),
('US_004', 'Sho Jun Kai', 'junkai_sho', 'kai@test.com', 'hashed_password4', 'Driver', '0189559134', 'pfp4.png', '2025-11-24 23:56:48');



-- Rides
INSERT INTO rides (ride_id, driver_id, origin_text, origin_lat, origin_lon, destination_text, destination_lat, destination_lon, route_geojson, departure_datetime, available_seats, status, created_at, room_code) VALUES
('RD_101', 'US_001', 'Sri Petaling', 3.068810, 101.689710, 'Asia Pacific University', 3.042300, 101.688800,
    '{ \"0\": [101.68971, 3.06881], \"1\": [101.6888, 3.0423] }',
    '2025-10-31 10:05', 3, 'Upcoming', '2025-10-25 09:00', 123456),
('RD_102', 'US_001', 'Bukit Jalil', 3.054300, 101.690200, 'APU Campus', 3.052000, 101.689000,
    '{ \"0\": [101.6902, 3.0543], \"1\": [101.689, 3.052] }',
    '2025-11-01 08:30', 2, 'Upcoming', '2025-10-26 11:00', 654321),
('RD_103', 'US_001', 'Puchong IOI Mall', 3.043210, 101.618400, 'APU Campus', 3.052100, 101.689200,
 '{ \"0\": [101.6184, 3.04321], \"1\": [101.6892, 3.0521] }',
 '2025-11-02 09:15:00', 3, 'Upcoming', '2025-10-27 10:20:00', 223344),

('RD_104', 'US_001', 'OUG Parklane', 3.066900, 101.658900, 'Bukit Jalil LRT', 3.056700, 101.692200,
 '{ \"0\": [101.6589, 3.0669], \"1\": [101.6922, 3.0567] }',
 '2025-11-03 07:45:00', 4, 'Upcoming', '2025-10-28 08:15:00', 998877),

('RD_105', 'US_001', 'Cheras Leisure Mall', 3.084300, 101.742900, 'APU Campus', 3.052000, 101.689000,
 '{ \"0\": [101.7429, 3.0843], \"1\": [101.689, 3.052] }',
 '2025-11-04 08:00:00', 2, 'Upcoming', '2025-10-29 09:00:00', 121212),

('RD_106', 'US_001', 'Kuchai Lama', 3.095500, 101.690300, 'Sri Petaling', 3.068800, 101.689700,
 '{ \"0\": [101.6903, 3.0955], \"1\": [101.6897, 3.0688] }',
 '2025-11-05 09:30:00', 3, 'Upcoming', '2025-10-30 11:10:00', 343434),

('RD_107', 'US_001', 'KL Sentral', 3.134800, 101.686300, 'APU Campus', 3.052100, 101.689200,
 '{ \"0\": [101.6863, 3.1348], \"1\": [101.6892, 3.0521] }',
 '2025-11-06 08:20:00', 1, 'Upcoming', '2025-11-01 13:00:00', 565656),

('RD_108', 'US_001', 'Mid Valley Megamall', 3.118500, 101.677000, 'Technology Park Malaysia', 3.049900, 101.702300,
 '{ \"0\": [101.6770, 3.1185], \"1\": [101.7023, 3.0499] }',
 '2025-11-07 09:40:00', 3, 'Upcoming', '2025-11-02 14:30:00', 787878),

('RD_109', 'US_001', 'Sunway Pyramid', 3.072200, 101.606900, 'Bukit Jalil Stadium', 3.056300, 101.689500,
 '{ \"0\": [101.6069, 3.0722], \"1\": [101.6895, 3.0563] }',
 '2025-11-08 10:00:00', 4, 'Upcoming', '2025-11-03 09:45:00', 909090),

('RD_110', 'US_001', 'Taman Connaught', 3.074800, 101.739800, 'APU Campus', 3.052100, 101.689200,
 '{ \"0\": [101.7398, 3.0748], \"1\": [101.6892, 3.0521] }',
 '2025-11-09 07:55:00', 2, 'Upcoming', '2025-11-04 12:40:00', 454545),

('RD_111', 'US_001', 'Bandar Kinrara 5', 3.038600, 101.635000, 'Sri Petaling LRT', 3.074300, 101.690800,
 '{ \"0\": [101.6350, 3.0386], \"1\": [101.6908, 3.0743] }',
 '2025-11-10 08:25:00', 3, 'Upcoming', '2025-11-05 18:30:00', 112233),

('RD_112', 'US_001', 'Old Klang Road', 3.089200, 101.666600, 'Bukit Jalil', 3.054300, 101.690200,
 '{ \"0\": [101.6666, 3.0892], \"1\": [101.6902, 3.0543] }',
 '2025-11-11 09:05:00', 2, 'Upcoming', '2025-11-06 10:00:00', 889900);



-- Points Log
INSERT INTO points_log (point_id, ride_id, user_id, points_earned, log_at) VALUES
('PO_001', 'RD_101', 'US_002', 20, '2025-10-31 10:05'),
('PO_002', 'RD_102', 'US_003', 15, '2025-11-01 08:35');



-- CO2 Log
INSERT INTO co2_log (co2_id, ride_id, user_id, co2_saved, log_at) VALUES
('CO_001', 'RD_101', 'US_002', 1.50, '2025-10-31 10:05'),
('CO_002', 'RD_102', 'US_003', 2.20, '2025-11-01 08:35');



-- Ride Participants
INSERT INTO ride_participants (participant_id, ride_id, user_id, joined_at) VALUES
('RP_001', 'RD_101', 'US_002', '2025-10-31 09:50'),
('RP_002', 'RD_101', 'US_003', '2025-10-31 09:52');



-- Requests
INSERT INTO requests (request_id, ride_id, passenger_id, status, requested_at) VALUES
('RQ_001', 'RD_101', 'US_002', 'approved', '2025-10-30 20:00'),
('RQ_002', 'RD_101', 'US_003', 'approved', '2025-10-30 20:10'),
('RQ_003', 'RD_102', 'US_003', 'requested', '2025-10-31 14:00');



-- Ratings
INSERT INTO ratings (rating_id, ride_id, rater_id, rated_id, score, description, created_at) VALUES
('RT_001', 'RD_101', 'US_002', 'US_001', 5.0, 'Driver was nice', '2025-10-31 12:00'),
('RT_002', 'RD_101', 'US_003', 'US_001', 4.5, 'Smooth ride', '2025-10-31 12:10');



-- Reports
INSERT INTO reports (report_id, ride_id, reporter_id, reported_user_id, description, status, created_at) VALUES
('RE_001', 'RD_102', 'US_003', 'US_001', 'Driver was late', 'Pending', '2025-11-01 09:00'),
('RE_002', 'RD_101', 'US_002', 'US_003', 'Passenger was rude', 'Approved', '2025-10-31 13:20');



-- Prizes
INSERT INTO prizes (prize_id, prize_name, points_required, stock, prize_image_url) VALUES
('PR_001', 'BadgeA', 100, 50, 'badgeA.png'),
('PR_002', 'BadgeB', 150, 40, 'badgeB.png');



-- Redemption
INSERT INTO redemption (redemption_id, prize_id, user_id, cost, redeemed_at) VALUES
('RED_001', 'PR_001', 'US_002', 100, '2025-11-10 14:00'),
('RED_002', 'PR_002', 'US_003', 150, '2025-11-12 16:00');



-- Driving License
INSERT INTO driving_license (license_id, user_id, status, license_image_url) VALUES
('DL_001', 'US_001', 'Approved', 'license1.png'),
('DL_002', 'US_003', 'Pending', 'license2.png');



-- Vehicles
INSERT INTO vehicles (vehicle_id, driver_id, car_plate_number, color, type, registered_at) VALUES
('VH_001', 'US_001', 'SJK732', 'Blue', 'Sedan', '2025-12-30 09:10'),
('VH_002', 'US_001', 'WXY123', 'Red', 'SUV', '2025-12-15 17:20');

SET FOREIGN_KEY_CHECKS = 1;";

if (mysqli_multi_query($conn,$sql)){
    echo "Tables created successfully";
} else {
    echo "Error when creating tables";
}

?>