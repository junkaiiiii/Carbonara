import { getGoogleAPI, initMap, getRoute, drawRoute } from "./map_utils.js";

// // create html components
// const createAvailableRideCard1 = (ride, onRequest, onCloseDriverPopUp, onHighlightStars) => {
//     const div = document.createElement('div');
//     div.innerHTML = `
//         <div class="ride-card" id="ride-${ride.ride_id}">
//             <div class="ride-card-row-1">
//                 <p class="locations semi-bold">${ride.origin_text} &#8594 ${ride.destination_text}</p>
//                 <div class="ride-status grey-text">
//                     Available
//                 </div>
//             </div>
//             <div class="ride-card-row-2">
//                 <div class="driver-details">
//                     <img class="driver-pfp" src="assets/img/leaf.png">
//                     <div>
//                         <p>${ride.driver.name || "Unknown Driver"}</p>
//                         <p class="grey-text">★ </p>
//                     </div>
//                 </div>



//                 <div class="view-button-container">
//                     <button class="view-profile-button" id="viewProfileButton">
//                         <img class="user-logo" src="assets/img/user.svg">
//                          View Profile
//                     </button>
//                 </div>
//             </div>
//             <div class="ride-card-row-3 grey-text">
//                 <img class="clock-logo" src="assets/img/clock.svg">
//                 <p>${ride.departure_datetime}</p>
//             </div>

//             <div class="ride-card-row-4 grey-text">
//                 <img class="users-logo" src="assets/img/users.svg">
//                 <p>${ride.available_seats} seat available</p>
//             </div>

//             <button class="request-ride-button"">
//                 Request to Join
//             </button>
//         </div>
//     `


//     const el = div.firstElementChild;

//     // attach event listener here instead of onclick=""
//     el.querySelector(".request-ride-button").addEventListener("click", () => onRequest(ride.ride_id));


//     const viewProfileButton = el.querySelector(".view-profile-button");

//     viewProfileButton.addEventListener("click", () => {
//         const popUp = createDriverPopUp(ride.driver, onCloseDriverPopUp, onHighlightStars);

//         document.body.appendChild(popUp);

//     });

//     return div.firstElementChild;
// }

const createAvailableRideCard = (ride, onRequest, onHighlightStars) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="request-to-join-container">
            <div id="join-ride-content">
                <h2>${ride.origin_text} → ${ride.destination_text}</h2>
                <div id="available-status">
                    <p>Available</p>
                </div>
            </div>

            <div id="driver-info">
                <div id="left-section">
                    <img id="driver-pic" src="assets/img/man.png" alt="">
                    <div id="column">
                        <h3>${ride.driver.name || "Unknown Driver"}</h3>
                        <p>⭐ ${ride.driver.avg_rating}</p>
                    </div>
                </div>

                <div id="right-section">
                    <button id="viewProfileButton">
                        <img id="user-pic" src="assets/img/user.png" alt="">
                        View Profile
                    </button>
                </div>
            </div>

            <div id="request-join-button-container">
                <div id="ride-status">
                    <div id="time">
                        ${ride.departure_datetime}
                    </div>
                    <div id="seatsavailable" style="margin-top:5px;">
                        Available Seats: ${ride.available_seats}
                    </div>
                </div>
            </div>

            <button id="request-to-join-button">
                Request To Join
            </button>

        </div>
    `;

    const el = wrapper.firstElementChild;

    const viewMapButton = el.querySelector("#request-to-join-button");
    // const confirmButton = el.querySelector("#confirm-ride-button");
    const viewProfileButton = el.querySelector("#viewProfileButton");

    viewProfileButton.addEventListener("click", () => {
        const popUp = createDriverPopUp(ride.driver, onHighlightStars);


        document.body.appendChild(popUp);

    });

    viewMapButton.addEventListener("click", () => {
        const popUpMap = createMapPopUp(ride, onRequest);
        
        // confirmButton.addEventListener("click", onRequest(ride.ride_id));
        document.body.appendChild(popUpMap);
    });

    return wrapper.firstElementChild;
}

// const createRequestedRideCard1 = (ride, onCancel) => {
//     const div = document.createElement('div');
//     div.innerHTML = `
//     <div class="ride-card" id="ride-${ride.ride_id}">
//         <div class="ride-card-row-1">
//             <p class="locations semi-bold">${ride.origin_text} &#8594 ${ride.destination_text}</p>
//             <div class="ride-status grey-text">
//                 Requested
//             </div>
//         </div>
//         <div class="ride-card-row-2">
//             <div class="driver-details">
//                 <img class="driver-pfp" src="assets/img/leaf.png">
//                 <div>
//                     <p>${ride.driver.name}</p>
//                     <p class="grey-text">★ ${ride.driver.average_rating}</p>
//                 </div>
//             </div>

