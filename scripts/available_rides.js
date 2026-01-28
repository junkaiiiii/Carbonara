import { createImpactStats, createDriverFindRideMenu, createPassengerWelcomeContainer, createDriverWelcomeContainer, requestRide, cancelRequestRide, createAvailableRideCard, createRequestedRideCard, createJoinedRideCard, highlightNavBar } from "./app.js";

import { startScanning, stopScanning, onScanSuccess } from "./qr.js";

let states = {
    filtered_available_rides: null,
    available_rides: null,
    visible_ride_count: 5,
    requested_rides: null,
    completed_rides: null,
    co2: null,
    session: null
};

// DOM
const welcomeSection = document.getElementById("welcome-section");
const impactSection = document.getElementById("impact-section");
const driverMenuSection = document.getElementById("driver-menu-section");
const originInput = document.getElementById("originInputField");
const destinationInput = document.getElementById("destinationInputField");
const availableRides = document.getElementById('availableRides');
const requestedRides = document.getElementById('requestedRides');
const messageBox = document.getElementById('messageBox');
const roomCodeSubmitButton = document.getElementById('roomCodeSubmitButton');
const showMoreButton = document.getElementById('showMoreBtn');
const dateInput = document.getElementById("dateInputField");
const completedRides = document.getElementById("completedRides");
const requestTitle = document.getElementById('join-request-title');
const completedTitle = document.getElementById('completed-title');
// // Fetch all rides


// Fetch functions - now properly return promises
const fetchTotalCo2 = () => {
    return fetch("api/co2_api.php?mode=total")
        .then(response => response.json())
        .then(weight => {
            states.co2 = weight;
            console.log("CO2 fetched:", weight);
        })
        .catch(error => {
            console.error("Error fetching CO2:", error);
        });
}

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

const fetchRides = () => {
    return fetch("api/ride_api.php?mode=available")
        .then(response => response.json())
        .then(data => {
            // 1. Reset all state arrays to be empty
            states.available_rides = [];
            states.requested_rides = [];
            states.filtered_available_rides = [];;
            states.completed_rides = [];
            console.log(data);

            data.forEach(ride => {
                // Check both joined and requested status

                if (ride.request_status === "requested") {
                    states.requested_rides.push(ride);
                }
                else if (ride.joined === true || ride.request_status === "approved") {
                    if (ride.ride_status.toLowerCase() === "completed") {
                        states.completed_rides.push(ride);
                    } else {
                        states.requested_rides.push(ride);
                    }
                } else {
                    states.available_rides.push(ride);
                }
            });

            // 2. Sync filtered rides with the new data
            // If the user isn't searching, this shows all. 
            // If they are searching, call searchRides() instead.
            if (originInput.value || destinationInput.value) {
                searchRides();
            } else {
                states.filtered_available_rides = [...states.available_rides];
            }

            console.log("Data synced. Available:", states.available_rides.length, "Requested:", states.requested_rides.length);
        })
        .catch(error => console.error("Fetch error:", error));
}
// const getAllRides = () => {
//     fetch("api/ride_api.php")
//         .then(response => response.json())
//         .then(data => {
//             // Reset states
//             states.available_rides = [];
//             states.requested_rides = [];

//             data.forEach(ride => {

//                 if (ride.joined === true) {
//                     states.requested_rides.push(ride);

//                 } else if (ride.request_status) {
//                     states.requested_rides.push(ride);

//                 } else {
//                     states.available_rides.push(ride);
//                 }
//             });

//             render();
//         })
//         .catch(error => console.error("Fetch error:", error));
// };


// General Functions

// Request to join ride
const handleRequestRide = async (rideId) => {
    // Use loose equality (==) or ensure types match
    const ride = states.available_rides.find(r => String(r.ride_id) === String(rideId));

    if (ride) {
        await requestRide(ride.room_code, messageBox);
        await fetchRides();
        renderAvailableRides();
        renderRequestedRides();
    }
};

const handleCancelRequest = async (rideId) => {
    const ride = states.requested_rides.find(r => String(r.ride_id) === String(rideId));

    if (ride) {
        await cancelRequestRide(ride.ride_id, states.session.username);
        await fetchRides();
        renderAvailableRides();
        renderRequestedRides();
    }
};



// highlight profile star
const highlightStars = (rating, stars) => {
    stars.forEach((star, index) => {
        if (index + 1 <= rating) {
            star.classList.add('highlighted');
        }
    })
}

const searchRides = () => {
    const originKeyword = originInput.value.toLowerCase().trim();
    const destinationKeyword = destinationInput.value.toLowerCase().trim();
    const dateKeyword = dateInput.value; // Format: YYYY-MM-DD
    console.log(dateKeyword)

    states.filtered_available_rides = states.available_rides.filter(ride => {
        const originMatch = !originKeyword ||
            ride.origin_text.toLowerCase().includes(originKeyword);

        const destinationMatch = !destinationKeyword ||
            ride.destination_text.toLowerCase().includes(destinationKeyword);

        // Date Match Logic: Extract YYYY-MM-DD from departure_datetime
        const rideDate = ride.departure_datetime.split(' ')[0];
        const dateMatch = !dateKeyword || rideDate === dateKeyword;

        return originMatch && destinationMatch && dateMatch;
    });

    states.visible_ride_count = 5;
    renderAvailableRides();
}


