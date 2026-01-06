<div id="header-container">
    <div id="header">
        <div id="logo-container" onclick="window.location.href='profile.php'">
            <img id="logo" src="assets/img/carbonara-logo.png">
        </div>
        <div id="header-right-section">
            <div id="account-container" onclick="window.location.href='profile.php'" style="cursor: pointer;">
                <?php
                 if (!empty($_SESSION['user_id'])): ?>
                    <img class="profile-picture" src="assets/img/man.png">
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
    <div class="dropdown-item" onclick="window.location.href='profile.php'">View Profile</div>
    <div class="dropdown-item">Settings</div>
    <div class="dropdown-item">FAQ</div>
    <a href="landing_page.php">
        <div class="dropdown-item logout">Log Out</div>
    </a>
</div>