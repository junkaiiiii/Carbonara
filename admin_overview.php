<?php
    session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Overview</title>
    <link rel="stylesheet" href="styles/admin_style.css">
    <link rel="stylesheet" href="styles/admin_overview.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
    <?php
    include("user_header.php");
    include("admin_header.html");
    ?>

    <div class="overview-container">
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <h3>Total Users</h3>
                    <img class="stat-icon" src="assets/img/users-icon.png" alt="Users">
                </div>
                <div class="stat-value" id="totalUsers">0</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <h3>Total Rides</h3>
                    <img class="stat-icon" src="assets/img/car-icon.png" alt="Car">
                </div>
                <div class="stat-value" id="totalRides">0</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <h3>Active Rides</h3>
                    <img class="stat-icon" src="assets/img/active-icon.png" alt="Active">
                </div>
                <div class="stat-value" id="activeRides">0</div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <h3>Pending Requests</h3>
                    <img class="stat-icon" src="assets/img/pending-icon.png" alt="Pending">
                </div>
                <div class="stat-value" id="pendingRequests">0</div>
            </div>
        </div>
    </div>

    <script src="scripts/admin_overview.js"></script>
</body>
</html>