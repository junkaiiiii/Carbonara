<?php session_start() ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="styles/driver.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/profile.css">
    <!-- <link rel="stylesheet" href="styles/admin_style.css"> -->

</head>
<body>
    <?php 
    if ($_SESSION['role'] === 'Admin')
        include("admin_header.php");
    else{
        include("user_header.php");
    }
        
     ?>

    <?php 
        if ($_SESSION['role'] !== 'Admin'){
            include("user_navbar.html");
        }

    ?>
    <?php
        include "db_connect.php";
        $user_id = $_SESSION['user_id'];
        $sql = "SELECT username, email, role, phone, profile_picture_url, 
        (SELECT AVG(score) FROM ratings WHERE rated_id = '$user_id') as rating_score, 
        (SELECT SUM(co2_saved) FROM co2_log WHERE user_id = '$user_id') as co2_saved, 
        (SELECT COUNT(ride_id) FROM rides WHERE driver_id = '$user_id' AND ride_status = 'Completed') as total_rides 
        FROM users 
        WHERE user_id = '$user_id' LIMIT 1";

        $result = mysqli_query($conn, $sql);
        if ($row = mysqli_fetch_assoc($result)) {
            $username = $row['username'];
            $email = $row['email'];
            $role = $row['role'];
            $phone = $row['phone'];
            $profile_picture_url = $row['profile_picture_url'];
            $rating_score = $row['rating_score'] ?? 0.0;
            $co2_saved = $row['co2_saved'] ?? 0.0;
            $total_rides = $row['total_rides'] ?? 0;
        }
    ?>

    <div class="container">
        <div class="profile-title">
            <h1>My Profile</h1>
        </div>

        <div class="card user-info-card">
            <div class="profile-img-wrapper">
                <div class="profile-img-container" id="profile-display">
                    <?php if (!empty($profile_picture_url)): ?>
                        <img id="profile-img-real" src="<?php echo $profile_picture_url; ?>" width="100%" style="border-radius: 50%; height: 100%; object-fit: cover;">
                    <?php else: ?>
                        <img id="placeholder-svg" width="40" height="40" src="assets/img/profile-default.svg">
                    <?php endif; ?>
                </div>

                <input type="file" id="image-input" accept="image/*" hidden>
                <label for="image-input" class="upload-icon">+</label>
            </div>

            <h1 class="user-name"><?php echo $username ?></h1>
            <span class="role-text"><?php echo $role ?></span>

            <div class="rating">
                <div class="stars">☆</div>
                <span class="rating-score"><?php echo number_format($rating_score, 1) ?></span>
            </div>

            <div class="stats-grid">
                <div class="stat-box grey">
                    <div class="stat-title">
                        <img width="14" height="14" src="assets/img/car-profile.svg">
                        Total Rides
                    </div>
                    <div class="stat-value"><?php echo $total_rides ?></div>
                </div>
                <div class="stat-box green">
                    <div class="stat-title">
                        <img width="14" height="14" src="assets/img/co2-profile.svg">
                        CO₂ Saved
                    </div>
                    <div class="stat-value"><?php echo number_format($co2_saved, 1) ?> kg</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h2 class="card-title">Contact Information</h2>
            <div class="info-group">
                <span>Email</span>
                <div class="info-display"><?php echo $email ?></div>
            </div>
            <div class="info-group">
                <span>Phone</span>
                <div class="info-display"><?php echo $phone ?></div>
            </div>
        </div>

        <?php
        $status = "None"; // Default license status
        $license_img = "";

        $sql = "SELECT status, license_image_url FROM driving_license WHERE user_id = '$user_id' LIMIT 1";
        $result = mysqli_query($conn, $sql);

        if ($row = mysqli_fetch_assoc($result)) {
            $status = $row['status']; // 'Pending', 'Approved', or 'Rejected'
            $license_img = $row['license_image_url'];
        }
        ?>

        <div class="card">

            <h2 class="card-title" id="card-title">
                <?php 
                    if($status == 'Pending') echo "Under Review";
                    elseif($status == 'Approved') echo "License Approved";
                    elseif($status == 'Rejected') echo "License Rejected";
                    else echo "Become a Driver";
                ?>
            </h2>

            <p class="card-desc" id="card-desc">
                <?php 
                    if($status == 'Pending') echo "Your license is being reviewed by our admins.";
                    elseif($status == 'Approved') echo "Congratulations! You can now host rides.";
                    elseif($status == 'Rejected') echo "Your previous upload was rejected. Please try again.";
                    else echo "Upload your driving license to start hosting rides";
                ?>
            </p>

            <?php if ($status == "None" || $status == "Rejected"): ?>
                                                <!--hide it-->
                <div id="license-preview-container" style="display: none; margin-bottom: 15px;">
                    <img id="license-img" src="" alt="License Preview" style="width: 100%; border-radius: 8px; border: 1px solid #ddd;">
                </div>

                <input type="file" id="license-file-input" accept="image/*" hidden>
                <label for="license-file-input" class="primary-btn" id="upload-license-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <span id="btn-text">Upload Driving License</span>
                </label>

                <button id="submit-license" style="display:none;" class="primary-btn">Submit for Approval</button>

            <?php elseif ($status == "Approved"): ?>

                <div id="license-preview-container" style="margin-bottom: 15px;">
                    <img id="license-img" src="<?php echo $license_img; ?>" alt="Approved License" style="width: 100%;">
                </div>

            <?php elseif ($status == "Pending"): ?>
                
                <div id="license-preview-container" style="margin-bottom: 15px;">
                    <img id="license-img" src="<?php echo $license_img; ?>" alt="Pending License" style="width: 100%;">
                </div>

            <?php endif; ?>

        </div>

        <button class="button" onclick="window.location.href='manage_vehicle.php'">Manage Vehicle</button>
    </div>
    
    <script type="module" src="scripts/profile.js"></script>
</body>
</html>