import { createDriverPopUp } from "./app.js";
import { getGoogleAPI, initMap, getRoute, drawRoute } from "./map_utils.js";

let states = {
    ride_id: null,
    ride_details: null,
    session: null,
    isReported: null,
    isRated: null
}
let rideMap = null;

// DOM
const routeSection = document.getElementById("routeSection");
const driverSection = document.getElementById("driverSection");
const vehicleSection = document.getElementById("vehicleSection");
const passengersSection = document.getElementById("passengersSection");
const impactSection = document.getElementById("impactSection");
const completeRideBtn = document.getElementById('completeRideBtn');
const rateUsersBtn = document.getElementById("rateUsersBtn");

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

function fetchReport() {
    return fetch(`api/reports_api.php?user_id=${states.session.user_id}&ride_id=${states.ride_details.ride_id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            states.isReported = data['is_reported'];
        })
        .catch(error => {
            console.error("Error fetching report status:", error);
        });
}

function fetchIsRated() {
    return fetch(`api/rating_api.php?ride_id=${states.ride_details.ride_id}&user_id=${states.session.user_id}`)
        .then(response => response.json())
        .then(data => {
            states.isRated = data;
        })
        .catch(error => {
            console.error("Error fetching rating status:", error);
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
                        <img class="driver-profile-picture" src="${driver.profile_picture_url}" alt="">
                        <div id="column">
                            <h3>${driver.username}</h3>
                            <p>⭐ ${Math.round(driver.avg_rating * 100)/100} | ${driver.total_rides} rides</p>
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

function createVehicleContainer(vehicle){
    let div = document.createElement('div');
    div.innerHTML = `
    <div class="vehicle-container">
            <div class="vehicle-header-container">
                <h3 class="vehicle-header">Vehicle</h3>
            </div>
            <div class="vehicle-info-container">
                <div class="vehicle-detail-container">
                    <p class="bold">${vehicle.brand} ${vehicle.manufactured_year} (${vehicle.type})</p>
                    <p class="grey-text">Color: ${vehicle.color}</p>
                    <p class="grey-text">Carplate Number: ${vehicle.car_plate_number}</p>
                </div>
                <div class="vehicle-button-container">
                    <button class="view-vehicle-button">
                        <img src="assets/img/car.svg">
                        View Vehicle
                    </button>
                </div>
            </div>
        </div>
    `;

    let el = div.firstElementChild;
    
    // add eventlistener to view vehicle button
    let viewVehicleBtn = el.querySelector('.view-vehicle-button');

    if (viewVehicleBtn){
        viewVehicleBtn.addEventListener('click', ()=>{
            const vehiclePopUp = createVehiclePopUp(vehicle.vehicle_image_url);
            document.body.appendChild(vehiclePopUp);
        })
    }
    
    return div.firstElementChild;
}

function createVehiclePopUp(vehicleImageUrl){
    let div = document.createElement('div');
    div.innerHTML = `
    <div class="vehicle-popup-bg">
        <div class="vehicle-popup-container">
            <span class="close-btn">&times;</span>

            <img src="${vehicleImageUrl}" alt="Vehicle Image">
        </div>
    </div>
    `;

    let el = div.firstElementChild;

    // add eventlistener to close button
    let closeBtn = el.querySelector('.close-btn');
    if (closeBtn){
        closeBtn.addEventListener('click', ()=>{
            el.remove();
        })
    }

    return div.firstElementChild;
}

function createPassengersContainer(ride_details) {
    let passengersHTML = '<div id="passengersList">';
    if (ride_details.passengers.length > 0) {
        ride_details.passengers.forEach((passenger, index) => {
            passengersHTML += `
            <div id="passenger-container">
                <div id="left-section">
                    <img class="passenger-profile-picture" src="${passenger.profile_picture_url}" alt="">
                    <div id="column">
                        <h3>${passenger.username}</h3>
                        <p>⭐ ${Math.round(passenger.avg_rating * 100)/100}</p>
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
                    <h1 id="stats">${weight}kg CO₂<sup></sup></h1>
                </div>
            </div>
        </div>
    `;
    return wrapper.firstElementChild;
}

// Create rating popup function
async function createRatingPopup(riders) {
    const overlay = document.createElement('div');
    overlay.className = 'rating-overlay';
    console.log("FUCKER:", riders);

    let ridersHTML = '';
    riders.forEach((rider, index) => {
        ridersHTML += `
            <div class="rider-rating-card" data-rider-id="${rider.user_id}">
                <div class="rider-info">
                    <img class="rider-avatar" src="${rider.profile_picture_url}" alt="">
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
                    placeholder="Make Report (Plese Report Carefully)" 
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
            rater_id: states.session.user_id,
            rated_id: rider.user_id,
            ride_id: states.ride_id,
            score: ratings[index].rating
        }));

        const reports = riders.map((rider, index) => ({
            reporter_id: states.session.user_id,
            reported_user_id: rider.user_id,
            ride_id: states.ride_id,
            description: ratings[index].comment
        })).filter(report => report.description);

        console.log(ratingsData);
        console.log(reports);

        // submit ratings
        await fetch("api/rating_api.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ratings: ratingsData
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                states.isRated = true
            })

        if (reports.length > 0) {
            // submit report
            const reportResponse = await fetch("api/reports_api.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reports: reports
                })
            });

            const reportData = await reportResponse.json();
            console.log(reportData);
        }




        // submit point logs and CO2
        // 0.187kg per km
        const co2Saved = states.session.role.toLowerCase() === "driver" ? Number(states.ride_details.ride_distance) * 0.187 * states.ride_details.passengers.length : Number(states.ride_details.ride_distance) * 0.187 ;
        const points = Math.floor(co2Saved * 5);
        const rideId = states.ride_id;

        const co2Response = await fetch("api/co2_api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: states.session.user_id,
                rideId: rideId,
                co2Saved: co2Saved
            })
        })

        const co2Data = await co2Response.json();
        console.log(co2Data);

        const pointResponse = await fetch("api/point_api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: states.session.user_id,
                rideId: rideId,
                points: points
            })
        })

        const pointData = await pointResponse.json();
        console.log(pointData);



        // Complete ride if button pressed by driver
        if (states.session.role.toLowerCase() === "driver") {
            fetch("api/ride_api.php", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ride_id: rideId,
                    status: "Completed"
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    states.ride_details.ride_status = "Completed";
                })

        }


        closePopup();
        renderRateUsersBtn();
        renderCompleteRideBtn();
    }
    );


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

