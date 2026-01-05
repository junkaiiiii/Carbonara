<?php session_start(); ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="styles/driver.css">
    <link rel="stylesheet" href="styles/prizes.css">
    <link rel="stylesheet" href="styles/style.css">
</head>
<body>
    <?php include("user_header.php"); ?>

    <div id="title-and-points-container">
        <h2>Inventory</h2>
        <div id="points-container">
            <img class="small-icons" src="assets/img/coin.png" alt="">
            <p class="green-font">7000 points</p>
        </div>
    </div>

    <div class="spaced-between-container">
        <div id="voucher-title-container">
            <div id="icon-container">
                <img class="small-icons" src="assets/img/voucher.png" alt="">
            </div>

            <h3>My Vouchers</h3>
        </div>

        <div id="rewards-filter-container">
                <img class="small-icons" src="assets/img/filter.png" alt="">
        </div>
    </div>

    <div class="voucher-container">
        <img class="voucher-img-size" src="assets/img/tng-pic.jpg" alt="">

        <div class="tng-voucher-content">
            <div class="spaced-between">
                <p>Touch 'n Go RM5 Voucher</p>
                <P id="active" class="active-status">Active</P>
            </div>

            <div class="group">
                <p class="green-font">Redeemed on 24/12/2025</p>
            </div>
        </div>

        <button class="button">
                Reveal Code
        </button>
    </div>

    <div class="voucher-container">
        <img class="voucher-img-size" src="assets/img/tng-pic.jpg" alt="">

        <div class="tng-voucher-content">
            <div class="spaced-between">
                <p>Touch 'n Go RM5 Voucher</p>
                <P id="expired" class="active-status">Expired</P>
            </div>

            <div class="group">
                <p class="green-font">Redeemed on 17/12/2025</p>
            </div>
        </div>

        <button class="button">
                Reveal Code
        </button>
    </div>

    <div class="voucher-container">
        <img class="voucher-img-size" src="assets/img/tng-pic.jpg" alt="">

        <div class="tng-voucher-content">
            <div class="spaced-between">
                <p>Touch 'n Go RM5 Voucher</p>
                <P id="used" class="active-status">Used</P>
            </div>

            <div class="group">
                <p class="green-font">Used on 9/12/2025</p>
            </div>
        </div>

        <button class="grey-button">
                XXXX-XXXX-XXXX-XXXX
        </button>
    </div>

    <div class="center">
        <button class="load-more-button">
            Load more
        </button>
    </div>

    <div class="spaced-between-container">
        <div id="voucher-title-container">
            <div id="icon-container">
                <img class="small-icons" src="assets/img/voucher.png" alt="">
            </div>

            <h3>Badges</h3>
        </div>

        <div id="rewards-filter-container">
                <img class="small-icons" src="assets/img/filter.png" alt="">
        </div>
    </div>

    <div class="badge-container">
        <div class="center">
            <img class="badge-img-size" src="assets/img/badge1.png" alt="">
        </div>

        <div class="badge-content">
            <p>Bronze CO2 Reducer Badge</p>

            <div class="group">
                <p class="green-font">Obtained on 22/11/2025</p>
            </div>
        </div>

        <button class="button">
            View Badge
        </button>
    </div>

    <div class="badge-container">
        <div class="center">
            <img class="badge-img-size" src="assets/img/badge1.png" alt="">
        </div>

        <div class="badge-content">
            <p>Bronze CO2 Reducer Badge</p>

            <div class="group">
                <p class="green-font">Obtained on 20/11/2025</p>
            </div>
        </div>

        <button class="button">
                View Badge
        </button>
    </div>
    
    <?php 
        include("user_navbar.html");
    ?>

    <div class="center">
        <button class="load-more-button">
            Load more
        </button>
    </div>

    <div class="margin">
        <!-- empty space -->
    </div>

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
    <script type="module" src="scripts/inventory.js"></script>
</body>
</html>