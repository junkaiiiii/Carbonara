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
            <p class="green-font">Loading points</p>
        </div>
    </div>

    <div class="spaced-between-container">
        <div id="voucher-title-container">
            <div id="icon-container">
                <img class="small-icons" src="assets/img/voucher.png" alt="">
            </div>

            <h3>My Vouchers</h3>
        </div>
    </div>

    <div id="voucher-list"></div>

    <div class="center">
        <button id="loadVoucherBtn" class="load-more-button">Load more</button>
    </div>

    <div class="spaced-between-container">
        <div id="voucher-title-container">
            <div id="icon-container">
                <img class="small-icons" src="assets/img/badge1.png" alt="">
            </div>

            <h3>Badges</h3>
        </div>
    </div>

    <div id="badge-list"></div>

    <div class="center">
        <button id="loadBadgeBtn" class="load-more-button">Load more</button>
    </div>

    <?php 
        include("user_navbar.html");
    ?>

    <div class="margin">
        <!-- empty space -->
    </div>

    <div class="overlay" id="overlay"></div>

    <div class="badge-popup" id="badge_Popup">
        <div class="popup-container">
            <h2 class="hugee">Badge</h2>
            <div class="badge-preview">
                <img class="badge-popup-img" src="assets/img/badge1.png" alt="">
                <div class="shine"></div>
            </div>
            <h2 id="obtained_on" class="green-font">Obtained on:</h2> 
            <button class="grey popup-button" onclick="closeBadge()">Close</button>
        </div>
    </div>

    <div class="voucher-popup" id="voucher_Popup">
        <div class="popup-container">
            <h2 class="hugee">Voucher</h2>
            <h2>Scan the below QR code to redeem</h2>
            <div class="voucher-preview">
                <img id="voucher_qr_img" class="badge-popup-img" src="" alt="QR Code">
                <div class="shine"></div>
            </div>
                <h2 id="redemption_id"></h2>
            <button class="grey popup-button" onclick="closeVoucher()">Close</button>
        </div>
    </div>

    <script type="module" src="scripts/inventory.js"></script>

    <script>

        function openBadge(img, title, redeemed_date){

            document.querySelector('.badge-popup-img').src = `assets/img/${img}`;
            document.querySelector('.hugee').innerText= title;
            document.getElementById('obtained_on').innerText = "Obtained on: " + redeemed_date;


            document.getElementById('overlay').classList.add('show');
            document.getElementById('badge_Popup').classList.add('show');
        }

        function closeBadge(){
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('badge_Popup').classList.remove('show');
        }

        function openVoucher(title, redemption_id){
            document.querySelector('.hugee').innerText= title;
            document.getElementById('redemption_id').innerText = "Redemption ID: " + redemption_id;

            let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${redemption_id}`;
            document.getElementById('voucher_qr_img').src = qrUrl;

            document.getElementById('overlay').classList.add('show');
            document.getElementById('voucher_Popup').classList.add('show');
        }

        function closeVoucher(){
            document.getElementById('overlay').classList.remove('show');
            document.getElementById('voucher_Popup').classList.remove('show');
        }

    </script>
</body>
</html>