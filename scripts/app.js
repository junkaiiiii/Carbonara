

// create html components
const createAvailableRideCard = (ride,onRequest,onCloseDriverPopUp, onHighlightStars) => {
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
                    <button class="view-profile-button" id="viewProfileButton">
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
    

    const viewProfileButton = el.querySelector(".view-profile-button");

    viewProfileButton.addEventListener("click", () => {
        const popUp = createDriverPopUp(ride.driver, onCloseDriverPopUp, onHighlightStars);

        document.body.appendChild(popUp);

    });

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


// driver pop up
const createDriverPopUp = (user, onHighlightStars) => {

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="driver-popup-container" id="driverPopUpContainer">
            <div class="driver-popup">
                <button class="close-driver-popup-button">
                    <img class="close-driver-popup-icon" src="assets/img/close.png">
                </button>

                <div class="driver-popup-row-1">
                    <h3>User Profile</h3>
                    <img class="popup-pfp" src="assets/img/leaf.png">
                    <h1>${user.name}</h1>
                    <div class="popup-role">${user.role}</div>
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                </div>

                <div class="driver-popup-row-2">
                    <div>
                        <p class="grey-text">Total Rides</p>
                        <h1>${user.total_rides ?? 0}</h1>
                    </div>
                    <div>
                        <p class="grey-text">CO₂ Saved</p>
                        <h1>${user.total_co2_saved ?? 0}</h1>
                    </div>
                </div>

                <div class="contact-container">
                    <p class="bold">Contact Information</p>
                    <p>${user.email}</p>
                    <p>${user.phone}</p>
                </div>
            </div>
        </div>
    `;

    const popUp = wrapper.firstElementChild;

    if (user.license_status){
        popUp.querySelector('.driver-popup').innerHTML += `
            <div class="license-container">
                <p class="bold">Driver License</p>
                <div class="license-status-container">
                    <p class="grey-text">status</p>
                    <div>${user.license_status}</div>
                </div>
            </div>
        `;
    }

    popUp.querySelector(".close-driver-popup-button").addEventListener("click", () => {
        popUp.remove();
    });

    onHighlightStars(String(user.avg_rating), popUp.querySelectorAll(".stars i"));

    return popUp;
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
export {createDriverPopUp};
