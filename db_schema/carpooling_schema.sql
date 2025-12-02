
--
-- Table structure for table `co2_log`
--

CREATE TABLE `co2_log` (
  `co2_id` varchar(20) NOT NULL,
  `ride_id` varchar(20) DEFAULT NULL,
  `user_id` varchar(20) DEFAULT NULL,
  `co2_saved` decimal(10,2) DEFAULT NULL,
  `distance_km` decimal(10,2) DEFAULT NULL,
  `log_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `co2_log`
--

INSERT INTO `co2_log` (`co2_id`, `ride_id`, `user_id`, `co2_saved`, `distance_km`, `log_at`) VALUES
('CO_692f14271e3fe', 'RD_101', 'US_692f0e82a7fb7', 1.50, 5.10, '2025-10-31 10:05:00'),
('CO_692f14271e40f', 'RD_102', 'US_692f0ebbe9265', 2.20, 10.20, '2025-11-01 08:35:00');

-- --------------------------------------------------------

--
-- Table structure for table `driving_license`
--

CREATE TABLE `driving_license` (
  `license_id` varchar(20) NOT NULL,
  `user_id` varchar(20) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT NULL,
  `license_image_url` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `driving_license`
--

INSERT INTO `driving_license` (`license_id`, `user_id`, `status`, `license_image_url`) VALUES
('DL_692f13c0e2812', 'US_692f0e453c9dd', 'Approved', 'license1.png'),
('DL_692f13c0e2822', 'US_692f0ebbe9265', 'Pending', 'license2.png');

-- --------------------------------------------------------

--
-- Table structure for table `points_log`
--

CREATE TABLE `points_log` (
  `point_id` varchar(20) NOT NULL,
  `ride_id` varchar(20) DEFAULT NULL,
  `user_id` varchar(20) DEFAULT NULL,
  `points_earned` int(11) DEFAULT NULL,
  `log_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `points_log`
--

INSERT INTO `points_log` (`point_id`, `ride_id`, `user_id`, `points_earned`, `log_at`) VALUES
('PO_692f1407c294e', 'RD_101', 'US_692f0e82a7fb7', 20, '2025-10-31 10:05:00'),
('PO_692f1407c3bcb', 'RD_102', 'US_692f0ebbe9265', 15, '2025-11-01 08:35:00');

-- --------------------------------------------------------

--
-- Table structure for table `prizes`
--

CREATE TABLE `prizes` (
  `prize_id` varchar(20) NOT NULL,
  `prize_name` varchar(50) DEFAULT NULL,
  `points_required` int(11) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `prize_image_url` varchar(17) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prizes`
--

INSERT INTO `prizes` (`prize_id`, `prize_name`, `points_required`, `stock`, `prize_image_url`) VALUES
('PR_001', 'BadgeA', 100, 50, 'badgeA.png'),
('PR_002', 'BadgeB', 150, 40, 'badgeB.png');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `rating_id` varchar(20) NOT NULL,
  `ride_id` varchar(20) DEFAULT NULL,
  `rater_id` varchar(20) DEFAULT NULL,
  `rated_id` varchar(20) DEFAULT NULL,
  `score` decimal(3,1) DEFAULT NULL,
  `description` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`rating_id`, `ride_id`, `rater_id`, `rated_id`, `score`, `description`, `created_at`) VALUES
('RT_692f14ac09ceb', 'RD_101', 'US_692f0e82a7fb7', 'US_692f0e453c9dd', 5.0, 'Driver was nice', '2025-10-31 12:00:00'),
('RT_692f14ac09f38', 'RD_101', 'US_692f0ebbe9265', 'US_692f0e453c9dd', 4.5, 'Smooth ride', '2025-10-31 12:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `redemption`
--

CREATE TABLE `redemption` (
  `redemption_id` varchar(20) NOT NULL,
  `prize_id` varchar(20) DEFAULT NULL,
  `user_id` varchar(20) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL,
  `redeemed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `redemption`
--

INSERT INTO `redemption` (`redemption_id`, `prize_id`, `user_id`, `cost`, `redeemed_at`) VALUES
('RED_692f135fd2663', 'PR_001', 'US_692f0e82a7fb7', 100, '2025-11-10 14:00:00'),
('RED_692f135fd2dcc', 'PR_002', 'US_692f0ebbe9265', 150, '2025-11-12 16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` varchar(20) NOT NULL,
  `ride_id` varchar(20) DEFAULT NULL,
  `reporter_id` varchar(20) DEFAULT NULL,
  `reported_user_id` varchar(20) DEFAULT NULL,
  `description` varchar(30) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`report_id`, `ride_id`, `reporter_id`, `reported_user_id`, `description`, `status`, `created_at`) VALUES
('RE_692f14ebc30eb', 'RD_102', 'US_692f0ebbe9265', 'US_692f0e453c9dd', 'Driver was late', 'Pending', '2025-11-01 09:00:00'),
('RE_692f14ebc319e', 'RD_101', 'US_692f0e82a7fb7', 'US_692f0ebbe9265', 'Passenger was rude', 'Approved', '2025-10-31 13:20:00');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `request_id` varchar(20) NOT NULL,
  `ride_id` varchar(20) DEFAULT NULL,
  `passenger_id` varchar(20) DEFAULT NULL,
  `status` enum('requested','approved','rejected','cancelled') DEFAULT NULL,
  `requested_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`request_id`, `ride_id`, `passenger_id`, `status`, `requested_at`) VALUES
('RQ_692f1479d6ca1', 'RD_101', 'US_692f0e82a7fb7', 'approved', '2025-10-30 20:00:00'),
('RQ_692f1479d6cb3', 'RD_101', 'US_692f0ebbe9265', 'approved', '2025-10-30 20:10:00'),
('RQ_692f1479d6cb4', 'RD_102', 'US_692f0ebbe9265', 'requested', '2025-10-31 14:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `rides`
--

CREATE TABLE `rides` (
  `ride_id` varchar(20) NOT NULL,
  `driver_id` varchar(20) DEFAULT NULL,
  `origin_text` varchar(100) DEFAULT NULL,
  `origin_lat` decimal(10,6) DEFAULT NULL,
  `origin_lon` decimal(10,6) DEFAULT NULL,
  `destination_text` varchar(100) DEFAULT NULL,
  `destination_lat` decimal(10,6) DEFAULT NULL,
  `destination_lon` decimal(10,6) DEFAULT NULL,
  `route_geojson` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`route_geojson`)),
  `departure_datetime` datetime DEFAULT NULL,
  `available_seats` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `room_code` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rides`
--

INSERT INTO `rides` (`ride_id`, `driver_id`, `origin_text`, `origin_lat`, `origin_lon`, `destination_text`, `destination_lat`, `destination_lon`, `route_geojson`, `departure_datetime`, `available_seats`, `created_at`, `room_code`) VALUES
('RD_101', 'US_692f0e453c9dd', 'Sri Petaling', 3.068810, 101.689710, 'Asia Pacific University', 3.042300, 101.688800, '{ \"0\": [101.68971, 3.06881], \"1\": [101.6888, 3.0423] }', '2025-10-31 10:05:00', 3, '2025-10-25 09:00:00', 123456),
('RD_102', 'US_692f0e453c9dd', 'Bukit Jalil', 3.054300, 101.690200, 'APU Campus', 3.052000, 101.689000, '{ \"0\": [101.6902, 3.0543], \"1\": [101.689, 3.052] }', '2025-11-01 08:30:00', 2, '2025-10-26 11:00:00', 654321),
('RD_103', 'US_692f0e453c9dd', 'Puchong IOI Mall', 3.043210, 101.618400, 'APU Campus', 3.052100, 101.689200, '{ \"0\": [101.6184, 3.04321], \"1\": [101.6892, 3.0521] }', '2025-11-02 09:15:00', 3, '2025-10-27 10:20:00', 223344),
('RD_104', 'US_692f0e453c9dd', 'OUG Parklane', 3.066900, 101.658900, 'Bukit Jalil LRT', 3.056700, 101.692200, '{ \"0\": [101.6589, 3.0669], \"1\": [101.6922, 3.0567] }', '2025-11-03 07:45:00', 4, '2025-10-28 08:15:00', 998877),
('RD_105', 'US_692f0e453c9dd', 'Cheras Leisure Mall', 3.084300, 101.742900, 'APU Campus', 3.052000, 101.689000, '{ \"0\": [101.7429, 3.0843], \"1\": [101.689, 3.052] }', '2025-11-04 08:00:00', 2, '2025-10-29 09:00:00', 121212),
('RD_106', 'US_692f0e453c9dd', 'Kuchai Lama', 3.095500, 101.690300, 'Sri Petaling', 3.068800, 101.689700, '{ \"0\": [101.6903, 3.0955], \"1\": [101.6897, 3.0688] }', '2025-11-05 09:30:00', 3, '2025-10-30 11:10:00', 343434),
('RD_107', 'US_692f0e453c9dd', 'KL Sentral', 3.134800, 101.686300, 'APU Campus', 3.052100, 101.689200, '{ \"0\": [101.6863, 3.1348], \"1\": [101.6892, 3.0521] }', '2025-11-06 08:20:00', 1, '2025-11-01 13:00:00', 565656),
('RD_108', 'US_692f0e453c9dd', 'Mid Valley Megamall', 3.118500, 101.677000, 'Technology Park Malaysia', 3.049900, 101.702300, '{ \"0\": [101.6770, 3.1185], \"1\": [101.7023, 3.0499] }', '2025-11-07 09:40:00', 3, '2025-11-02 14:30:00', 787878),
('RD_109', 'US_692f0e453c9dd', 'Sunway Pyramid', 3.072200, 101.606900, 'Bukit Jalil Stadium', 3.056300, 101.689500, '{ \"0\": [101.6069, 3.0722], \"1\": [101.6895, 3.0563] }', '2025-11-08 10:00:00', 4, '2025-11-03 09:45:00', 909090),
('RD_110', 'US_692f0e453c9dd', 'Taman Connaught', 3.074800, 101.739800, 'APU Campus', 3.052100, 101.689200, '{ \"0\": [101.7398, 3.0748], \"1\": [101.6892, 3.0521] }', '2025-11-09 07:55:00', 2, '2025-11-04 12:40:00', 454545),
('RD_111', 'US_692f0e453c9dd', 'Bandar Kinrara 5', 3.038600, 101.635000, 'Sri Petaling LRT', 3.074300, 101.690800, '{ \"0\": [101.6350, 3.0386], \"1\": [101.6908, 3.0743] }', '2025-11-10 08:25:00', 3, '2025-11-05 18:30:00', 112233),
('RD_112', 'US_692f0e453c9dd', 'Old Klang Road', 3.089200, 101.666600, 'Bukit Jalil', 3.054300, 101.690200, '{ \"0\": [101.6666, 3.0892], \"1\": [101.6902, 3.0543] }', '2025-11-11 09:05:00', 2, '2025-11-06 10:00:00', 889900);

-- --------------------------------------------------------

--
-- Table structure for table `ride_participants`
--

CREATE TABLE `ride_participants` (
  `participant_id` varchar(20) NOT NULL,
  `ride_id` varchar(20) DEFAULT NULL,
  `user_id` varchar(20) DEFAULT NULL,
  `joined_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ride_participants`
--

INSERT INTO `ride_participants` (`participant_id`, `ride_id`, `user_id`, `joined_at`) VALUES
('RP_692f1451a6442', 'RD_101', 'US_692f0e82a7fb7', '2025-10-31 09:50:00'),
('RP_692f1451a6452', 'RD_101', 'US_692f0ebbe9265', '2025-10-31 09:52:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(20) NOT NULL,
  `full_name` varchar(30) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `email` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('Driver','Passenger','Admin') DEFAULT NULL,
  `status` enum('Active','Banned') DEFAULT 'Active',
  `phone` varchar(15) DEFAULT NULL,
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `username`, `email`, `password_hash`, `role`, `status`, `phone`, `profile_picture_url`, `created_at`) VALUES
('US_692f0e453c9dd', 'Eng Hong Xuan', 'enghongxuan', 'eng@example.com', '$2y$10$NCF.XdYUNhz8tmiTVPQ.EuFsS82VuPpYiN90VeKQv4xj2jMl9cA5i', 'Driver', 'Active', '012345678', NULL, '2025-09-30 17:05:25'),
('US_692f0e82a7fb7', 'Tan Jian Shen', 'tanjianshen', 'tan@example.com', '$2y$10$jqw4A6f/PoQ07vgxeFmlz.RUXLvIBkRJ6DH5z9JYFhwjqWMQZ1cMy', 'Passenger', 'Active', '012456783', NULL, '2025-08-01 17:06:26'),
('US_692f0ebbe9265', 'Sho Jun Kai', 'shojunkai', 'sho@example.com', '$2y$10$4B3rHqqhmrzEURuFHC9ZW.6z.jeXS7eAJxw2SIAp/OMZCB3DlW8fK', 'Passenger', 'Active', '0134445567', NULL, '2025-08-01 17:07:24'),
('US_692f0f042125d', 'Thum Zhi Jian', 'thumzijian', 'thum@example.com', '$2y$10$m9Um9JgPOkGb.1ErBKkAn.JmSZRKQ.Iijl4j3nHsn4psFice7RL1C', 'Driver', 'Active', '0145678999', NULL, '2025-09-05 17:08:36'),
('US_692f0f2dd3648', 'Leong Zi Heng', 'leongziheng', 'leong@example.com', '$2y$10$ninwsFSLga6vHnBAbTJrkeHaYkBvSluuo35mHdJ84EEzkgruJjbdS', 'Admin', 'Active', '0126673456', NULL, '2025-09-03 17:09:17');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicle_id` varchar(20) NOT NULL,
  `driver_id` varchar(20) DEFAULT NULL,
  `car_plate_number` varchar(8) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `registered_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`vehicle_id`, `driver_id`, `car_plate_number`, `color`, `type`, `registered_at`) VALUES
('VH_692f13de625f8', 'US_692f0e453c9dd', 'SJK732', 'Blue', 'Sedan', '2025-12-30 09:10:00'),
('VH_692f13de62608', 'US_692f0e453c9dd', 'WXY123', 'Red', 'SUV', '2025-12-15 17:20:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `co2_log`
--
ALTER TABLE `co2_log`
  ADD PRIMARY KEY (`co2_id`),
  ADD KEY `ride_id` (`ride_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `driving_license`
--
ALTER TABLE `driving_license`
  ADD PRIMARY KEY (`license_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `points_log`
--
ALTER TABLE `points_log`
  ADD PRIMARY KEY (`point_id`),
  ADD KEY `ride_id` (`ride_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `prizes`
--
ALTER TABLE `prizes`
  ADD PRIMARY KEY (`prize_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`rating_id`),
  ADD KEY `ride_id` (`ride_id`),
  ADD KEY `rater_id` (`rater_id`),
  ADD KEY `rated_id` (`rated_id`);

--
-- Indexes for table `redemption`
--
ALTER TABLE `redemption`
  ADD PRIMARY KEY (`redemption_id`),
  ADD KEY `prize_id` (`prize_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `ride_id` (`ride_id`),
  ADD KEY `reporter_id` (`reporter_id`),
  ADD KEY `reported_user_id` (`reported_user_id`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `ride_id` (`ride_id`),
  ADD KEY `passenger_id` (`passenger_id`);

--
-- Indexes for table `rides`
--
ALTER TABLE `rides`
  ADD PRIMARY KEY (`ride_id`),
  ADD UNIQUE KEY `room_code` (`room_code`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Indexes for table `ride_participants`
--
ALTER TABLE `ride_participants`
  ADD PRIMARY KEY (`participant_id`),
  ADD KEY `ride_id` (`ride_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicle_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `co2_log`
--
ALTER TABLE `co2_log`
  ADD CONSTRAINT `co2_log_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`ride_id`),
  ADD CONSTRAINT `co2_log_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `driving_license`
--
ALTER TABLE `driving_license`
  ADD CONSTRAINT `driving_license_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `points_log`
--
ALTER TABLE `points_log`
  ADD CONSTRAINT `points_log_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`ride_id`),
  ADD CONSTRAINT `points_log_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`ride_id`),
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`rater_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `ratings_ibfk_3` FOREIGN KEY (`rated_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `redemption`
--
ALTER TABLE `redemption`
  ADD CONSTRAINT `redemption_ibfk_1` FOREIGN KEY (`prize_id`) REFERENCES `prizes` (`prize_id`),
  ADD CONSTRAINT `redemption_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`ride_id`),
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `reports_ibfk_3` FOREIGN KEY (`reported_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`ride_id`),
  ADD CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`passenger_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `rides`
--
ALTER TABLE `rides`
  ADD CONSTRAINT `rides_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `ride_participants`
--
ALTER TABLE `ride_participants`
  ADD CONSTRAINT `ride_participants_ibfk_1` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`ride_id`),
  ADD CONSTRAINT `ride_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `users` (`user_id`);
COMMIT;

