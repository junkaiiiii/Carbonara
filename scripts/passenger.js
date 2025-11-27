states = {
    available_rides: [],

    requested_rides: []
}
// DOM
const availableRides = document.getElementById('availableRides');
const requestedRides = document.getElementById('requestedRides');

// create html components
const createRideCard = (ride) => {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="ride-card" id="ride-${ride.ride_id}">
            <div class="ride-card-row-1">
                <p class="locations semi-bold">${ride.origin_text} &#8594 ${ride.destination_text}</p>
                <div class="ride-status grey-text">
                    ${ ride.status}
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

            <div class="ride-card-row-4 grey-text">
                <img class="users-logo" src="assets/img/users.svg">
                <p>${ride.available_seats} seat available</p>
            </div>
 
            <button class="request-ride-button" onclick="handleRequestRide('${ride.ride_id}');">
                Request to Join
            </button>
        </div>
    `

    return div.firstElementChild;
}
// remember to add this ${ride.driver.average_rating}


//fetch all rides data from backend
const getAllRides = () =>{
  fetch("api/ride_api.php")
    .then(response => response.json())
    .then(data => { 
      states.available_rides = data;

      availableRides.innerHTML = '';
      states.available_rides.forEach(ride => {
          const rideCard = createRideCard(ride);
          availableRides.appendChild(rideCard);
      });
      console.log(data);
    })
    .catch(error => console.error("Fetch error:", error));
}


//request to join ride
const handleRequestRide = (rideId) => {
    rideId = String(rideId);

    const rideIndex = states.available_rides.findIndex(ride => ride.ride_id === rideId);

    if (rideIndex !== -1){
        const [requestedRide] = states.available_rides.splice(rideIndex,1);
        states.requested_rides.push(requestedRide);

        // remove card from availables
        const cardToRemove = availableRides.querySelector(`#ride-${rideId}`);
        if (cardToRemove){
            cardToRemove.remove();
        }

        //add card
        const requestedCard = createRideCard(requestedRide);
        requestedRides.appendChild(requestedCard);

    }
}

getAllRides();




// // Render requested rides if any
// requestedRides.innerHTML = '';
// states.requested_rides.forEach(ride => {
//     const requestedCard = createRideCard(ride);
//     requestedRides.appendChild(requestedCard);
// });