//             <div class="view-button-container">
//                 <button class="view-profile-button">
//                     <img class="user-logo" src="assets/img/user.svg">
//                         View Profile
//                 </button>
//             </div>
//         </div>
//         <div class="ride-card-row-3 grey-text">
//             <img class="clock-logo" src="assets/img/clock.svg">
//             <p>${ride.departure_datetime}</p>
//         </div>

//         <button class="cancel-request-button">
//             &#10006; Cancel Request
//         </button>
//     </div>
//     `

//     const el = div.firstElementChild;
//     el.querySelector('.cancel-request-button').addEventListener('click', () => onCancel(ride.ride_id));

//     return div.firstElementChild;
// }

const createRequestedRideCard = (ride, onCancel) => {
    const div = document.createElement('div');
    div.innerHTML = `
    <div id="join-request-container">
            <div id="join-ride-content">
                <h2>${ride.origin_text} → ${ride.destination_text}</h2>
                <div id="available-status">
                    <p>Pending</p>
                </div>
            </div>

            <div id="driver-info">
                <h3>Driver: ${ride.driver.username}</h3>
            </div>

            <div id="ride-status">
                <div id="time">
                    ${ride.departure_datetime}
                </div>
            </div>

            <button id="cancel-request-button">
                Cancel Request
            </button>
        </div>
    `

    const el = div.firstElementChild;
    el.querySelector('#cancel-request-button').addEventListener('click', () => onCancel(ride.ride_id));

    return div.firstElementChild;
}

// joined ride card
// const createJoinedRideCard1 = (ride, onViewRideDetails) => {
//     const div = document.createElement('div');
//     div.innerHTML = `
//     <div class="ride-card" id="ride-${ride.ride_id}">
//             <div class="ride-card-row-1">
//                 <p class="locations semi-bold">${ride.origin_text} &#8594 ${ride.destination_text}</p>
//                 <div class="ride-status grey-text">
//                     Requested
//                 </div>
//             </div>
//             <div class="ride-card-row-2">
//                 <div class="driver-details">
//                     <img class="driver-pfp" src="assets/img/leaf.png">
//                     <div>
//                         <p>${ride.driver.name}</p>
//                         <p class="grey-text">★ ${ride.driver.average_rating}</p>
//                     </div>
//                 </div>

//                 <div class="view-button-container">
//                     <button class="view-profile-button">
//                         <img class="user-logo" src="assets/img/user.svg">
//                             View Profile
//                     </button>
//                 </div>
//             </div>
//             <div class="ride-card-row-3 grey-text">
//                 <img class="clock-logo" src="assets/img/clock.svg">
//                 <p>${ride.departure_datetime}</p>
//             </div>

//             <div class="accepted-info-container">
//                 <p class="bold">Request Accepted!</p>
//                 <p class="grey-text">Contact driver: +1234565789</p>
//                 <button id='viewRideDetailsButton'>View Ride Details</button>
//             </div>
//         </div>
//     `

//     const el = div.firstElementChild;
//     el.querySelector('#viewRideDetailsButton').addEventListener('click', () => {
//         onViewRideDetails()
//     });

//     return div.firstElementChild;

// }

