import { createImpactStats, createDriverFindRideMenu, createPassengerWelcomeContainer, createDriverWelcomeContainer, requestRide, cancelRequestRide, createAvailableRideCard, createRequestedRideCard, highlightNavBar } from "./app.js";

let states = {
    filtered_available_rides: null,
    available_rides: null,
    visible_ride_count : 5,
    requested_rides: null,
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
            // Reset states
            states.available_rides = [];
            states.requested_rides = [];
            states.filtered_available_rides = [];
            console.log(data);

            data.forEach(ride => {

                if (ride.joined === true) {
                    states.requested_rides.push(ride);

                } else if (ride.request_status) {
                    states.requested_rides.push(ride);

                } else {
                    states.available_rides.push(ride);
                    states.filtered_available_rides.push(ride);
                }
            });
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
const handleRequestRide = (rideId) => {
    rideId = String(rideId);

    const rideIndex = states.available_rides.findIndex(ride => ride.ride_id === rideId);

    if (rideIndex !== -1) {
        const [requestedRide] = states.available_rides.splice(rideIndex, 1);

        requestRide(requestedRide.room_code, messageBox);
        requestedRide.request_status = 'requested';
        states.requested_rides.push(requestedRide);
    }

    renderAvailableRides();
    renderRequestedRides();
};



// Cancel request
const handleCancelRequest = (rideId) => {
    rideId = String(rideId);

    const rideIndex = states.requested_rides.findIndex(ride => ride.ride_id === rideId);

    if (rideIndex !== -1) {
        const [cancelledRide] = states.requested_rides.splice(rideIndex, 1);

        cancelRequestRide(cancelledRide.room_code);
        cancelledRide.request_status = null;
        states.available_rides.push(cancelledRide);

    }

    console.log(states.available_rides)
    console.log(states.requested_rides)

    renderAvailableRides();
    renderRequestedRides();
};

// highlight profile star
const highlightStars = (rating,stars) => {
    stars.forEach((star,index)=>{
        if (index+1<=rating){
            star.classList.add('highlighted');
        }
    })
}

const searchRides = () => {
    const originKeyword = originInput.value.toLowerCase().trim();
    const destinationKeyword = destinationInput.value.toLowerCase().trim();

    states.filtered_available_rides = states.available_rides.filter(ride => {
        const originMatch =
            !originKeyword ||
            ride.origin_text.toLowerCase().includes(originKeyword);

        const destinationMatch =
            !destinationKeyword ||
            ride.destination_text.toLowerCase().includes(destinationKeyword);

        return originMatch && destinationMatch;
    });

    

    states.visible_ride_count = 5;
    console.log(states.filtered_available_rides,originKeyword,destinationKeyword);
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
    const ridesToShow = states.filtered_available_rides.slice(0,states.visible_ride_count);

    ridesToShow.forEach(ride => {
        const rideCard = createAvailableRideCard(ride,handleRequestRide, highlightStars);
        availableRides.appendChild(rideCard);
    });

    showMoreButton.hidden = states.visible_ride_count >=  states.filtered_available_rides.length;
}

const renderRequestedRides = () => {
    console.log("Rendering requested rides: ", states.requested_rides);

    requestedRides.innerHTML = '';

    states.requested_rides.forEach(ride => {
        const rideCard = createRequestedRideCard(ride,handleCancelRequest);
        requestedRides.appendChild(rideCard);
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
    highlightNavBar("home");

    // // add evenlisteners
    roomCodeSubmitButton.addEventListener('click', () => requestRide(document.getElementById('roomCodeField').value, messageBox));
    originInput.addEventListener("keyup",() => searchRides());
    destinationInput.addEventListener("keyup",() => searchRides());
    showMoreButton.addEventListener("click", () => showMore());
};

init();