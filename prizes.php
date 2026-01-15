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
        <h2>Rewards</h2>
        <div id="points-container">
            <img class="small-icons" src="assets/img/coin.png" alt="">
            <p  id="point" class="green-font">7000 points</p>
        </div>
    </div>

    <div class="spaced-between-container">
        <div id="voucher-title-container">
            <div id="icon-container">
                <img class="small-icons" src="assets/img/voucher.png" alt="">
            </div>

            <h3>Vouchers</h3>
        </div>


    </div>

    <!-- VOUCHER SECTION -->
    <div class="voucher-section" id="voucherSection">
        <div class="voucher-container">
            <img class="voucher-img-size" src="assets/img/tng-pic.jpg" alt="">

            <div class="tng-voucher-content">
                <p>Touch 'n Go RM5 Voucher</p>

                <div class="group">
                    <img class="small-icons" src="assets/img/coin.png" alt="">
                    <p class="green-font">5000 points</p>
                </div>
            </div>

            <button class="button">
                Redeem Voucher
            </button>
        </div>

        <div class="voucher-container">
            <img class="voucher-img-size" src="assets/img/tng-pic.jpg" alt="">

            <div class="tng-voucher-content">
                <p>Touch 'n Go RM5 Voucher</p>

                <div class="group">
                    <img class="small-icons" src="assets/img/coin.png" alt="">
                    <p class="green-font">5000 points</p>
                </div>
            </div>

            <button class="button">
                Redeem Voucher
            </button>
        </div>

    </div>

    <div class="center" id="loadVoucherBtn" hidden>
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


    </div>


    <div class="badge-section" id="badgeSection">

    </div>

    <div class="center">
        <button class="load-more-button" id="loadBadgeBtn">
            Load more
        </button>
    </div>

    <div class="margin">
        <!-- empty space -->
    </div>

    <?php
    include("user_navbar.html");
    ?>


    <script type="module" src="scripts/rewards.js"></script>
</body>

</html>