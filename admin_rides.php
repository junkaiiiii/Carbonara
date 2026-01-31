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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
    <?php
    // include("user_header.php");
    include("admin_header.php");
    ?>

    <div class="rides-container">
        <div class="rides-nav">
            <button class="filter-btn active" data-filter="all">All Rides</button>
            <button class="filter-btn" data-filter="active">Active</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
            <button class="filter-btn" data-filter="cancelled">Cancelled</button>
        </div>
    </div>

    <script src="scripts/admin_rides.js"></script>
</body>
</html>