<?php
    session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rides</title>
    <link rel="stylesheet" href="styles/admin_style.css">
    <link rel="stylesheet" href="styles/admin_rides.css">
    <link rel="stylesheet" href="styles/admin_header.css"> 
</head>
<body>
    <?php
    include("admin_header.php");
    ?>

    <div class="rides-container">
        <div class="rides-nav">
            <button class="filter-btn active" data-filter="all">All Rides</button>
            <button class="filter-btn" data-filter="incomplete">Incomplete</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
            <button class="filter-btn" data-filter="cancelled">Cancelled</button>
        </div>

        <div class="rides-grid" id="ridesGrid">


        </div>
    </div>

    <script src="scripts/admin_rides.js"></script>
</body>
</html>