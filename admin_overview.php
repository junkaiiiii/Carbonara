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
        <!-- Quick Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card total-users-card">
                <div class="stat-icon-wrapper">
                    <img class="stat-icon" src="assets/img/total-users.png" alt="Users">
                </div>
                <div class="stat-content">
                    <p class="stat-label">Total Users</p>
                    <h2 class="stat-value" id="totalUsers">0</h2>
                </div>
            </div>

            <div class="stat-card total-rides-card">
                <div class="stat-icon-wrapper">
                    <img class="stat-icon" src="assets/img/total-rides.png" alt="Car">
                </div>
                <div class="stat-content">
                    <p class="stat-label">Total Rides</p>
                    <h2 class="stat-value" id="totalRides">0</h2>
                </div>
            </div>

            <div class="stat-card pending-licenses-card">
                <div class="stat-icon-wrapper">
                    <img class="stat-icon" src="assets/img/pending-licenses.png" alt="Pending-licenses">
                </div>
                <div class="stat-content">
                    <p class="stat-label">Total CO2</p>
                    <h2 class="stat-value" id="totalCo2">0</h2>
                </div>
            </div>

            <div class="stat-card pending-reports-card">
                <div class="stat-icon-wrapper">
                    <img class="stat-icon" src="assets/img/pending-reports.png" alt="Pending-reports">
                </div>
                <div class="stat-content">
                    <p class="stat-label">Pending Reports</p>
                    <h2 class="stat-value" id="pendingReports">0</h2>
                </div>
            </div>
        </div>

        <div class="info-grid">
            <!-- Recent Activities Section-->
            <div class="info-card activity-card">
                <div class="card-header">
                    <h3>Recent Activities</h3>
                </div>
                <div class="activity-list" id="activityList">
                    <div class="activity-item">
                        <div class="activity-content">
                            <p class="activity-title">New user registered</p>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-content">
                            <p class="activity-title">New ride posted</p>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-content">
                            <p class="activity-title">License approved</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions Section-->
            <div class="info-card actions-card">
                <div class="card-header">
                    <h3>Quick Actions</h3>
                </div>
                <div class="quick-actions">
                    <a href="admin_users.php" class="action-btn action-users">
                        <img class="action-icon" src="assets/img/total-users.png" alt="Users">
                        <span>Manage Users</span>
                    </a>
                    <a href="admin_rides.php" class="action-btn action-rides">
                        <img class="action-icon" src="assets/img/total-rides.png" alt="Rides">
                        <span>View Rides</span>
                    </a>
                    <a href="admin_license.php" class="action-btn action-licenses">
                        <img class="action-icon" src="assets/img/pending-licenses.png" alt="Licenses">
                        <span>Review Licenses</span>
                    </a>
                    <a href="admin_reports.php" class="action-btn action-reports">
                        <img class="action-icon" src="assets/img/pending-reports.png" alt="Reports">
                        <span>Check Reports</span>
                    </a>
                </div>
            </div>

            <!-- User Breakdown Section-->
            <div class="info-card stats-breakdown-card">
                <div class="card-header">
                    <h3>User Breakdown</h3>
                </div>
                <div class="breakdown-list">
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span>Admins</span>
                        </div>
                        <span class="breakdown-value" id="adminCount">0</span>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span>Drivers</span>
                        </div>
                        <span class="breakdown-value" id="driverCount">0</span>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span>Passengers</span>
                        </div>
                        <span class="breakdown-value" id="passengerCount">0</span>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span>Banned Users</span>
                        </div>
                        <span class="breakdown-value" id="bannedCount">0</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="scripts/admin_overview.js"></script>
</body>
</html>