const showMore = () => {
    states.visible_ride_count += 5;
    renderAvailableRides();
}
// // view ride Details
// const viewRideDetails = (ride) =>{
//     console.log(ride);
// }


// // Render all UI
const renderWelcome = () => {
    console.log("Rendering welcome, role:", states.session.role);
    if (!states.session) {
        console.log("Session is null, skipping render");
        return;
    }
    welcomeSection.innerHTML = '';

    if (states.session.role === "Driver") {
        const welcomeContainer = createDriverWelcomeContainer();
        welcomeSection.appendChild(welcomeContainer);
    } else if (states.session.role === "Passenger") {
        const welcomeContainer = createPassengerWelcomeContainer();
        welcomeSection.appendChild(welcomeContainer);
    }
};

const renderImpact = () => {
    console.log("Rendering impact, co2 value:", states.co2);
    impactSection.innerHTML = "";

    if (states.co2 === null) {
        console.log("CO2 is null, skipping render");
        return;
    }

    const impactContainer = createImpactStats(states.co2);
    impactSection.appendChild(impactContainer);
    console.log("Impact rendered successfully");
};

const renderDriverMenu = () => {
    console.log("Rendering driver menu, session:", states.session);
    driverMenuSection.innerHTML = "";

    if (!states.session) {
        console.log("Session is null, skipping render");
        return;
    }

    if (states.session.role === "Driver") {
        const driverMenu = createDriverFindRideMenu();
        driverMenuSection.appendChild(driverMenu);
        console.log("Driver menu rendered successfully");
    }
};

const renderAvailableRides = () => {
    console.log("Rendering available rides: ", states.available_rides);

    availableRides.innerHTML = '';
    const ridesToShow = states.filtered_available_rides.slice(0, states.visible_ride_count);

    ridesToShow.forEach(ride => {
        const rideCard = createAvailableRideCard(ride, handleRequestRide, highlightStars);
        availableRides.appendChild(rideCard);
    });

    showMoreButton.hidden = states.visible_ride_count >= states.filtered_available_rides.length;
}

const renderRequestedRides = () => {
    console.log("Rendering requested rides: ", states.requested_rides);

    if (states.requested_rides.length === 0) {
        if (requestTitle) {
            requestTitle.style.display = 'none';
            return
        }
    }


    requestTitle.style.display = 'block';
    requestedRides.innerHTML = '';

    states.requested_rides.forEach(ride => {

        const rideCard = ride.request_status === "approved" ? createJoinedRideCard(ride) : createRequestedRideCard(ride, handleCancelRequest);
        requestedRides.appendChild(rideCard);
    });

}

const renderCompletedRides = () => {
    console.log("Rendering requested rides: ", states.requested_rides);

    if (states.completed_rides.length === 0) {
        
        if (completedTitle) {
            completedTitle.style.display = 'none';
            return
        }
    }

    completedTitle.style.display = 'block';
    completedRides.innerHTML = ``;

    states.completed_rides.forEach(ride => {
        const rideCard = createJoinedRideCard(ride);
        completedRides.appendChild(rideCard);
    });
}
// const render = () => {
//     writeImpactStats();

//     availableRides.innerHTML = '';
//     states.available_rides.forEach(ride => {
//         const rideCard = createAvailableRideCard(ride, handleRequestRide, highlightStars);
//         availableRides.appendChild(rideCard);
//     });

//     requestedRides.innerHTML = '';

//     states.requested_rides.forEach(ride => {
//         if (ride.joined){
//             const joinedCard = createJoinedRideCard(ride, viewRideDetails);
//             requestedRides.appendChild(joinedCard);
//         }else {
//             const requestedCard = createRequestedRideCard(ride, handleCancelRequest);
//             requestedRides.appendChild(requestedCard);
//         }

//     });
// };


// getAllRides();
// console.log(states);

const init = async () => {
    console.log("Initializing...");

    await Promise.all([
        fetchTotalCo2(),
        fetchSession(),
        fetchRides()
    ]);

    console.log("All data fetched, states:", states);

    renderWelcome();
    renderImpact();
    renderDriverMenu();
    renderAvailableRides();
    renderRequestedRides();
    renderCompletedRides();
    highlightNavBar("home");

    // // add evenlisteners
    roomCodeSubmitButton.addEventListener('click', () => requestRide(document.getElementById('roomCodeField').value, messageBox));
    originInput.addEventListener("keyup", () => searchRides());
    destinationInput.addEventListener("keyup", () => searchRides());
    dateInput.addEventListener("change", () => searchRides())
    showMoreButton.addEventListener("click", () => showMore());
    document.getElementById('start-scan').addEventListener('click', () => startScanning(onScanSuccess));
    document.getElementById('stop-scan').addEventListener('click', () => stopScanning());
};

init();
