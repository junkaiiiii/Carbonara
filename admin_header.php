<div id="header-container">
    <div id="header">
        <div id="logo-container" onclick="window.location.href='profile.php'">
            <img id="logo" src="assets/img/carbonara-logo.png">
        </div>
        <div class="admin-dashboard desktop-nav" id="admin-dashboard">
            <ul class="choices">
                <li><a href="./admin_overview.php">Overview</a></li>
                <li><a href="./admin_rides.php">Rides</a></li>
                <li><a href="./admin_users.php">Users</a></li>
                <li><a href="./admin_license.php">Licenses</a></li>
                <li><a href="./admin_reports.php">Reports</a></li>
                <li><a href="./admin_prizes.php">Prizes</a></li>
            </ul>   
        </div>        
        <div id="header-right-section">
            <div id="account-container" onclick="window.location.href='profile.php'" style="cursor: pointer;">
                <?php
                 if (!empty($_SESSION['user_id'])): ?>
                    <img class="profile-picture" src="<?php echo $_SESSION['profile_picture_url'];?>">
                    <div id="user-container">
                        <h2><?= htmlspecialchars($_SESSION['username']) ?></h2>
                        <p><?= htmlspecialchars($_SESSION['email']) ?></p>
                    </div>
                <?php endif; ?>
            </div>

            <svg id="dropdown-trigger" class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </div>
    </div>
</div>



<div id="profile-dropdown">
    <div class="mobile-nav">
        <div class="dropdown-item" onclick="window.location.href='./admin_overview.php'">Overview</div>
        <div class="dropdown-item" onclick="window.location.href='./admin_rides.php'">Rides</div>
        <div class="dropdown-item" onclick="window.location.href='./admin_users.php'">Users</div>
        <div class="dropdown-item" onclick="window.location.href='./admin_license.php'">Licenses</div>
        <div class="dropdown-item" onclick="window.location.href='./admin_reports.php'">Reports</div>
        <div class="dropdown-item" onclick="window.location.href='./admin_prizes.php'">Prizes</div>
    </div>
    <div class="dropdown-item" onclick="window.location.href='profile.php'">View Profile</div>
    <div class="dropdown-item">Settings</div>
    <div class="dropdown-item">FAQ</div>
    <a href="landing_page.php" style="text-decoration:none;">
        <div class="dropdown-item logout">Log Out</div>
    </a>
</div>

<script src="scripts/header.js"></script>
<script>
    const navLinks = document.querySelectorAll(".choices a");

    let currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href'); //get href value
        
        if (linkPage === `./${currentPage}`){
            link.classList.add('active');
        }
    })  
</script>