<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RideGreen Carbonara</title>
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/driver.css">
    <link rel="stylesheet" href="styles/leaderboard.css">

</head>
<body>
    <?php include("user_header.html") ?>

    <!-- Leaderboard Intro -->
    <div class="intro-section">
        <img class="leaf-logo" src="assets/img/leaf.png">
        <h1>
        CO₂ Saving Leaderboard
        </h1>
        <p>Celebrating our community's environmental impact</p>
    </div>

    <!-- Total Co2 Stats -->
    <div class="stats-section">
        <div class="kg-stat">
        <h1 id="co2-kg">1849.0kg</h1>
        </div>
        <p>Total CO₂ saved by our community</p>
    </div>

    <!-- Top 3 User Cards -->
    <div class="top-3-leaderboard" id="top3Leaderboard"></div></div>

    <!-- User Cards -->
    <div class="leaderboard-section" id="leaderboard"></div> 

    <!-- Explanation -->
    <div class="explanation-section">
    <p class="explanation-title">How CO₂ savings are calculated</p>
    <p class="explanation-desc">Every shared ride reduces the number of vehicles on the road. We calculate CO₂ savings based in average vehicle emissions (0.187kg CO₂ per km) multiplied by the distance saved through carpooling. Keep sharing rides to climb the leaderboard and help our planet!</p>
    </div>

   <script src="scripts/leaderboard.js"></script>
</body>
</html>