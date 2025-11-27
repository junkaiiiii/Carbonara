import {createAvailableRideCard} from "app.js";

states = {
    available_rides: [],

    requested_rides: []
}
// DOM
const availableRides = document.getElementById('availableRides');
const requestedRides = document.getElementById('requestedRides');





//fetch all rides data from backend
const getAllRides = () =>{
  fetch("api/ride_api.php")
    .then(response => response.json())
    .then(data => { 
      states.available_rides = data;

      availableRides.innerHTML = '';
      states.available_rides.forEach(ride => {
          const rideCard = createAvailableRideCard(ride);
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
