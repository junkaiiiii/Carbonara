<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="styles/driver.css">
    <link rel="stylesheet" href="styles/style.css">

<body>
    <!-- header -->
    <?php
    include("user_header.php");
    ?>

    <div id="profile-dropdown">
        <div class="dropdown-item" onclick="window.location.href='profile.html'">View Profile</div>
        <div class="dropdown-item">Settings</div>
        <div class="dropdown-item">FAQ</div>
        <div class="dropdown-item logout">Log Out</div>
    </div>

    <!-- welcome section -->
    <div id="welcome-section">

    </div>


    <!-- impact section  -->
    <div id="impact-section">

    </div>

    <!-- driver menu section -->
    <div id="driver-menu-section">

    </div>

    <div id="hostedride-title">
        <h1 class="bolded-title">My Hosted Rides</h1>
    </div>

    <div id="hosted-rides-section">
        
        <div id="container-4">
            <div id="hosted-rides-destination">
                <h2 class="content-font">Seatle → Portland</h2>
                <div id="right-section">
                    <button class="buttons">
                        <img src="assets/img/view.png" alt="">
                    </button>
                    <button class="buttons">
                        <img src="assets/img/delete.png" alt="">
                    </button>
                </div>
            </div>
            <div id="status">
                <p id="statusbox">active</p>
            </div>
            <div id="ride-status">
                <div id="time">
                    Nov 18, 2025, 11:46 PM
                </div>
                <div id="seatsavailable">
                    1 seats available
                </div>
            </div>
        </div>
    </div>


    <?php
    include("user_navbar.html");
    ?>

    <script>
        const dropdownTrigger = document.getElementById('dropdown-trigger');
        const profileDropdown = document.getElementById('profile-dropdown');

        dropdownTrigger.addEventListener('click', function(event) {
            event.stopPropagation();
            profileDropdown.classList.toggle('active');
        });

        document.addEventListener('click', function(event) {
            if (!profileDropdown.contains(event.target)) {
                profileDropdown.classList.remove('active');
            }
        });
    </script>
    <script src="scripts/driver_hosted.js" type="module"></script>
</body>

</html>