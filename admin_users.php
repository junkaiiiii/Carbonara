<?php

    include("admin_header.html");

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Users</title>
    <linK rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/admin_users.css">    
</head>
<body>
    <!-- HELLOWWW -->
    <!-- Navigation Section -->
    <!-- <nav class="nav">
        <div class="navBar">
            <div class="logo-container">
                <img class="logo-img" src="./images/PLUS ULTRA.jpg">
                <a class="logo">CarboNara Admin</a>            
            </div>
            <div class="user-info">
                <div class="user-details">
                    <div class="nav-pfp"><img class="pfp-img" src="./images/stableRonaldo.avif" alt="ronaldo"></div>
                    <div class="user-name">
                        <h4 class="user-username">Demo User</h4>
                        <p class="user-email">admin@gmail.com</p>
                    </div>
                </div>
                <div class="logout"><img class="logout-img" src="./images/logout.png"></div>
            </div>
        </div>
    </nav> -->

    <!-- Admin Dashboard -->
    <!-- <section class="admin-dashboard">
        <div class="admin-container">
            <h1>Admin Dashboard</h1>
            <p>Manage rides, users, and review driving license</p>
        </div>


        <ul class="choices">
            <li><a href="">Overview</a></li>
            <li><a href="">Rides</a></li>
            <li><a href="">Users</a></li>
            <li><a href="">Licenses</a></li>
        </ul>
    </section>
    <hr> -->
    <!-- Search Bar -->

    <div class="search-bar">
        <div class="search-icon"><img src="./images/adc.jpg"></div>
        <div class="search-placeholder">
            <input id="search-text" placeholder="Search by name, email, or role...">
        </div>
    </div>

    <!-- User Card -->
    <div class="user-grid">
        <!-- <div class="user-card">
            <div class="user-info">
                <div class="card-pfp"><img class="pfp-card-img" src="./images/PLUS ULTRA.jpg"></div>
                <div class="card-name">
                    <h3 class="card-username">Demo User</h3>
                    <p class="card-rating">4.8</p>
                    <p class="card-date">Joined Nov 10, 2025</p>
                </div>
                <div class="card-role">
                    <p>driver</p>
                </div>
            </div>
            <div class="user-stats">
                <div class="user-stats-container">
                    <p>CO₂ Saved</p>
                    <h3>145.5kg</h3>
                </div>
                <div class="user-stats-container">
                    <p>Total Rides</p>
                    <h3>42</h3>                    
                </div>
            </div>
            <div class="user-contacts-container">
                <div class="user-contacts">
                    <p>demo@gmail.com</p>
                    <p>+6016-384-8160</p>
                </div>
                <a href="">View Profile</a>            
            </div>
        </div>
        <div class="user-card">
            <div class="user-info">
                <div class="card-pfp"></div>
                <div class="card-name">
                    <div class="card-username">Demo User</div>
                    <div class="card-rating">4.8</div>
                    <div class="card-date"></div>
                </div>
                <div class="card-role"></div>
            </div>
            <div class="user-stats">
                <div class="co2-saved"></div>
                <div class="total-rides"></div>
            </div>
            <div class="user-contacts"></div>
        </div>
        <div class="user-card">
            <div class="user-info">
                <div class="card-pfp"></div>
                <div class="card-name">
                    <div class="card-username">Demo User</div>
                    <div class="card-rating">4.8</div>
                    <div class="card-date"></div>
                </div>
                <div class="card-role"></div>
            </div>
            <div class="user-stats">
                <div class="co2-saved"></div>
                <div class="total-rides"></div>
            </div>
            <div class="user-contacts"></div>
        </div> -->
    </div>

    <script src="scripts/admin_users.js"></script>
</body>

</html>