const createJoinedRideCard = (ride) => {
    const div = document.createElement('div');
    div.innerHTML = `
        <div id="request-accepted-container">
            <div id="join-ride-content">
                <h2>${ride.origin_text} → ${ride.destination_text}</h2>
                <div id="accepted-status">
                    <p>Joined</p>
                </div>
            </div>

            <div id="driver-info">
                <h3>Driver: ${ride.driver.username}</h3>
            </div>

            <div id="ride-status">
                <div id="time">
                    ${ride.departure_datetime}
                </div>
            </div>

            <div id="request-accepted-notice">
                <div id="accepted-info">
                    <h3 id="green-bold">Request Accepted!</h3>
                    <p id="grey-color">Contact driver: ${ride.driver.phone}</p>
                </div>

                <a href="ride_details.php?id=${ride.ride_id}" style="text-decoration:none;">
                    <button id="view-ride-details-button">
                        View Ride Details
                    </button>
                </a>  
            </div>
        </div>
    `;

    return div.firstElementChild;
}

const createHostedRideCard = (ride, onPopUp, onHighlightStars, onAcceptRequest, onRejectRequest, onCancelRide, onQrPopUp) => {
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
                            <button id="viewProfileButton">
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
                    <button class="buttons" id="showQrButton">
                        <img src="assets/img/qr1.png" style="opacity:0.5;">
                    </button>
                    <a href="ride_details.php?id=${ride.ride_id}">
                        <button class="buttons">
                            <img src="assets/img/view.png" alt=""">
                        </button>
                    </a>
                    
                    <button class="buttons" id="cancelRideButton">
                        <img src="assets/img/delete.png" alt="">
                    </button>
                </div>
            </div>
            
            
            <div id="status">
                <p id="statusbox">active</p>
                ${ride.passengers.length > 0 ? (`
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


    let el = wrapper.firstElementChild;

    // view profile functions
    const viewProfileButtons = el.querySelectorAll("#viewProfileButton");

    viewProfileButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            console.log(ride.passengers[index]);
            const popUp = onPopUp(ride.passengers[index], onHighlightStars);
            document.body.appendChild(popUp);
        })
    });

    // accept request buttom
    const acceptRequestButtons = el.querySelectorAll("#accept-btn");

    acceptRequestButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            onAcceptRequest(ride.ride_id, ride.passengers[index].username);
        })
    });

    // accept request buttom
    const rejectRequestButtons = el.querySelectorAll("#reject-btn");

    rejectRequestButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            onRejectRequest(ride.ride_id, ride.passengers[index].username);
        })
    });

    // cancel ride button
    const cancelRideButton = el.querySelector("#cancelRideButton");

    if (cancelRideButton) {
        cancelRideButton.addEventListener("click", () => {
            onCancelRide(ride.ride_id);
        })
    }

    // create qr popup
    const showQrButton = el.querySelector("#showQrButton");

    if (showQrButton) {
        showQrButton.addEventListener("click", () => {
            const qrPopUp = onQrPopUp(ride.room_code);
            document.body.appendChild(qrPopUp);
        })

    }


    return wrapper.firstElementChild;
}

//map pop up
const createMapPopUp = (ride, onRequest) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="map-popup-container" id="MapPopUpContainer">
            <div class="map-popup">
                <button class="close-map-popup-button">
                    <img class="close-map-popup-icon" src="assets/img/close.png">
                </button>
                <div class="map-popup-content">
                    <h3>Ride Route</h3>
                    <div id="map" style="height: 400px; width: 100%;"></div>
                    <div style="margin-top: 15px; padding: 10px; background-color: #f3f4f6; border-radius: 5px;">
                        <p style="margin: 5px 0;"><strong>From:</strong> ${ride.origin_text}</p>
                        <p style="margin: 5px 0;"><strong>To:</strong> ${ride.destination_text}</p>
                        <p style="margin: 5px 0;"><strong>Departure:</strong> ${ride.departure_datetime}</p>
                        <p style="margin: 5px 0;"><strong>Distance:</strong> ${ride.ride_distance} km</p>
                    </div>
                </div>
                <div class="confirm-btn-container">
                    <button id="confirm-ride-button">Confirm Ride</button>
                </div>
            </div>
        </div>
    `;

    const popUp = wrapper.firstElementChild;

    popUp.querySelector(".close-map-popup-button").addEventListener("click", () => {
        popUp.remove();
    });

    //init map
    setTimeout(async() => {
        try{
            await getGoogleAPI();

            const map = await initMap("map");
            console.log("map created: ", map);

            const routeData = await getRoute(
                [ride.origin_lon, ride.origin_lat],
                [ride.destination_lon, ride.destination_lat]
            ); 

            await drawRoute(map, routeData,[ride.origin_lon, ride.origin_lat],[ride.destination_lon, ride.destination_lat]);
        
            const confirmBtn = popUp.querySelector("#confirm-ride-button");
            confirmBtn.addEventListener("click", () => {
                onRequest(ride.ride_id);
                console.log("Ride confirmed!");
                popUp.remove();
            });
        }
        catch(error){
            console.error("Error initializing map:", error);
        }
    })

    return popUp;
}



// driver pop up
const createDriverPopUp = (user, onHighlightStars) => {

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="driver-popup-container" id="PopUpContainer">
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
                <a href="map.html">
                    <button id="createRide-button">
                        Create New Ride
                    </button>
                </a>      
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
            <div id="hostedrides-container2" onclick="window.location.href='find_rides.php'" style="cursor: pointer;">
                <p>Find Rides</p>
            </div>
            <div id="findrides-container2" onclick="window.location.href='hosted_rides.php'" style="cursor: pointer;">
                <p>My Hosted rides</p>
            </div>
            
        </div>
    `

    return wrapper.firstElementChild;
}

function createDriverFindRideMenu() {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="container-3">
            <div id="findrides-container2" onclick="window.location.href='find_rides.php'" style="cursor: pointer;">
                <p>Find Rides</p>
            </div>
            <div id="hostedrides-container2" onclick="window.location.href='hosted_rides.php'" style="cursor: pointer;">
                <p>My Hosted rides</p>
            </div>
        </div>
    `

    return wrapper.firstElementChild;
}

function requestRide(roomCode, messageBox) {
    return fetch(`api/request_api.php?room_code=${roomCode}`)
        .then(response => response.json())
        .then(data => {
            console.log('Requested ride:', data);

            if (data.success) {
                messageBox.innerHTML = "Successfully Requested The Ride";
                messageBox.style.color = "green";
                messageBox.style.text = "bold";
                messageBox.style.textAlign = "center";
            } else if (data.error) {
                messageBox.innerHTML = data.error;
                messageBox.style.color = "red";
                messageBox.style.text = "bold";
                messageBox.style.textAlign = "center";
            }
        })
        .catch(error => {
            console.error('Error requesting ride:', error);
        });
    console.log(roomCode)
}

function cancelRequestRide(rideId, passengerUsername) {
    console.log("cancelled", rideId, passengerUsername);

    return fetch("api/request_api.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ride_id: rideId,
            passenger_username: passengerUsername,
            status: "cancelled"
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

function highlightNavBar(page) {
    if (page === "home") {
        document.getElementById("homeIcon").src = "assets/img/btm-home-green.png";

        document.getElementById('home').classList.add("green-font");
    } else if (page === "rewards") {
        document.getElementById("rewardsIcon").src = "assets/img/btm-prizes-green.png";

        document.getElementById('rewards').classList.add("green-font");
    } else if (page === "inventory") {
        document.getElementById("inventoryIcon").src = "assets/img/btm-inventory-green.png";

        document.getElementById('inventory').classList.add("green-font");
    } else if (page === "profile") {
        document.getElementById("profileIcon").src = "assets/img/btm-user-green.png";

        document.getElementById('profile').classList.add("green-font");
    }
}

export { createMapPopUp };
export { createAvailableRideCard };
export { createRequestedRideCard };
export { requestRide };
export { cancelRequestRide }
export { createDriverPopUp };
export { createJoinedRideCard };
export { createHostedRideCard };
export { createDriverWelcomeContainer };
export { createPassengerWelcomeContainer };
export { createImpactStats };
export { createDriverHostedMenu };
export { createDriverFindRideMenu };
export { highlightNavBar };