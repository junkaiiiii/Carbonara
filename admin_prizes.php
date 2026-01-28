<?php session_start() ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="styles/admin_style.css">
    <link rel="stylesheet" href="styles/admin_prizes.css"> 
    <link rel="stylesheet" href="styles/admin_header.css"> 
    <!-- <link rel="stylesheet" href="styles/style.css">    -->
</head>
<body>
    <?php
    // include("user_header.php");
    include("admin_header.php");
    ?>
    <div class="prizes-nav">
        <!-- <ul> -->
        <a href="#vouchers">Vouchers</a>
        <a href="#badges">Badges</a>
        <!-- </ul> -->
    </div>
    <div class="spaced-between-container">
        <div id="voucher-title-container">
            <div id="icon-container">
                <img class="small-icons" src="assets/img/voucher.png" alt="">
            </div>

            <h3 id="vouchers">Vouchers</h3>
            <button class="button" id="addVoucherBtn">Add Voucher</button>
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

        </div>

    </div>    

    <!-- BADGE SECTION -->
    <div class="spaced-between-container">
        <div id="voucher-title-container">
            <div id="icon-container">
                <img class="small-icons" src="assets/img/voucher.png" alt="">
            </div>

            <h3 id="badges">Badges</h3>
            <button class="button" id="addBadgeBtn">Add Badge</button>
        </div>


    </div>


    <div class="badge-section" id="badgeSection">

    </div>
    <script src="scripts/admin_prizes.js"></script>
</body>


</html>