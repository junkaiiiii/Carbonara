<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="styles/driver.css">
<body>
    <!-- header -->
    <?php 
    include("user_header.html");
    ?>

    <div id="profile-dropdown">
        <div class="dropdown-item" onclick="window.location.href='profile.html'">View Profile</div>
        <div class="dropdown-item">Settings</div>
        <div class="dropdown-item">FAQ</div>
        <div class="dropdown-item logout">Log Out</div>
    </div>

    <div id="welcome-container">
        <div id="content">
            <h2 class="bolded-title">Welcome back, Driver!</h2>
            <p class="grey-content">Host rides or find rides to join</p>
        </div>
        <img src="images/car.png" alt="" id="car-absolute">
        <div id="button-container">
            <button id="createRide-button">
                Create New Ride
            </button>
        </div>
    </div>

    <div id="impact-container">
        <div id="content">
            <div id="title">
                <h2>Enviromental Impact</h2>
            </div>
            <div>
                <p>Co2 saved through carpooling</p>
                <h1 id="stats">145.5kg CO<sup>2</sup></h1>
            </div>
            <div id="leaderboard-container">
                <button id="leaderboard-button">
                    View leaderboard
                </button>
            </div>
        </div>
     </div>

     <div id="container-3">
        <div id="hostedrides-container" onclick="window.location.href='hosted_rides.php'" style="cursor: pointer;">
            <p>My Hosted rides</p>
        </div>
        <div id="findrides-container" onclick="window.location.href='find_rides.php'" style="cursor: pointer;">
            <p>Find Rides</p>
        </div>
     </div>

    <div id="hostedride-title">
        <h1 class="bolded-title">My Hosted Rides</h1>
    </div>

    <div id="container-4">
        <div id="hosted-rides-destination">
            <h2 class="content-font">San Fransico → Los Angeles</h2>
            <div id="right-section">
                <button class="buttons">
                    <img src="images/view.png" alt="" onclick="window.location.href='ride_details.html'">
                </button>
                <button class="buttons">
                    <img src="images/delete.png" alt="">
                </button>
            </div>
        </div>
        <div id="status">
            <p id="statusbox">active</p>
            <p id="pendingbox">1 pending request</p>
        </div>
        <div id="ride-status">
            <div id="time">
                Nov 17, 2025, 11:46 PM
            </div>
            <div id="seatsavailable">
                3 seats available
            </div>
        </div>

        <hr>

        <div>
            <h4>Pending Requests: </h4>
        </div>
        <div>
            <div id="userbox">
                <div id="top-row">
                    <div id="left-section">
                        <img class="passenger-profile-picture" id="profilePic-2" src="images/man.png">
                        <div id="user-info">
                            <h3>Emily Brown</h3>
                            <p>⭐4.7</p>
                        </div>
                    </div>
                    
                    <div id="right-section">
                        <button>
                            <img class="content-icons" id="user-pic" src="images/user.png" alt="">
                            View Profile
                        </button>
                    </div>
                </div>
    
                <div id="buttons-container">
                    <button id="accept-btn">Accept</button>
                    <button id="reject-btn">Reject</button>
                </div>
            </div>

            <div id="userbox">
                <div id="top-row">
                    <div id="left-section">
                        <img class="passenger-profile-picture" id="profilePic-2" src="images/man.png">
                        <div id="user-info">
                            <h3>
                                Emily Brown
                            </h3>
                            <p>
                                ⭐4.7
                            </p>
                        </div>
                    </div>
                    
                    <div id="right-section">
                        <button>
                            <img class="content-icons" id="user-pic" src="images/user.png" alt="">
                            View Profile
                        </button>
                    </div>
                </div>
        
                <div id="buttons-container">
                    <button id="accept-btn">Accept</button>
                    <button id="reject-btn">Reject</button>
                </div>
            </div>
        </div>
    </div>

    <div id="container-4">
        <div id="hosted-rides-destination">
            <h2 class="content-font">Seatle → Portland</h2>
            <div id="right-section">
                <button class="buttons">
                    <img src="images/view.png" alt="">
                </button>
                <button class="buttons">
                    <img src="images/delete.png" alt="">
                </button>
            </div>
        </div>
        <div id="status">
            <p id="statusbox">active</p>
        </div>
        <div id="ride-status">
            <div id="time">
                Nov 18, 2025, 11:46 PM
            </div>
            <div id="seatsavailable">
                1 seats available
            </div>
        </div>
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
    <script src="scripts/driver_hosted.js" type="module"></script>
</body>
</html> 