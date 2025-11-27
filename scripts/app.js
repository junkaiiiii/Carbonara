// create html components
const createAvailableRideCard = (ride) => {
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
// remember to add this ${ride.driver.average_rating}
    return div.firstElementChild;
}