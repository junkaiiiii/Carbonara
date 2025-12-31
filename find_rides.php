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
            <input class="search-field field-1" type="text" placeholder="From (e.g., Sri Petaling)">
            <input class="search-field" type="text" placeholder="To (e.g.,Sunway University)">
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

    <div id="request-to-join-container">
        <div id="join-ride-content">
            <h2>San Francisco → Los Angeles</h2>
            <div id="available-status">
                <p>Available</p>
            </div>
        </div>

        <div id="driver-info">
            <div id="left-section">
                <img id="driver-pic" src="assets/img/man.png" alt="">
                <div id="column">
                    <h3>John Smith</h3>
                    <p>⭐4.8</p>
                </div>
            </div>

            <div id="right-section">
                <button>
                    <img id="user-pic" src="assets/img/user.png" alt="">
                    View Profile
                </button>
            </div>
        </div>

        <div id="request-join-button-container">
            <div id="ride-status">
                <div id="time">
                    Nov 17, 2025, 11:46 PM
                </div>
                <div id="seatsavailable">
                    3 seats available
                </div>
            </div>
        </div>

        <button id="request-to-join-button">
            Request To Join
        </button>

    </div>

    <div id="request-to-join-container">
        <div id="join-ride-content">
            <h2>New York → Boston</h2>
            <div id="available-status">
                <p>Available</p>
            </div>
        </div>

        <div id="driver-info">
            <div id="left-section">
                <img id="driver-pic" src="assets/img/man.png" alt="">
                <div id="column">
                    <h3>Sarah Johnson</h3>
                    <p>⭐4.9</p>
                </div>
            </div>

            <div id="right-section">
                <button>
                    <img id="user-pic" src="assets/img/user.png" alt="">
                    View Profile
                </button>
            </div>
        </div>

        <div id="request-join-button-container">
            <div id="ride-status">
                <div id="time">
                    Nov 16, 2025, 11:46 PM
                </div>
                <div id="seatsavailable">
                    2 seats available
                </div>
            </div>
        </div>

        <button id="request-to-join-button">
            Request To Join
        </button>

    </div>

    <div id="request-to-join-container">
        <div id="join-ride-content">
            <h2>Seatle → Portland</h2>
            <div id="available-status">
                <p>Available</p>
            </div>
        </div>

        <div id="driver-info">
            <div id="left-section">
                <img id="driver-pic" src="assets/img/man.png" alt="">
                <div id="column">
                    <h3>John Smith</h3>
                    <p>⭐4.8</p>
                </div>
            </div>

            <div id="right-section">
                <button>
                    <img id="user-pic" src="assets/img/user.png" alt="">
                    View Profile
                </button>
            </div>
        </div>

        <div id="request-join-button-container">
            <div id="ride-status">
                <div id="time">
                    Nov 18, 2025, 11:46 PM
                </div>
                <div id="seatsavailable">
                    1 seats available
                </div>
            </div>
        </div>

        <button id="request-to-join-button">
            Request To Join
        </button>

    </div>

    <div id="request-to-join-container">
        <div id="join-ride-content">
            <h2>Chicago → Detroit</h2>
            <div id="available-status">
                <p>Available</p>
            </div>
        </div>

        <div id="driver-info">
            <div id="left-section">
                <img id="driver-pic" src="assets/img/man.png" alt="">
                <div id="column">
                    <h3>Mike Wilson</h3>
                    <p>⭐4.6</p>
                </div>
            </div>

            <div id="right-section">
                <button>
                    <img id="user-pic" src="assets/img/user.png" alt="">
                    View Profile
                </button>
            </div>
        </div>

        <div id="request-join-button-container">
            <div id="ride-status">
                <div id="time">
                    Nov 19, 2025, 11:46 PM
                </div>
                <div id="seatsavailable">
                    4 seats available
                </div>
            </div>
        </div>

        <button id="request-to-join-button">
            Request To Join
        </button>

    </div>

    <div id="join-request-title">
        <h1>My Join Requests</h1>
    </div>

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
    <script type="module" src="scripts/available_rides.js"></script>
    <script type="module" src="scripts/qr.js"></script>
</body>

</html>