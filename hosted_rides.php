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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <script src="https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js"></script>

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

    <div id="requestedRidesTitle" class="hostedTitles">
        <h1 class="bolded-title">Pending Requests</h1>
    </div>

    <div id="requestedRidesSection">
    </div>

    <div id="hostedride-title" class="hostedTitles">
        <h1 class="bolded-title">My Hosted Rides</h1>
    </div>

    <div id="hosted-rides-section">
    </div>

    <div id="completedRidesTitle" class="hostedTitles">
        <h1 class="bolded-title">My Completed Rides</h1>
    </div>

    <div id="completedRidesSection">
    </div>



    <?php
    include("user_navbar.html");
    ?>

    <script src="scripts/driver_hosted.js" type="module"></script>
</body>

</html>