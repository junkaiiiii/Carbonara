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
    <div class="container">
        <div class="profile-title">
            <h1>My Profile</h1>
        </div>

        <div class="card user-info-card">
            <div class="profile-img-wrapper">
                <div class="profile-img-container" id="profile-display">
                    <img id="placeholder-svg"  width="40" height="40" src="assets/img/profile-default.svg">
                </div>
                <input type="file" id="image-input" accept="image/*" hidden>
                <label for="image-input" class="upload-icon">+</label>
            </div>

            <h1 class="user-name">User</h1>
            <span class="role-text">Passenger</span>

            <div class="rating">
                <div class="stars">☆☆☆☆☆</div>
                <span class="rating-score">0.0</span>
            </div>

            <div class="stats-grid">
                <div class="stat-box grey">
                    <div class="stat-title">
                        <img width="14" height="14" src="assets/img/car-profile.svg">
                        Total Rides
                    </div>
                    <div class="stat-value">0</div>
                </div>
                <div class="stat-box green">
                    <div class="stat-title">
                        <img width="14" height="14" src="assets/img/co2-profile.svg">
                        CO₂ Saved
                    </div>
                    <div class="stat-value">0.0 kg</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h2 class="card-title">Contact Information</h2>
            <div class="info-group">
                <span>Email</span>
                <div class="info-display">piza@gmail.com</div>
            </div>
            <div class="info-group">
                <span>Phone</span>
                <div class="info-display">example</div>
            </div>
        </div>

        <div class="card">
            <h2 class="card-title">Become a Driver</h2>
            <p class="card-desc">Upload your driving license to start hosting rides</p>
            <a href="#" class="primary-btn" id="upload-license-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                Upload Driving License
            </a>
        </div>
    </div>

    <button onclick="window.location.href='manage_vehicle.php'">Manage Vehicle</button>
    
    <script type="module" src="scripts/profile.js"></script>
</body>
</html>