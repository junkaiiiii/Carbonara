import { createImpactStats, createDriverHostedMenu, createPassengerWelcomeContainer, createDriverWelcomeContainer, createHostedRideCard, createDriverPopUp, highlightNavBar } from "./app.js";

let states = {
    co2: null,
    session: null,
    hostedRides: null
};

//DOM
const welcomeSection = document.getElementById("welcome-section");
const impactSection = document.getElementById("impact-section");
const driverMenuSection = document.getElementById("driver-menu-section");
const hostedRidesSection = document.getElementById('hosted-rides-section');

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
const acceptRequest = (rideId, passengerUsername) => {

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
const handleAcceptRequest = (rideId, passengerUsername) => {

    console.log(rideId);
    const selectedRide = states.hostedRides[rideId];

    if (selectedRide) {
        acceptRequest(rideId, passengerUsername);

        // find passenger from ride.passengers 
        const passengerIndex = selectedRide.passengers.findIndex(passenger => passenger.username = passengerUsername);

        if (passengerIndex !== -1) {
            selectedRide.passengers.splice(passengerIndex, 1);
        }

    }
    console.log(states.hostedRides);

    renderHostedRides();
}

// handle reject request
const handleRejectRequest = (rideId, passengerUsername) => {

    console.log(rideId);
    const selectedRide = states.hostedRides[rideId];

    if (selectedRide) {
        rejectRequest(rideId, passengerUsername);

        // find passenger from ride.passengers 
        const passengerIndex = selectedRide.passengers.findIndex(passenger => passenger.username = passengerUsername);

        if (passengerIndex !== -1) {
            selectedRide.passengers.splice(passengerIndex, 1);
        }

    }
    console.log(states.hostedRides);

    renderHostedRides();
}

const handleCancelRide = (rideId) => {
    const selectedRide = states.hostedRides[rideId];

    if (selectedRide) {
        cancelRide(rideId);

        delete states.hostedRides[rideId];
    }
    renderHostedRides();
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
            states.hostedRides = data;
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

const renderHostedRides = () => {
    console.log("Rendering Hosted Rides")
    hostedRidesSection.innerHTML = '';

    for (const [key, value] of Object.entries(states.hostedRides)) {
        const hostedRide = createHostedRideCard(value, createDriverPopUp, highlightStars, handleAcceptRequest, handleRejectRequest, handleCancelRide);

        hostedRidesSection.appendChild(hostedRide);
    }
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
    renderHostedRides();
    highlightNavBar("home");
};

init();