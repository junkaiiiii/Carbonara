<?php session_start() ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="styles/driver.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>

<body>
    <div id="header-container">
        <div id="view-ride-header">
            <div class="button-container">
                <img src="assets/img/left-arrow.png" alt="" onclick="history.go(-1)">
            </div>
            <div id="header-details">
                <h3>Ride Details</h3>
                <p>Rides you joined</p>
            </div>
        </div>
    </div>

    <div class="route-section" id="routeSection">
    </div>

    <div class="driver-section" id="driverSection">
        <div id="driver-container">
            <div id="driver-header">
                <h2 class="bolded-title">Driver</h2>
            </div>

            <div id="driver-content">
                <div id="driver-info">
                    <div id="left-section">
                        <img class="driver-profile-picture" src="assets/img/man.png" alt="">
                        <div id="column">
                            <h3>Demo User</h3>
                            <p>⭐ 4.8 | 42 rides</p>
                            <div id="phone-number-row">
                                <img class="content-icons" src="assets/img/telephone.png" alt="">
                                <p>+1234567890</p>
                            </div>
                        </div>
                    </div>

                    <div id="right-section">
                        <button>
                            <img class="content-icons" id="user-pic" src="assets/img/user.png" alt="">
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="passengers-section" id="passengersSection">
        <div id="seats-container">
            <div id="seats-header">
                <img class="icons" src="assets/img/participants.png" alt="">
                <h3>Seats</h3>
            </div>
            <h4>1 seat available</h4>
            <p>3 passenger confirmed</p>

            <hr>

            <h3>List of Passengers</h3>
            <div id="passengersList">
                <div id="passenger-container">
                    <div id="left-section">
                        <img class="passenger-profile-picture" src="assets/img/man.png" alt="">
                        <div id="column">
                            <h3>Passenger 1</h3>
                            <p>⭐ 4.8</p>
                            <div id="phone-number-row">
                                <img class="content-icons" src="assets/img/telephone.png" alt="">
                                <p>+1234567890</p>
                            </div>
                        </div>
                    </div>

                    <div id="right-section">
                        <button>
                            <img class="content-icons" id="user-pic" src="assets/img/user.png" alt="">
                            View Profile
                        </button>
                    </div>
                </div>

                <div id="passenger-container">
                    <div id="left-section">
                        <img class="passenger-profile-picture" src="assets/img/man.png" alt="">
                        <div id="column">
                            <h3>Passenger 2</h3>
                            <p>⭐ 4.8</p>
                            <div id="phone-number-row">
                                <img class="content-icons" src="assets/img/telephone.png" alt="">
                                <p>+1234567890</p>
                            </div>
                        </div>
                    </div>

                    <div id="right-section">
                        <button>
                            <img class="content-icons" id="user-pic" src="assets/img/user.png" alt="">
                            View Profile
                        </button>
                    </div>
                </div>

                <div id="passenger-container">
                    <div id="left-section">
                        <img class="passenger-profile-picture" src="assets/img/man.png" alt="">
                        <div id="column">
                            <h3>Passenger 3</h3>
                            <p>⭐ 4.8</p>
                            <div id="phone-number-row">
                                <img class="content-icons" src="assets/img/telephone.png" alt="">
                                <p>+1234567890</p>
                            </div>
                        </div>
                    </div>

                    <div id="right-section">
                        <button>
                            <img class="content-icons" id="user-pic" src="assets/img/user.png" alt="">
                            View Profile
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>


    <!-- <div id="ride-impact-container">
        <div id="content">
            <div id="title">
                <h2>Enviromental Impact</h2>
            </div>
            <div id="content">
                <h1>145.5kg CO<sup>2</sup></h1>
                <p>Estimated savings for this trip</p>
            </div>
        </div>
     </div> -->

    <div id="impactSection">
        <div id="impact-container">
            <div id="content">
                <div id="title">
                    <h2>Enviromental Impact</h2>
                </div>
                <div id="content">
                    <h1>145.5kg CO<sup>2</sup></h1>
                    <p>Estimated savings for this trip</p>
                </div>
            </div>
        </div>
    </div>


    <?php include("user_navbar.html") ?>

    <script type="module" src="scripts/ride_details.js"></script>
</body>

</html>