-- Carpooling System Schema (Custom String IDs)
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
);

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
);

CREATE TABLE prizes (
    prize_id VARCHAR(20) PRIMARY KEY,
    prize_name VARCHAR(5),
    points_required INT,
    stock INT,
    prize_image_url VARCHAR(17)
) ;

CREATE TABLE points_log (
    point_id VARCHAR(20) PRIMARY KEY,
    ride_id VARCHAR(20),
    user_id VARCHAR(20),
    points_earned INT,
    log_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE co2_log (
    co2_id VARCHAR(20) PRIMARY KEY,
    ride_id VARCHAR(20),
    user_id VARCHAR(20),
    co2_saved DECIMAL(10,2),
    log_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE ride_participants (
    participant_id VARCHAR(20) PRIMARY KEY,
    ride_id VARCHAR(20),
    user_id VARCHAR(20),
    joined_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE requests (
    request_id VARCHAR(20) PRIMARY KEY,
    ride_id VARCHAR(20),
    passenger_id VARCHAR(20),
    status ENUM('requested','approved','rejected','cancelled'),
    requested_at DATETIME,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (passenger_id) REFERENCES users(user_id)
);

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
);

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
);

CREATE TABLE redemption (
    redemption_id VARCHAR(20) PRIMARY KEY,
    prize_id VARCHAR(20),
    user_id VARCHAR(20),
    cost INT,
    redeemed_at DATETIME,
    FOREIGN KEY (prize_id) REFERENCES prizes(prize_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE driving_license (
    license_id VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(20),
    status ENUM('Pending','Approved','Rejected'),
    license_url VARCHAR(20),
    license_image_url VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE vehicles (
    vehicle_id VARCHAR(20) PRIMARY KEY,
    driver_id VARCHAR(20),
    car_plate_number VARCHAR(8),
    color VARCHAR(30),
    type VARCHAR(20),
    registered_at DATETIME,
    FOREIGN KEY (driver_id) REFERENCES users(user_id)
) ;