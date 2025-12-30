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
    <div id="header-container">
        <div id="header">
            <div id="logo-container" onclick="window.location.href='profile.html'">
                <img id="logo" src="images/carbonara-logo.png">
            </div>
            <div id="header-right-section">
                <div id="account-container" onclick="window.location.href='profile.html'" style="cursor: pointer;">
                    <img class="profile-picture" src="images/man.png">
                    <div id="user-container">
                        <h2>Demo User</h2>
                        <p>driver@gmail.com</p>
                    </div>
                </div>
                <svg id="dropdown-trigger" class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline> 
                </svg>
            </div>
        </div>
    </div>

    <div id="profile-dropdown">
        <div class="dropdown-item" onclick="window.location.href='profile.html'">View Profile</div>
        <div class="dropdown-item">Settings</div>
        <div class="dropdown-item">FAQ</div>
        <div class="dropdown-item logout">Log Out</div>
    </div>

    <div id="title-and-points-container">
        <h2>Rewards</h2>
        <div id="points-container">
            <img class="small-icons" src="images/coin.png" alt="">
            <p class="green-font">7000 points</p>
        </div>
    </div>

    <div class="spaced-between-container">
        <div id="voucher-title-container">
            <div id="icon-container">
                <img class="small-icons" src="images/voucher.png" alt="">
            </div>

            <h3>Vouchers</h3>
        </div>

        <div id="rewards-filter-container">
                <img class="small-icons" src="images/filter.png" alt="">
        </div>
    </div>

    <div class="voucher-container">
        <img class="voucher-img-size" src="images/tng-pic.jpg" alt="">

        <div class="tng-voucher-content">
            <p>Touch 'n Go RM5 Voucher</p>

            <div class="group">
                <img class="small-icons" src="images/coin.png" alt="">
                <p class="green-font">5000 points</p>
            </div>
        </div>

        <button class="button">
                Redeem Voucher
        </button>
    </div>

    <div class="voucher-container">
        <img class="voucher-img-size" src="images/tng-pic.jpg" alt="">

        <div class="tng-voucher-content">
            <p>Touch 'n Go RM5 Voucher</p>

            <div class="group">
                <img class="small-icons" src="images/coin.png" alt="">
                <p class="green-font">5000 points</p>
            </div>
        </div>

        <button class="button">
                Redeem Voucher
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
                <img class="small-icons" src="images/voucher.png" alt="">
            </div>

            <h3>Badges</h3>
        </div>

        <div id="rewards-filter-container">
                <img class="small-icons" src="images/filter.png" alt="">
        </div>
    </div>

    <div class="badge-container">
        <div class="center">
            <img class="badge-img-size" src="images/badge1.png" alt="">
        </div>

        <div class="badge-content">
            <p>Bronze CO2 Reducer Badge</p>

            <div class="group">
                <img class="small-icons" src="images/coin.png" alt="">
                <p class="green-font">5000 points</p>
            </div>
        </div>

        <button class="button">
                Redeem Badge
        </button>
    </div>

    <div class="badge-container">
        <div class="center">
            <img class="badge-img-size" src="images/badge1.png" alt="">
        </div>

        <div class="badge-content">
            <p>Bronze CO2 Reducer Badge</p>

            <div class="group">
                <img class="small-icons" src="images/coin.png" alt="">
                <p class="green-font">5000 points</p>
            </div>
        </div>

        <button class="button">
                Redeem Badge
        </button>
    </div>

    

    <div class="center">
        <button class="load-more-button">
            Load more
        </button>
    </div>

    <div class="margin">
        <!-- empty space -->
    </div>

    <?php 
        include("user_navbar.html");
    ?>

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
</body>
</html>