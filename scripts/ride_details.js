import { createDriverPopUp } from "./app.js";
import { getGoogleAPI, initMap, getRoute, drawRoute } from "./map_utils.js";

let states = {
    ride_id: null,
    ride_details: null,
    session: null
}
let rideMap = null;

// DOM
const routeSection = document.getElementById("routeSection");
const driverSection = document.getElementById("driverSection");
const passengersSection = document.getElementById("passengersSection");
const impactSection = document.getElementById("impactSection");
const completeRideBtn = document.getElementById('completeRideBtn');

// general functions
function getRideId() {
    const urlParams = new URLSearchParams(window.location.search);

    const rideId = urlParams.get("id");
    return rideId ? rideId : "";
}

// highlight profile star
const highlightStars = (rating, stars) => {
    stars.forEach((star, index) => {
        if (index + 1 <= rating) {
            star.classList.add('highlighted');
        }
    })
}

// fetch ride details functions
const fetchSession = () => {
    return fetch('api/session_api.php?mode=general')
        .then(response => response.json())
        .then(data => {
            states.session = data;
            console.log("Session fetched:", data);
        })
        .catch(error => {
            console.error("Error fetching session:", error);
        });
}

function fetchRideDetails(id) {
    return fetch(`api/ride_api.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            states.ride_details = data;
            states.ride_id = data.ride_id;
        })
        .catch(error => {
            console.error("Error fetching rides:", error);
        });
}

// components
function createRouteContainer(ride) {


    let div = document.createElement('div');
    div.innerHTML = `
        <div id="ride-details-container">
            <div id="route-header">
                <img class="icons" src="assets/img/destination.png" alt="">
                <p>Route</p>         
            </div>

            <div id="map">
                // map here
            </div>
            <div id="row">
                <svg width="16" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="rgb(5, 150 ,105)" />
                </svg>
                <div id="starting-point">
                    <h3>${ride.origin_text}</h3>
                    <p>Starting point</p>
                </div>
            </div>

            <div id="vertical-line">
                <svg width="30" height="30">
                    <line x1="8" y1="1" x2="8" y2="30" stroke="rgb(223, 223, 223)" stroke-width="1" />
                </svg>
            </div>

            <div id="row">
                <svg width="16" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="rgb(5, 150 ,105)" />
                </svg>

                <div id="destination">
                    <h3>${ride.destination_text}</h3>
                    <p>Destination</p>
                </div>
            </div>
            
            <a style="text-decoration:none;" href="https://www.google.com/maps/dir/${ride.origin_lat},${ride.origin_lon}/${ride.destination_lat},${ride.destination_lon}" target="_blank">
                <button id="open-in-map-button">
                    <img class="icons" src="assets/img/search.png" alt="">
                    Open in Maps
                </button>
            </a>
            

            <hr>

            <div id="departure-container">
                <div id="departure-content">
                    <img class="content-icons" src="assets/img/clock.png" alt="">
                    <h3 .bolded-title>Departure : </h3>
                    <p class="grey-content">${ride.departure_datetime}</p>
                </div>
            </div>    
        </div>
    `

    return div.firstElementChild;
}

async function initRouteMap(ride) {
    setTimeout(async () => {
        const mapElement = document.getElementById("map");
        if (mapElement && !rideMap) {
            rideMap = await initMap('map', [ride.origin_lat, ride.origin_lon], 13);
            const routeData = await getRoute([ride.origin_lon, ride.origin_lat], [ride.destination_lon, ride.destination_lat]);
            const drawObj = await drawRoute(rideMap, routeData, [ride.origin_lon, ride.origin_lat], [ride.destination_lon, ride.destination_lat]);
        }
    }, 100);


}


function createDriverContainer(driver) {
    let div = document.createElement('div');
    div.innerHTML = `
        <div id="driver-container">
            <div id="driver-header">
                <h2 class="bolded-title">Driver</h2>
            </div>

            <div id="driver-content">
                <div id="driver-info">
                    <div id="left-section">
                        <img class="driver-profile-picture" src="assets/img/man.png" alt="">
                        <div id="column">
                            <h3>${driver.username}</h3>
                            <p>⭐ ${driver.avg_rating} | ${driver.total_rides} rides</p>
                            <div id="phone-number-row">
                                <img class="content-icons" src="assets/img/telephone.png" alt="">
                                <p>${driver.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div id="right-section">
                        <button id="viewProfileBtn">
                            <img class="content-icons" id="user-pic" src="assets/img/user.png" alt="">
                            View Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `

    let el = div.firstElementChild;
    const viewProfileButton = el.querySelector("#viewProfileBtn");
    viewProfileButton.addEventListener("click", () => {
        const popUp = createDriverPopUp(driver, highlightStars);
        document.body.appendChild(popUp);
    });

    return div.firstElementChild;
}

function createPassengersContainer(ride_details) {
    let passengersHTML = '<div id="passengersList">';
    if (ride_details.passengers.length > 0) {
        ride_details.passengers.forEach((passenger, index) => {
            passengersHTML += `
            <div id="passenger-container">
                <div id="left-section">
                    <img class="passenger-profile-picture" src="assets/img/man.png" alt="">
                    <div id="column">
                        <h3>${passenger.username}</h3>
                        <p>⭐ ${passenger.avg_rating}</p>
                        <div id="phone-number-row">
                            <img class="content-icons" src="assets/img/telephone.png" alt="">
                            <p>${passenger.phone}</p>
                        </div>
                    </div>
                </div>

                <div id="right-section">
                    <button id="viewProfileBtn">
                        <img class="content-icons" id="user-pic" src="assets/img/user.png" alt="">
                        View Profile
                    </button>
                </div>
            </div>
        
        `
        });
    } else {
        passengersHTML += `
            <div>No Passengers Joined Currently</div>
        `
    }
    passengersHTML += `</div>`;


    let div = document.createElement('div');
    div.innerHTML = `
        <div id="seats-container">
            <div id="seats-header">
                <img class="icons" src="assets/img/participants.png" alt="">
                <h3>Seats</h3>
            </div>
            <h4>${ride_details.available_seats} seat available</h4>
            <p>${ride_details.passengers.length} passenger confirmed</p>

            <hr>

            <h3>List of Passengers</h3>
            ${passengersHTML}
        </div>
    `;

    let el = div.firstElementChild;

    let viewProfileButtons = el.querySelectorAll("#viewProfileBtn");
    viewProfileButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const popUp = createDriverPopUp(ride_details.passengers[index], highlightStars);
            document.body.appendChild(popUp);
        })
    });

    return div.firstElementChild;
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
            </div>
        </div>
    `;
    return wrapper.firstElementChild;
}

// Create rating popup function
function createRatingPopup(riders) {
    const overlay = document.createElement('div');
    overlay.className = 'rating-overlay';

    let ridersHTML = '';
    riders.forEach((rider, index) => {
        ridersHTML += `
            <div class="rider-rating-card" data-rider-id="${rider.user_id}">
                <div class="rider-info">
                    <img class="rider-avatar" src="assets/img/man.png" alt="">
                    <div class="rider-details">
                        <h3>${rider.username}</h3>
                        <p class="rider-role">${rider.role || 'Passenger'}</p>
                    </div>
                </div>
                <div class="rating-stars" data-rider-index="${index}">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <span class="star" data-value="${star}">★</span>
                    `).join('')}
                </div>
                <textarea 
                    class="rating-comment" 
                    placeholder="Add a comment (optional)" 
                    rows="2"
                    data-rider-index="${index}"
                ></textarea>
            </div>
        `;
    });

    overlay.innerHTML = `
        <div class="rating-popup">
            <div class="rating-header">
                <h2>Rate Your Co-Riders</h2>
                <button class="close-popup" id="closeRatingPopup">×</button>
            </div>
            <div class="rating-content">
                <p class="rating-instruction">Please rate your experience with each rider</p>
                ${ridersHTML}
            </div>
            <div class="rating-footer">
                <button class="cancel-btn" id="cancelRating">Cancel</button>
                <button class="submit-btn" id="submitRatings">Submit Ratings</button>
            </div>
        </div>
    `;

    // Store ratings
    const ratings = riders.map(() => ({ rating: 0, comment: '' }));

    // Add star rating functionality
    const starContainers = overlay.querySelectorAll('.rating-stars');
    starContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const riderIndex = parseInt(container.dataset.riderIndex);

        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const value = parseInt(star.dataset.value);
                highlightStarsTemp(stars, value);
            });

            star.addEventListener('click', () => {
                const value = parseInt(star.dataset.value);
                ratings[riderIndex].rating = value;
                selectStars(stars, value);
            });
        });

        container.addEventListener('mouseleave', () => {
            const currentRating = ratings[riderIndex].rating;
            selectStars(stars, currentRating);
        });
    });

    // Add comment functionality
    const commentBoxes = overlay.querySelectorAll('.rating-comment');
    commentBoxes.forEach(box => {
        const riderIndex = parseInt(box.dataset.riderIndex);
        box.addEventListener('input', (e) => {
            ratings[riderIndex].comment = e.target.value;
        });
    });

    // Close popup
    const closePopup = () => {
        overlay.remove();
    };

    overlay.querySelector('#closeRatingPopup').addEventListener('click', closePopup);
    overlay.querySelector('#cancelRating').addEventListener('click', closePopup);

    // Submit ratings
    overlay.querySelector('#submitRatings').addEventListener('click', async () => {
        // Validate that all riders have been rated
        const unratedRiders = ratings.filter(r => r.rating === 0);
        if (unratedRiders.length > 0) {
            alert('Please rate all co-riders before submitting');
            return;
        }

        // Prepare ratings data
        const ratingsData = riders.map((rider, index) => ({
            user_id: rider.user_id,
            ride_id: states.ride_id,
            rating: ratings[index].rating,
            comment: ratings[index].comment
        }));

        console.log(ratingsData);

        
    });

    return overlay;
}

// Helper function to highlight stars temporarily on hover
function highlightStarsTemp(stars, value) {
    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.add('highlighted-temp');
            star.classList.remove('selected');
        } else {
            star.classList.remove('highlighted-temp', 'selected');
        }
    });
}

// Helper function to select stars permanently on click
function selectStars(stars, value) {
    stars.forEach((star, index) => {
        star.classList.remove('highlighted-temp');
        if (index < value) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}



// render functions
function renderRoute() {
    console.log("Rendering Route Container...");
    routeSection.innerHTML = "";

    const routeContainer = createRouteContainer(states.ride_details)
    routeSection.appendChild(routeContainer);

    initRouteMap(states.ride_details);
}

function renderDriverContainer() {
    console.log("Rendering Driver Container...");
    driverSection.innerHTML = "";

    const driverContainer = createDriverContainer(states.ride_details.driver);
    driverSection.appendChild(driverContainer)
}

function renderPassengersContainer() {
    console.log("Rendering Passenger Container...");
    passengersSection.innerHTML = "";

    const passengersContainer = createPassengersContainer(states.ride_details);
    passengersSection.appendChild(passengersContainer);
}

function renderImpactContainer() {
    console.log("Rendering Impact Container...");
    impactSection.innerHTML = "";

    // quantity of people in the ride (include driver)
    const passengerAmount = states.ride_details.passengers.length + 1
    const saved_co2 = Number(states.ride_details.ride_distance) * passengerAmount * 0.187

    const impactContainer = createImpactStats(saved_co2.toFixed(2));
    impactSection.appendChild(impactContainer);
}

function renderCompleteRideBtn() {
    completeRideBtn.hidden = states.session.role.toLowerCase() !== "driver" && Date.parse(states.ride_details.departure_datetime) > Date.now;
    console.log(states.session.role.toLowerCase() !== "driver");
    console.log(Date.parse(states.ride_details.departure_datetime) > Date.now);
}



async function init() {
    const rideId = getRideId();
    if (!rideId) {
        alert("Please Fill The Ride Id");
    }

    await getGoogleAPI();
    await Promise.all([
        fetchSession(),
        fetchRideDetails(rideId)
    ]);
    console.log("Finished Fetching:", states);

    // render functions
    renderRoute();
    renderDriverContainer();
    renderPassengersContainer();
    renderImpactContainer();
    renderCompleteRideBtn();

    //event listener
    completeRideBtn.addEventListener('click', () => {
        // Gather all co-riders (driver + passengers, excluding current user)
        const allRiders = [];

        // Add driver if current user is not the driver
        if (states.session.user_id !== states.ride_details.driver.user_id) {
            allRiders.push({
                user_id: states.ride_details.driver.user_id,
                username: states.ride_details.driver.username,
                role: 'Driver'
            });
        }

        // Add passengers (excluding current user)
        states.ride_details.passengers.forEach(passenger => {
            if (passenger.username !== states.session.username) {
                allRiders.push({
                    user_id: passenger.user_id,
                    username: passenger.username,
                    role: 'Passenger'
                });

                console.log("Add Passenger");
            }
        });

        if (allRiders.length === 0) {
            // No co-riders to rate, just complete the ride
            if (confirm('Complete this ride?')) {
                completeRide();
            }
        } else {
            // Show rating popup
            const popup = createRatingPopup(allRiders);
            document.body.appendChild(popup);
        }
    });
}

init();