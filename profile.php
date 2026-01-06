<?php session_start() ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="styles/driver.css">
    <link rel="stylesheet" href="styles/style.css">
</head>
<body>
    <?php include("user_header.html"); ?>

    <?php 
        include("user_navbar.html");
    ?>
    
    <script type="module" src="scripts/profile.js"></script>
</body>
</html>