

// create html components
const createAvailableRideCard = (ride, onRequest, onCloseDriverPopUp, onHighlightStars) => {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="ride-card" id="ride-${ride.ride_id}">
            <div class="ride-card-row-1">
                <p class="locations semi-bold">${ride.origin_text} &#8594 ${ride.destination_text}</p>
                <div class="ride-status grey-text">
                    Available
                </div>
            </div>
            <div class="ride-card-row-2">
                <div class="driver-details">
                    <img class="driver-pfp" src="assets/img/leaf.png">
                    <div>
                        <p>${ride.driver.name || "Unknown Driver"}</p>
                        <p class="grey-text">★ </p>
                    </div>
                </div>
                
                <div class="view-button-container">
                    <button class="view-profile-button" id="viewProfileButton">
                        <img class="user-logo" src="assets/img/user.svg">
                         View Profile
                    </button>
                </div>
            </div>
            <div class="ride-card-row-3 grey-text">
                <img class="clock-logo" src="assets/img/clock.svg">
                <p>${ride.departure_datetime}</p>
            </div>

            <div class="ride-card-row-4 grey-text">
                <img class="users-logo" src="assets/img/users.svg">
                <p>${ride.available_seats} seat available</p>
            </div>
 
            <button class="request-ride-button"">
                Request to Join
            </button>
        </div>
    `
    // remember to add this ${ride.driver.average_rating}

    const el = div.firstElementChild;

    // attach event listener here instead of onclick=""
    el.querySelector(".request-ride-button").addEventListener("click", () => onRequest(ride.ride_id));


    const viewProfileButton = el.querySelector(".view-profile-button");

    viewProfileButton.addEventListener("click", () => {
        const popUp = createDriverPopUp(ride.driver, onCloseDriverPopUp, onHighlightStars);

        document.body.appendChild(popUp);

    });

    return div.firstElementChild;
}

const createRequestedRideCard = (ride, onCancel) => {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="ride-card" id="ride-${ride.ride_id}">
        <div class="ride-card-row-1">
            <p class="locations semi-bold">${ride.origin_text} &#8594 ${ride.destination_text}</p>
            <div class="ride-status grey-text">
                Requested
            </div>
        </div>
        <div class="ride-card-row-2">
            <div class="driver-details">
                <img class="driver-pfp" src="assets/img/leaf.png">
                <div>
                    <p>${ride.driver.name}</p>
                    <p class="grey-text">★ ${ride.driver.average_rating}</p>
                </div>
            </div>
            
            <div class="view-button-container">
                <button class="view-profile-button">
                    <img class="user-logo" src="assets/img/user.svg">
                        View Profile
                </button>
            </div>
        </div>
        <div class="ride-card-row-3 grey-text">
            <img class="clock-logo" src="assets/img/clock.svg">
            <p>${ride.departure_datetime}</p>
        </div>
        
        <button class="cancel-request-button">
            &#10006; Cancel Request
        </button>
    </div>
    `

    const el = div.firstElementChild;
    el.querySelector('.cancel-request-button').addEventListener('click', () => onCancel(ride.ride_id));

    return div.firstElementChild;
}

// joined ride card
const createJoinedRideCard = (ride, onViewRideDetails) => {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="ride-card" id="ride-${ride.ride_id}">
            <div class="ride-card-row-1">
                <p class="locations semi-bold">${ride.origin_text} &#8594 ${ride.destination_text}</p>
                <div class="ride-status grey-text">
                    Requested
                </div>
            </div>
            <div class="ride-card-row-2">
                <div class="driver-details">
                    <img class="driver-pfp" src="assets/img/leaf.png">
                    <div>
                        <p>${ride.driver.name}</p>
                        <p class="grey-text">★ ${ride.driver.average_rating}</p>
                    </div>
                </div>
                
                <div class="view-button-container">
                    <button class="view-profile-button">
                        <img class="user-logo" src="assets/img/user.svg">
                            View Profile
                    </button>
                </div>
            </div>
            <div class="ride-card-row-3 grey-text">
                <img class="clock-logo" src="assets/img/clock.svg">
                <p>${ride.departure_datetime}</p>
            </div>
            
            <div class="accepted-info-container">
                <p class="bold">Request Accepted!</p>
                <p class="grey-text">Contact driver: +1234565789</p>
                <button id='viewRideDetailsButton'>View Ride Details</button>
            </div>
        </div>
    `

    const el = div.firstElementChild;
    el.querySelector('#viewRideDetailsButton').addEventListener('click', () => {
        onViewRideDetails()
    });

    return div.firstElementChild;

}

const createHostedRideCard = (ride) => {
    let passengerHTML = ``;

    if (ride.passengers && ride.passengers.length > 0) {
        passengerHTML = `
            <hr>
            <div>
                <h4>Pending Requests: </h4>
            </div>
            <div id="request-passengers-container">
            
        `;


        ride.passengers.forEach(passenger => {
            passengerHTML += `
                <div id="userbox">
                    <div id="top-row">
                        <div id="left-section">
                            <img class="passenger-profile-picture" id="profilePic-2" src="assets/img/man.png">
                            <div id="user-info">
                                <h3>${passenger.username}</h3>
                                <p>⭐${passenger.avg_rating}</p>
                            </div>
                        </div>

                        <div id="right-section">
                            <button>
                                <img class="content-icons" id="user-pic" src="assets/img/user.png" alt="">
                                View Profile
                            </button>
                        </div>
                    </div>

                    <div id="buttons-container">
                        <button id="accept-btn">Accept</button>
                        <button id="reject-btn">Reject</button>
                    </div>
                </div>
                `
        });
        passengerHTML += '</div>';
    }


    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="container-4">
            <div id="hosted-rides-destination">
                <h2 class="content-font">${ride.origin_text} → ${ride.destination_text}</h2>
                <div id="right-section">
                    <button class="buttons">
                        <img src="assets/img/view.png" alt="" onclick="window.location.href='ride_details.html'">
                    </button>
                    <button class="buttons">
                        <img src="assets/img/delete.png" alt="">
                    </button>
                </div>
            </div>
            
            
            <div id="status">
                <p id="statusbox">active</p>
                ${ ride.passengers.length > 0 ? ( `
                    <p id="pendingbox">${ride.passengers.length} pending request ${ride.passengers.length > 1 ? 's' : ''}</p>
                `

                ) :
                (`<div></div>`)
                }
            </div>
           
            <div id="ride-status">
                <div id="time">
                    ${ride.departure_datetime}
                </div>
                <div id="seatsavailable">
                    ${ride.available_seats}
                </div>
            </div>
            ${passengerHTML}
        </div>
    `;

    

    return wrapper.firstElementChild;
}