function renderVehicleContainer(){
    console.log("Rendering Vehicle Container...");
    vehicleSection.innerHTML = ``;

    const vehicleContainer = createVehicleContainer(states.ride_details.vehicle);
    vehicleSection.appendChild(vehicleContainer);
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
    let hidden = (states.session.role.toLowerCase() !== "driver") || (Date.parse(states.ride_details.departure_datetime) > Date.now) || (states.ride_details.ride_status.toLowerCase() !== 'incomplete') || (states.isReported);
    // hide button if (user not driver OR departure date is in future OR ride status is incomplete OR the user is reported )
    completeRideBtn.style.display = hidden ? "none" : "block";
}

function renderRateUsersBtn() {
    let show = (states.session.role.toLowerCase() === "passenger") && (states.ride_details.ride_status.toLowerCase() === "completed") && (!states.isReported) && (states.isRated === false);
    rateUsersBtn.style.display = show ? "block" : "none";
}



async function init() {
    const rideId = getRideId();
    if (!rideId) {
        alert("Please Fill The Ride Id");
    }

    await getGoogleAPI();
    await Promise.all([
        fetchSession(),
        fetchRideDetails(rideId),
    ]);
    // fetch is reported after user and ride are fetched
    await fetchReport();
    await fetchIsRated();

    states.isRated = false;

    console.log("Finished Fetching:", states);

    // render functions
    renderRoute();
    renderDriverContainer();
    renderVehicleContainer();
    renderPassengersContainer();
    renderImpactContainer();
    renderCompleteRideBtn();
    renderRateUsersBtn();

    //event listener
    completeRideBtn.addEventListener('click', async () => {
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
            const popup = await createRatingPopup(allRiders);
            document.body.appendChild(popup);
        }
    });

    rateUsersBtn.addEventListener('click', async () => {
        // Gather all co-riders (driver + passengers, excluding current user)
        const allRiders = [];

        // Add driver if current user is not the driver
        if (states.session.user_id !== states.ride_details.driver.user_id) {
            allRiders.push(
                states.ride_details.driver
                );
        }

        // Add passengers (excluding current user)
        states.ride_details.passengers.forEach(passenger => {
            if (passenger.username !== states.session.username) {
                allRiders.push(passenger);

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
            const popup = await createRatingPopup(allRiders);
            document.body.appendChild(popup);
        }
    });
}

init();