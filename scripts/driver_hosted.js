import { createImpactStats, createDriverHostedMenu, createPassengerWelcomeContainer, createDriverWelcomeContainer, createHostedRideCard, createDriverPopUp, highlightNavBar } from "./app.js";
import { createQrPopUp } from "./qr.js";

let states = {
    co2: null,
    session: null,
    hostedRides: null,
    requestedRides: null,
    completedRides: null
};

//DOM
const welcomeSection = document.getElementById("welcome-section");
const impactSection = document.getElementById("impact-section");
const driverMenuSection = document.getElementById("driver-menu-section");
const hostedRidesSection = document.getElementById('hosted-rides-section');
const requestedRidesSection = document.getElementById('requestedRidesSection');
const completedRidesSection = document.getElementById('completedRidesSection');
const requestedRidesTitle = document.getElementById('requestedRidesTitle')
const completedRidesTitle = document.getElementById('completedRidesTitle');

// General Functions
// highlight profile star
const highlightStars = (rating, stars) => {
    stars.forEach((star, index) => {
        if (index + 1 <= rating) {
            star.classList.add('highlighted');
        }
    })
}

// accept request
const acceptRequest = (rideId, passengerUsername, passengerUserId) => {
    console.log('DEBUG:', rideId, passengerUserId, passengerUsername);
    fetch("api/request_api.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ride_id: rideId,
            passenger_username: passengerUsername,
            status: "approved"
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));

    fetch("api/ride_participant_api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ride_id: rideId,
            user_id: passengerUserId
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

// accept request
const rejectRequest = (rideId, passengerUsername) => {

    fetch("api/request_api.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ride_id: rideId,
            passenger_username: passengerUsername,
            status: "rejected"
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

// cancel ride
const cancelRide = (rideId) => {
    fetch("api/ride_api.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ride_id: rideId,
            status: "Cancelled"
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}


// handle accept request
const handleAcceptRequest = (rideId, passengerUsername, passengerUserId) => {

    console.log(rideId);
    const selectedRide = states.requestedRides.find(ride => ride.ride_id === rideId);

    if (selectedRide) {
        acceptRequest(rideId, passengerUsername, passengerUserId);

        // find passenger from ride.passengers 
        const passengerIndex = selectedRide.passengers.findIndex(passenger => passenger.username === passengerUsername);

        if (passengerIndex !== -1) {
            selectedRide.passengers.splice(passengerIndex, 1);

            if (selectedRide.passengers.length < 1){
                states.hostedRides.push(selectedRide);
                states.requestedRides = states.requestedRides.filter(
                    ride => ride !== selectedRide
                );
            }
        }

    }
    console.log(states.hostedRides);
    renderRequestedRides();
    renderHostedRides();
}

// handle reject request
const handleRejectRequest = (rideId, passengerUsername) => {

    console.log(rideId);
    const selectedRide = states.requestedRides.find(ride => ride.ride_id === rideId);

    if (selectedRide) {
        rejectRequest(rideId, passengerUsername);

        // find passenger from ride.passengers 
        const passengerIndex = selectedRide.passengers.findIndex(passenger => passenger.username === passengerUsername);

        if (passengerIndex !== -1) {
            selectedRide.passengers.splice(passengerIndex, 1);

            if (selectedRide.passengers.length < 1){
                states.hostedRides.push(selectedRide);
                states.requestedRides = states.requestedRides.filter(
                    ride => ride !== selectedRide
                );
            }
        }

    }
    console.log(states.hostedRides);

    renderRequestedRides();
    renderHostedRides();
}

const handleCancelRide = (rideId) => {
    const selectedRideId = states.requestedRides.findIndex(ride => ride.ride_id === rideId);

    if (selectedRideId  !== -1) {
        cancelRide(rideId);
        states.requestedRides.splice(selectedRideId,1);
    }
    renderRequestedRides()
}


// Fetch functions 
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

const fetchHostedRides = () => {
    return fetch('api/ride_api.php?mode=hosted')
        .then(response => response.json())
        .then(data => {
            states.completedRides = [];
            states.hostedRides = [];
            states.requestedRides = [];
            console.log("RIDES: ", data);

            for (const [rideId, ride] of Object.entries(data)) {
                if (ride.passengers.length > 0) {
                    states.requestedRides.push(ride);
                } else if (ride.ride_status.toLowerCase() === 'completed') {
                    states.completedRides.push(ride);
                } else {
                    states.hostedRides.push(ride);
                }
            }
        })
}

//render functions

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
        const driverMenu = createDriverHostedMenu();
        driverMenuSection.appendChild(driverMenu);
        console.log("Driver menu rendered successfully");
    } else {
        console.log("User is not a driver, role:", states.session.role);
    }
};

const renderRequestedRides = () => {
    console.log("Rendering Requested Rides: ", states.requestedRides)
    requestedRidesSection.innerHTML = '';
    if (states.requestedRides.length < 1) {
        requestedRidesTitle.style.display = 'none';
        return
    }

    states.requestedRides.forEach(ride => {
        requestedRidesTitle.style.display = 'block';
        const requestedRide = createHostedRideCard(ride, createDriverPopUp, highlightStars, handleAcceptRequest, handleRejectRequest, handleCancelRide, createQrPopUp);

        requestedRidesSection.appendChild(requestedRide);
    });
}

const renderHostedRides = () => {
    console.log("Rendering Hosted Rides: ", states.hostedRides)
    hostedRidesSection.innerHTML = '';
    if (states.hostedRides.length < 1) {
        hostedRidesSection.innerHTML = `
        <div style="margin-top:100px; display:flex; justify-content:center; font-size:25px;">
            <h1>No Hosted Ride...</h1>
        <div>`;
    }

    states.hostedRides.forEach(ride => {
        const hostedRide = createHostedRideCard(ride, createDriverPopUp, highlightStars, handleAcceptRequest, handleRejectRequest, handleCancelRide, createQrPopUp);

        // if (ride.passengers.length > 0){
        //     requestedRidesSection.appendChild(hostedRide);
        //     return;
        // }
        hostedRidesSection.appendChild(hostedRide);
    })
}

const renderCompletedRides = () => {
    console.log("Rendering Completed Rides: ", states.completedRides)
    completedRidesSection.innerHTML = '';
    if (states.completedRides.length < 1) {
        completedRidesTitle.style.display = 'none';
        return
    }

    states.completedRides.forEach(ride => {
        completedRidesTitle.style.display = 'block';
        const completedRide = createHostedRideCard(ride, createDriverPopUp, highlightStars, handleAcceptRequest, handleRejectRequest, handleCancelRide, createQrPopUp);

        // if (ride.passengers.length > 0){
        //     requestedRidesSection.appendChild(completedRide);
        //     return;
        // }
        completedRidesSection.appendChild(completedRide);
    })
}

const init = async () => {
    console.log("Initializing...");

    await Promise.all([
        fetchTotalCo2(),
        fetchSession(),
        fetchHostedRides()
    ]);

    console.log("All data fetched, states:", states);

    renderWelcome();
    renderImpact();
    renderDriverMenu();
    renderRequestedRides();
    renderHostedRides();
    renderCompletedRides();
    highlightNavBar("home");
};

init();