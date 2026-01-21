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
            <div class="stat-card users-card">
                <div class="stat-icon-wrapper">
                    <img class="stat-icon" src="assets/img/total-users.png" alt="Users">
                </div>
                <div class="stat-content">
                    <p class="stat-label">Total Users</p>
                    <h2 class="stat-value" id="totalUsers">0</h2>
                    <div class="stat-trend">
                        <span class="trend-indicator positive">
                            <i class="fa-solid fa-arrow-up"></i> 12%
                        </span>
                        <span class="trend-text">from last month</span>
                    </div>
                </div>
            </div>

            <div class="stat-card rides-card">
                <div class="stat-icon-wrapper">
                    <img class="stat-icon" src="assets/img/total-rides.png" alt="Car">
                </div>
                <div class="stat-content">
                    <p class="stat-label">Total Rides</p>
                    <h2 class="stat-value" id="totalRides">0</h2>
                    <div class="stat-trend">
                        <span class="trend-indicator positive">
                            <i class="fa-solid fa-arrow-up"></i> 8%
                        </span>
                        <span class="trend-text">from last month</span>
                    </div>
                </div>
            </div>

            <div class="stat-card active-card">
                <div class="stat-icon-wrapper">
                    <img class="stat-icon" src="assets/img/active-rides.png" alt="Active">
                </div>
                <div class="stat-content">
                    <p class="stat-label">Active Rides</p>
                    <h2 class="stat-value" id="activeRides">0</h2>
                    <div class="stat-trend">
                        <span class="trend-text">Currently ongoing</span>
                    </div>
                </div>
            </div>

            <div class="stat-card pending-card">
                <div class="stat-icon-wrapper">
                    <img class="stat-icon" src="assets/img/pending-requests.png" alt="Pending">
                </div>
                <div class="stat-content">
                    <p class="stat-label">Pending Requests</p>
                    <h2 class="stat-value" id="pendingRequests">0</h2>
                    <div class="stat-trend">
                        <span class="trend-text">Needs review</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Additional Info Section -->
        <div class="info-grid">
            <!-- Recent Activity -->
            <div class="info-card activity-card">
                <div class="card-header">
                    <h3>Recent Activity</h3>
                    <button class="btn-view-all">View All</button>
                </div>
                <div class="activity-list" id="activityList">
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fa-solid fa-user-plus"></i>
                        </div>
                        <div class="activity-content">
                            <p class="activity-title">New user registered</p>
                            <p class="activity-time">2 minutes ago</p>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fa-solid fa-car"></i>
                        </div>
                        <div class="activity-content">
                            <p class="activity-title">New ride posted</p>
                            <p class="activity-time">15 minutes ago</p>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fa-solid fa-id-card"></i>
                        </div>
                        <div class="activity-content">
                            <p class="activity-title">License approved</p>
                            <p class="activity-time">1 hour ago</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="info-card actions-card">
                <div class="card-header">
                    <h3>Quick Actions</h3>
                </div>
                <div class="quick-actions">
                    <a href="admin_users.php" class="action-btn">
                        <i class="fa-solid fa-users"></i>
                        <span>Manage Users</span>
                    </a>
                    <a href="admin_rides.php" class="action-btn">
                        <i class="fa-solid fa-car"></i>
                        <span>View Rides</span>
                    </a>
                    <a href="admin_license.php" class="action-btn">
                        <i class="fa-solid fa-id-card"></i>
                        <span>Review Licenses</span>
                    </a>
                    <a href="admin_reports.php" class="action-btn">
                        <i class="fa-solid fa-flag"></i>
                        <span>Check Reports</span>
                    </a>
                </div>
            </div>

            <!-- System Stats -->
            <div class="info-card stats-breakdown-card">
                <div class="card-header">
                    <h3>User Breakdown</h3>
                </div>
                <div class="breakdown-list">
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="color-dot driver"></span>
                            <span>Drivers</span>
                        </div>
                        <span class="breakdown-value" id="driverCount">0</span>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="color-dot passenger"></span>
                            <span>Passengers</span>
                        </div>
                        <span class="breakdown-value" id="passengerCount">0</span>
                    </div>
                    <div class="breakdown-item">
                        <div class="breakdown-label">
                            <span class="color-dot banned"></span>
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