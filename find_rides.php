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
</head>

<body>
    <!-- header -->
    <?php
    include("user_header.php");
    ?>

    <div id="welcome-section">

    </div>


    <!-- impact section  -->
    <div id="impact-section">

    </div>

    <!-- driver menu section -->
    <div id="driver-menu-section">
        <div id="container-3">
            <div id="hostedrides-container2" onclick="window.location.href='hosted_rides.php'" style="cursor: pointer;">
                <p>My Hosted rides</p>
            </div>
            <div id="findrides-container2" onclick="window.location.href='find_rides.php'" style="cursor: pointer;">
                <p>Find Rides</p>
            </div>
        </div>
    </div>


    <div id="find-ride-title">
        <h1>Find Rides</h1>
    </div>

    <!-- Search Section -->
    <div class="search-section">
        <div class="message-box" id="messageBox"></div>
        <div class="search-container">
            <input class="search-field field-1" id="originInputField" type="text" placeholder="From (e.g., Sri Petaling)">
            <input class="search-field" id="destinationInputField" type="text" placeholder="To (e.g.,Sunway University)">
            <div class="qr-room-code-row">
                <button class="start-scan-button" id="start-scan"">
                        <img class=" scanner-icon" src="assets/img/scan.png">
                </button>
                <button class="stop-scan-button" id="stop-scan" " style=" display:none;">
                    Stop scanning
                </button>
                <div>
                    <input placeholder="Enter roomcode to request" class="roomcode-search-field" type="text" id="roomCodeField">
                    <button class="roomcode-button" id="roomCodeSubmitButton">Request</button>
                </div>
            </div>

        </div>
    </div>

    <!-- QR scanner section -->
    <div class="scanner-container">
        <div id="qr-reader" style="width: 400px ;display:none;">

        </div>
    </div>

    <div id="scan-result"></div>

    <div id="availableRides">

    </div>

    <div class="show-more-section">
        <button class="show-more-button" id="showMoreBtn" hidden>
            Show more
        </button>
    </div>
    


    <div id="join-request-title">
        <h1>My Join Requests</h1>
    </div>

    <div id="requestedRides">
        <div id="join-request-container">
            <div id="join-ride-content">
                <h2>San Francisco → Los Angeles</h2>
                <div id="available-status">
                    <p>Pending</p>
                </div>
            </div>

            <div id="driver-info">
                <h3>Driver: John Smith</h3>
            </div>

            <div id="ride-status">
                <div id="time">
                    Nov 17, 2025, 11:46 PM
                </div>
            </div>

            <button id="cancel-request-button">
                Cancel Request
            </button>
        </div>

        <div id="request-accepted-container">
            <div id="join-ride-content">
                <h2>San Francisco → Los Angeles</h2>
                <div id="accepted-status">
                    <p>accepted</p>
                </div>
            </div>

            <div id="driver-info">
                <h3>Driver: John Smith</h3>
            </div>

            <div id="ride-status">
                <div id="time">
                    Nov 17, 2025, 11:46 PM
                </div>
            </div>

            <div id="request-accepted-notice">
                <div id="accepted-info">
                    <h3 id="green-bold">Request Accepted!</h3>
                    <p id="grey-color">Contact driver: +1234567890</p>
                </div>

                <button id="view-ride-details-button">
                    View Ride Details
                </button>
            </div>
        </div>
    </div>


    <?php
    include("user_navbar.html");
    ?>

    <script type="module" src="scripts/available_rides.js"></script>
    <script type="module" src="scripts/qr.js"></script>
</body>

</html>