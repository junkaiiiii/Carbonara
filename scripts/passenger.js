
import { createAvailableRideCard, createRequestedRideCard,requestRide } from "./app.js";

let states = {
    available_rides: [],
    requested_rides: [],
};

// DOM
const availableRides = document.getElementById('availableRides');
const requestedRides = document.getElementById('requestedRides');
const messageBox = document.getElementById('messageBox');
const roomCodeSubmitButton = document.getElementById('roomCodeSubmitButton');

// Fetch all rides
const getAllRides = () => {
    fetch("api/ride_api.php")
        .then(response => response.json())
        .then(data => {
            // Reset states
            states.available_rides = [];
            states.requested_rides = [];

            data.forEach(ride => {

                if (ride.joined === true) {
                    states.requested_rides.push(ride);

                } else if (ride.request_status) {
                    states.requested_rides.push(ride);

                } else {
                    states.available_rides.push(ride);
                }
            });

            render();
        })
        .catch(error => console.error("Fetch error:", error));
};


// Request to join ride
const handleRequestRide = (rideId) => {
    rideId = String(rideId);

    const rideIndex = states.available_rides.findIndex(ride => ride.ride_id === rideId);

    if (rideIndex !== -1) {
        const [requestedRide] = states.available_rides.splice(rideIndex, 1);

        requestRide(requestedRide.room_code, messageBox);
    }
    getAllRides();
};


// Cancel request
const handleCancelRequest = (rideId) => {
    rideId = String(rideId);

    const rideIndex = states.requested_rides.findIndex(ride => ride.ride_id === rideId);

    if (rideIndex !== -1) {
        const [cancelledRide] = states.requested_rides.splice(rideIndex, 1);

        cancelledRide.request_status = null;
        states.available_rides.push(cancelledRide);
    }

    console.log(states.available_rides)
    console.log(states.requested_rides)

    render();
};


// Render all UI
const render = () => {
    availableRides.innerHTML = '';
    states.available_rides.forEach(ride => {
        const rideCard = createAvailableRideCard(ride, handleRequestRide);
        availableRides.appendChild(rideCard);
    });

    requestedRides.innerHTML = '';
    //add title to the section if requested rides exist
    if (states.requested_rides.length > 0){
        requestedRides.innerHTML = '<p class="requested-rides-title">Requested Rides</p>'; 
    }
    
    states.requested_rides.forEach(ride => {
        const requestedCard = createRequestedRideCard(ride, handleCancelRequest);
        requestedRides.appendChild(requestedCard);
    });
};

// add evenlisteners
roomCodeSubmitButton.addEventListener('click', ()=>requestRide(document.getElementById('roomCodeField').value,messageBox));
getAllRides();
console.log(states);