// driver pop up
const createDriverPopUp = (user, onHighlightStars) => {

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="driver-popup-container" id="driverPopUpContainer">
            <div class="driver-popup">
                <button class="close-driver-popup-button">
                    <img class="close-driver-popup-icon" src="assets/img/close.png">
                </button>

                <div class="driver-popup-row-1">
                    <h3>User Profile</h3>
                    <img class="popup-pfp" src="assets/img/leaf.png">
                    <h1>${user.name}</h1>
                    <div class="popup-role">${user.role}</div>
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                </div>

                <div class="driver-popup-row-2">
                    <div>
                        <p class="grey-text">Total Rides</p>
                        <h1>${user.total_rides ?? 0}</h1>
                    </div>
                    <div>
                        <p class="grey-text">CO₂ Saved</p>
                        <h1>${user.total_co2_saved ?? 0}</h1>
                    </div>
                </div>

                <div class="contact-container">
                    <p class="bold">Contact Information</p>
                    <p>${user.email}</p>
                    <p>${user.phone}</p>
                </div>
            </div>
        </div>
    `;

    const popUp = wrapper.firstElementChild;

    if (user.license_status) {
        popUp.querySelector('.driver-popup').innerHTML += `
            <div class="license-container">
                <p class="bold">Driver License</p>
                <div class="license-status-container">
                    <p class="grey-text">status</p>
                    <div>${user.license_status}</div>
                </div>
            </div>
        `;
    }

    popUp.querySelector(".close-driver-popup-button").addEventListener("click", () => {
        popUp.remove();
    });

    onHighlightStars(String(user.avg_rating), popUp.querySelectorAll(".stars i"));

    return popUp;
}

function createPassengerWelcomeContainer() {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="passenger-greeting-section">
        <p class="bold">Welcome Passenger!</p>
        <p class="grey-text greeting-desc">Find and join rides to your destination</p>
    </div>
    `
    return wrapper.firstElementChild;

}

function createDriverWelcomeContainer() {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="welcome-container">
            <div id="content">
                <h2 class="bolded-title">Welcome back, Driver!</h2>
                <p class="grey-content">Host rides or find rides to join</p>
            </div>
            <img src="assets/img/car.png" alt="" id="car-absolute">
            <div id="button-container">
                <button id="createRide-button">
                    Create New Ride
                </button>
            </div>
        </div>
    `;
    return wrapper.firstElementChild;
}

function createImpactStats(weight) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="impact-container">
            <div id="content">
                <div id="title">
                    <h2>Enviromental Impact</h2>
                </div>
                <div>
                    <p>Co2 saved through carpooling</p>
                    <h1 id="stats">${weight}kg CO<sup>2</sup></h1>
                </div>
                <div id="leaderboard-container">
                    <a href="leaderboard.php">
                        <button id="leaderboard-button">
                            View leaderboard
                        </button>
                    </a>
                </div>
            </div>
        </div>
    `;
    return wrapper.firstElementChild;
}

function createDriverHostedMenu() {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="container-3">
            <div id="findrides-container2" onclick="window.location.href='hosted_rides.php'" style="cursor: pointer;">
                <p>My Hosted rides</p>
            </div>
            <div id="hostedrides-container2" onclick="window.location.href='find_rides.php'" style="cursor: pointer;">
                <p>Find Rides</p>
            </div>
        </div>
    `

    return wrapper.firstElementChild;
}

function createDriverFindRideMenu() {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="container-3">
            <div id="hostedrides-container2" onclick="window.location.href='hosted_rides.php'" style="cursor: pointer;">
                <p>My Hosted rides</p>
            </div>
            <div id="findrides-container2" onclick="window.location.href='find_rides.php'" style="cursor: pointer;">
                <p>Find Rides</p>
            </div>
        </div>
    `

    return wrapper.firstElementChild;
}

function requestRide(roomCode, messageBox) {
    fetch(`api/request_api.php?room_code=${roomCode}`)
        .then(response => response.json())
        .then(data => {
            console.log('Requested ride:', data);

            if (data.success) {
                messageBox.innerHTML = data.success;
                messageBox.style.color = "green";
            } else if (data.error) {
                messageBox.innerHTML = data.error;
                messageBox.style.color = "red";
            }
        })
        .catch(error => {
            console.error('Error requesting ride:', error);
        });
    console.log(roomCode)
}



export { createAvailableRideCard };
export { createRequestedRideCard };
export { requestRide };
export { createDriverPopUp };
export { createJoinedRideCard };
export { createHostedRideCard };
export { createDriverWelcomeContainer };
export { createPassengerWelcomeContainer };
export { createImpactStats };
export { createDriverHostedMenu };
export { createDriverFindRideMenu}