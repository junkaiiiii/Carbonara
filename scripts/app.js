

// create html components
const createAvailableRideCard = (ride,onRequest) => {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="ride-card" id="ride-${ride.ride_id}">
            <div class="ride-card-row-1">
                <p class="locations semi-bold">${ride.origin_text} &#8594 ${ride.destination_text}</p>
                <div class="ride-status grey-text">
                    Available
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
 
            <button class="request-ride-button"">
                Request to Join
            </button>
        </div>
    `
// remember to add this ${ride.driver.average_rating}

    const el = div.firstElementChild;

    // attach event listener here instead of onclick=""
    el.querySelector(".request-ride-button").addEventListener("click", () => onRequest(ride.ride_id));
    return div.firstElementChild;
}

const createRequestedRideCard = (ride, onCancel) => {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="ride-card" id="ride-${ride.ride_id}">
        <div class="ride-card-row-1">
            <p class="locations semi-bold">${ride.origin_text} &#8594 ${ride.destination_text}</p>
            <div class="ride-status grey-text">
                Requested
            </div>
        </div>
        <div class="ride-card-row-2">
            <div class="driver-details">
                <img class="driver-pfp" src="assets/img/leaf.png">
                <div>
                    <p>${ride.driver.name}</p>
                    <p class="grey-text">★ ${ride.driver.average_rating}</p>
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
        
        <button class="cancel-request-button">
            &#10006; Cancel Request
        </button>
    </div>
    `

    const el = div.firstElementChild;
    el.querySelector('.cancel-request-button').addEventListener('click', ()=> onCancel(ride.ride_id));

    return div.firstElementChild;
}

function requestRide(roomCode, messageBox) {
    fetch(`api/request_api.php?room_code=${roomCode}`)
        .then(response => response.json())
        .then(data => {
            console.log('Requested ride:', data);
            
            if (data.success){
                messageBox.innerHTML = data.success; 
                messageBox.style.color = "green";
            } else if (data.error){
                messageBox.innerHTML = data.error;
                messageBox.style.color = "red";
            }
        })
        .catch(error => {
            console.error('Error requesting ride:', error);
        });
    console.log(roomCode)
}

export {createAvailableRideCard};
export {createRequestedRideCard};
export {requestRide};
