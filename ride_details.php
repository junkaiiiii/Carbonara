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
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
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

    </div>

    <div class="passengers-section" id="passengersSection">

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

    </div>


    <?php include("user_navbar.html") ?>

    <!-- Add Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="https://unpkg.com/leaflet@latest/dist/leaflet.js"></script>
    <!-- Skins for map-->
    <script src="https://unpkg.com/leaflet-providers@latest/leaflet-providers.js"></script>
    <script type="module" src="scripts/ride_details.js"></script>

</body>

</html>