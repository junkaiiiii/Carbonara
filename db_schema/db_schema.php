<?php

include "../db_connect.php";

$sql = "
CREATE TABLE users (
    user_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(30),
    username VARCHAR(20) UNIQUE,
    email VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    role ENUM('Driver','Passenger','Admin'),
    status ENUM('Active', 'Banned') DEFAULT 'Active',
    gender ENUM('Male', 'Female'),
    date_of_birth DATE,
    phone VARCHAR(15),
    profile_picture_url VARCHAR(255),
    created_at DATETIME
);";

$sql .= "
CREATE TABLE vehicles (
  vehicle_id varchar(20) PRIMARY KEY NOT NULL,
  driver_id varchar(20) DEFAULT NULL,
  car_plate_number varchar(8) DEFAULT NULL,
  brand varchar(50) DEFAULT NULL,
  manufactured_year year(4) DEFAULT NULL,
  color varchar(30) DEFAULT NULL,
  type enum('Sedan','SUV','Hatchback','Coupe','Convertible','MPV','Pickup','Van','Motorcycle') NOT NULL,
  registered_at datetime DEFAULT NULL,
  vehicle_image varchar(255) DEFAULT NULL
);";

$sql .= "
CREATE TABLE rides (
    ride_id VARCHAR(20) PRIMARY KEY,
    driver_id VARCHAR(20),
    vehicle_id VARCHAR(20),
    origin_text VARCHAR(100),
    origin_lat DECIMAL(10,6),
    origin_lon DECIMAL(10,6),
    destination_text VARCHAR(100),
    destination_lat DECIMAL(10,6),
    destination_lon DECIMAL(10,6),
    departure_datetime DATETIME,
    available_seats INT,
    ride_distance DECIMAL(6,2),
    ride_status ENUM('Cancelled','Incomplete', 'Completed') DEFAULT 'Incomplete',
    created_at DATETIME,
    room_code INT UNIQUE,
    FOREIGN KEY (driver_id) REFERENCES users(user_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
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
    description VARCHAR(255),
    status ENUM('Pending','Approved','Rejected'),
    created_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (reporter_id) REFERENCES users(user_id),
    FOREIGN KEY (reported_user_id) REFERENCES users(user_id)
);";

$sql .= "
CREATE TABLE prizes (
    prize_id VARCHAR(20) PRIMARY KEY,
    prize_name VARCHAR(50),
    points_required INT,
    stock INT,
    prize_type ENUM('voucher','badge'),
    prize_image_url VARCHAR(255)
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
    license_image_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);";



$sql .= "
SET FOREIGN_KEY_CHECKS = 0;

-- Users
INSERT INTO `users` (`user_id`, `full_name`, `username`, `email`, `password_hash`, `role`, `status`, `gender`, `date_of_birth`, `phone`, `profile_picture_url`, `created_at`) VALUES
('US_692f0e453c9dd', 'Eng Hong Xuan', 'enghongxuan', 'eng@example.com', '$2y$10\$NCF.XdYUNhz8tmiTVPQ.EuFsS82VuPpYiN90VeKQv4xj2jMl9cA5i', 'Driver', 'Active', 'Male', '2001-05-12', '012345678', 'assets/profile/US_692f0e453c9dd1769596198.jpeg', '2025-12-02 17:05:25'),
('US_692f0e82a7fb7', 'Tan Jian Shen', 'tanjianshen', 'tan@example.com', '$2y$10\$jqw4A6f/PoQ07vgxeFmlz.RUXLvIBkRJ6DH5z9JYFhwjqWMQZ1cMy', 'Passenger', 'Active', 'Male', '2002-08-21', '012456783', 'assets/profile/US_692f0e82a7fb71769596169.jpeg', '2025-12-02 17:06:26'),
('US_692f0ebbe9265', 'Sho Jun Kai', 'shojunkai', 'sho@example.com', '$2y$10$4B3rHqqhmrzEURuFHC9ZW.6z.jeXS7eAJxw2SIAp/OMZCB3DlW8fK', 'Passenger', 'Active', 'Male', '2002-11-03', '0134445567', 'assets/profile/US_692f0ebbe92651769596117.jpg', '2025-12-02 17:07:24'),
('US_692f0f042125d', 'Thum Zhi Jian', 'thumzijian', 'thum@example.com', '$2y$10\$m9Um9JgPOkGb.1ErBKkAn.JmSZRKQ.Iijl4j3nHsn4psFice7RL1C', 'Driver', 'Active', 'Male', '2001-02-17', '0145678999', 'assets/profile/US_692f0f042125d1769596372.jpeg', '2025-12-02 17:08:36'),
('US_692f0f2dd3648', 'Leong Zi Heng', 'leongziheng', 'leong@example.com', '$2y$10\$ninwsFSLga6vHnBAbTJrkeHaYkBvSluuo35mHdJ84EEzkgruJjbdS', 'Admin', 'Active', 'Male', '2000-09-09', '0126673456', 'assets/profile/US_692f0f2dd36481769596321.jpeg', '2025-12-02 17:09:17');

-- Vehicles
INSERT INTO `vehicles` (`vehicle_id`, `driver_id`, `car_plate_number`, `brand`, `manufactured_year`, `color`, `type`, `registered_at`, `vehicle_image`) VALUES
('VH_692f13de625f8', 'US_692f0e453c9dd', 'SJK732', 'Toyota', '2020', 'Blue', 'Sedan', '2025-12-30 09:10:00', ''),
('VH_692f13de62608', 'US_692f0e453c9dd', 'WXY123', 'Honda', '2023', 'Red', 'SUV', '2025-12-15 17:20:00', '');


-- Rides
INSERT INTO rides (
    ride_id,
    driver_id,
    vehicle_id,
    origin_text,
    origin_lat,
    origin_lon,
    destination_text,
    destination_lat,
    destination_lon,
    departure_datetime,
    available_seats,
    ride_distance,
    ride_status,
    created_at,
    room_code
) VALUES
('RD_692f17d1e7ebd', 'US_692f0e453c9dd', 'VH_692f13de625f8',
 'Sri Petaling', 3.068810, 101.689710,
 'Asia Pacific University', 3.042300, 101.688800,
 '2025-10-31 10:05:00', 3, 5.20, 'Completed', '2025-10-25 09:00:00', 123456),

('RD_692f17d1e7eda', 'US_692f0e453c9dd', 'VH_692f13de625f8',
 'Bukit Jalil', 3.054300, 101.690200,
 'APU Campus', 3.052000, 101.689000,
 '2025-11-01 08:30:00', 2, 2.10, 'Completed', '2025-10-26 11:00:00', 654321),

('RD_692f17d1e7edb', 'US_692f0e453c9dd', 'VH_692f13de625f8',
 'Puchong IOI Mall', 3.043210, 101.618400,
 'APU Campus', 3.052100, 101.689200,
 '2025-11-02 09:15:00', 3, 12.50, 'Completed', '2025-10-27 10:20:00', 223344),

('RD_692f17d1e7edc', 'US_692f0e453c9dd', 'VH_692f13de625f8',
 'OUG Parklane', 3.066900, 101.658900,
 'Bukit Jalil LRT', 3.056700, 101.692200,
 '2025-11-03 07:45:00', 4, 6.80, 'Completed', '2025-10-28 08:15:00', 998877),

('RD_692f17d1e7edd', 'US_692f0e453c9dd', 'VH_692f13de625f8',
 'Cheras Leisure Mall', 3.084300, 101.742900,
 'APU Campus', 3.052000, 101.689000,
 '2025-11-04 08:00:00', 2, 14.30, 'Completed', '2025-10-29 09:00:00', 121212),

('RD_692f17d1e7ede', 'US_692f0e453c9dd', 'VH_692f13de625f8',
 'Kuchai Lama', 3.095500, 101.690300,
 'Sri Petaling', 3.068800, 101.689700,
 '2025-11-05 09:30:00', 3, 4.90, 'Completed', '2025-10-30 11:10:00', 343434),

('RD_692f17d1e7edf', 'US_692f0e453c9dd', 'VH_692f13de625f8',
 'KL Sentral', 3.134800, 101.686300,
 'APU Campus', 3.052100, 101.689200,
 '2025-11-06 08:20:00', 1, 17.80, 'Completed', '2025-11-01 13:00:00', 565656),

('RD_692f17d1e7ee0', 'US_692f0e453c9dd', 'VH_692f13de625f8',
 'Mid Valley Megamall', 3.118500, 101.677000,
 'Technology Park Malaysia', 3.049900, 101.702300,
 '2025-11-07 09:40:00', 3, 11.40, 'Incomplete', '2025-11-02 14:30:00', 787878),

('RD_692f17d1e7ee1', 'US_692f0e453c9dd', 'VH_692f13de62608',
 'Sunway Pyramid', 3.072200, 101.606900,
 'Bukit Jalil Stadium', 3.056300, 101.689500,
 '2025-11-08 10:00:00', 4, 15.60, 'Incomplete', '2025-11-03 09:45:00', 909090),

('RD_692f17d1e7ee2', 'US_692f0e453c9dd', 'VH_692f13de62608',
 'Taman Connaught', 3.074800, 101.739800,
 'APU Campus', 3.052100, 101.689200,
 '2025-11-09 07:55:00', 2, 13.20, 'Incomplete', '2025-11-04 12:40:00', 454545),

('RD_692f17d1e7ee3', 'US_692f0e453c9dd', 'VH_692f13de62608',
 'Bandar Kinrara 5', 3.038600, 101.635000,
 'Sri Petaling LRT', 3.074300, 101.690800,
 '2025-11-10 08:25:00', 3, 9.70, 'Incomplete', '2025-11-05 18:30:00', 112233),

('RD_692f17d1e7ee4', 'US_692f0e453c9dd', 'VH_692f13de62608',
 'Old Klang Road', 3.089200, 101.666600,
 'Bukit Jalil', 3.054300, 101.690200,
 '2025-11-11 09:05:00', 2, 7.40, 'Incomplete', '2025-11-06 10:00:00', 889900);



-- Points Log
INSERT INTO `points_log` (`point_id`, `ride_id`, `user_id`, `points_earned`, `log_at`) VALUES
('PO_692f1407c294e', 'RD_692f17d1e7ebd', 'US_692f0e82a7fb7', 20, '2025-10-31 10:05:00'),
('PO_692f1407c3bcb', 'RD_692f17d1e7eda', 'US_692f0ebbe9265', 15, '2025-11-01 08:35:00');



-- CO2 Log
INSERT INTO `co2_log` (`co2_id`, `ride_id`, `user_id`, `co2_saved`, `log_at`) VALUES
('CO_692f14271e3fe', 'RD_692f17d1e7ebd', 'US_692f0e82a7fb7', 1.50, '2025-10-31 10:05:00'),
('CO_692f14271e40f', 'RD_692f17d1e7eda', 'US_692f0ebbe9265', 2.20, '2025-11-01 08:35:00');



-- Ride Participants
INSERT INTO `ride_participants` (`participant_id`, `ride_id`, `user_id`, `joined_at`) VALUES
('RP_692f1451a6442', 'RD_692f17d1e7ebd', 'US_692f0e82a7fb7', '2025-10-31 09:50:00'),
('RP_692f1451a6452', 'RD_692f17d1e7ebd', 'US_692f0ebbe9265', '2025-10-31 09:52:00');




-- Requests
INSERT INTO `requests` (`request_id`, `ride_id`, `passenger_id`, `status`, `requested_at`) VALUES
('RQ_692f1479d6ca1', 'RD_692f17d1e7ebd', 'US_692f0e82a7fb7', 'approved', '2025-10-30 20:00:00'),
('RQ_692f1479d6cb3', 'RD_692f17d1e7ebd', 'US_692f0ebbe9265', 'approved', '2025-10-30 20:10:00'),
('RQ_692f1479d6cb4', 'RD_692f17d1e7eda', 'US_692f0ebbe9265', 'requested', '2025-10-31 14:00:00');



-- Ratings
INSERT INTO `ratings` (`rating_id`, `ride_id`, `rater_id`, `rated_id`, `score`, `created_at`) VALUES
('RT_692f14ac09ceb', 'RD_692f17d1e7ebd', 'US_692f0e82a7fb7', 'US_692f0e453c9dd', 5.0, '2025-10-31 12:00:00'),
('RT_692f14ac09f38', 'RD_692f17d1e7ebd', 'US_692f0ebbe9265', 'US_692f0e453c9dd', 4.5, '2025-10-31 12:10:00');



-- Reports
INSERT INTO `reports` (`report_id`, `ride_id`, `reporter_id`, `reported_user_id`, `description`, `status`, `created_at`) VALUES
('RE_692f14ebc30eb', 'RD_692f17d1e7eda', 'US_692f0ebbe9265', 'US_692f0e453c9dd', 'Driver was late', 'Pending', '2025-11-01 09:00:00'),
('RE_692f14ebc319e', 'RD_692f17d1e7ebd', 'US_692f0e82a7fb7', 'US_692f0ebbe9265', 'Passenger was rude', 'Approved', '2025-10-31 13:20:00');



-- Prizes
INSERT INTO `prizes` (`prize_id`, `prize_name`, `points_required`, `stock`, `prize_type`, `prize_image_url`) VALUES
('PR_697b15949d784', '1000 Points Badge', 1000, NULL, 'badge', 'prize_697b15949d4853.95895305.png'),
('PR_697b4ff4057fd', 'RM1000000 Discount Voucher', 2147483647, 100, 'voucher', 'prize_697b4ff40567d3.41427375.png'),
('PR_697b6b81745d9', '50% Discount Voucher for Shopee', 10000, 70, 'voucher', 'prize_697b6b81742a03.22407598.png'),
('PR_697b6bc54e9e0', 'RM50 Voucher', 500, 100, 'voucher', 'prize_697b6bc54e4de6.55837734.jpg'),
('PR_697b6c00e9710', 'RM50 Parkson Voucher', 500, 100, 'voucher', 'prize_697b6c00e93f03.66681002.png'),
('PR_697b6d8f6f294', 'User Loyalty Badge', 5000, NULL, 'badge', 'prize_697b6d8f6ef743.09108463.png'),
('PR_697b6dee89eef', 'Premium Badge', 10000, NULL, 'badge', 'prize_697b6dee89bdf0.71987875.png'),
('PR_697b723cbe3fd', 'Test Badge', 20, NULL, 'badge', 'prize_697b723cbe2539.67996142.png');



-- Redemption
INSERT INTO `redemption` (`redemption_id`, `prize_id`, `user_id`, `cost`, `redeemed_at`) VALUES
('RED697b6ed8dd4e0', 'PR_697b15949d784', 'US_692f0ebbe9265', 1000, '2026-01-29 15:29:44'),
('RED697b6edde98f0', 'PR_697b6c00e9710', 'US_692f0ebbe9265', 500, '2026-01-29 15:29:49'),
('RED697b6ee1ed030', 'PR_697b6b81745d9', 'US_692f0ebbe9265', 10000, '2026-01-29 15:29:53');

-- Eng Hong Xuan (Driver) redeeming a large merch item
('RED_692f2001b2222', 'PR_692f18730f012', 'US_692f0e453c9dd', 1500, '2025-12-10 18:45:15'),

-- Sho Jun Kai (Passenger) redeeming a Free Ride Pass
('RED_692f2001c3333', 'PR_692f18731a345', 'US_692f0ebbe9265', 800, '2025-12-15 12:20:00'),

-- Thum Zhi Jian (Driver) redeeming TnG Credit
('RED_692f2001d4444', 'PR_692f18731b678', 'US_692f0f042125d', 900, '2025-12-20 14:10:00'),

-- Leong Zi Heng (Admin) testing a redemption (Badge A)
('RED_692f2001e5555', 'PR_692f18730aefd', 'US_692f0f2dd3648', 100, '2025-12-22 10:05:00'),

-- Eng Hong Xuan (Driver) redeeming another voucher later
('RED_692f2001f6666', 'PR_692f18730d456', 'US_692f0e453c9dd', 350, '2026-01-02 08:00:00'),

-- Sho Jun Kai (Passenger) redeeming a T-Shirt
('RED_692f2001g7777', 'PR_692f18730e789', 'US_692f0ebbe9265', 1200, '2026-01-05 16:30:45'),

-- Tan Jian Shen (Passenger) redeeming Badge B
('RED_692f2001h8888', 'PR_692f18730b37e', 'US_692f0e82a7fb7', 150, '2026-01-10 11:15:20');



-- Driving License
INSERT INTO `driving_license` (`license_id`, `user_id`, `status`, `license_image_url`) VALUES
('DL_692f13c0e2812', 'US_692f0e453c9dd', 'Approved', 'license1.png'),
('DL_692f13c0e2822', 'US_692f0ebbe9265', 'Pending', 'license2.png');





SET FOREIGN_KEY_CHECKS = 1;";
// $sql = file_get_contents('carpooling_schema.sql');

if (mysqli_multi_query($conn,$sql)){
    echo "Tables created successfully";
} else {
    echo "Error when creating tables";
}

?>