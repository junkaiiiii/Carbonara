const userGrid = document.querySelector(".user-grid");
let states = {
    users : [],
    licenses: [],
    reports: [],
    rides: []
}


const createUserCard = (userId, username, userRole, rating, dateJoined, co2Saved, totalDistance, email, phoneNum, pfp_img, onHighlightStars) => {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="user-card">
            <div class="user-info">
                <div class="card-pfp"><img class="pfp-card-img" src="${pfp_img}"></div>
                <div class="card-name">
                    <h3 class="card-username">${username}</h3>
                    <p class="card-rating">${rating}</p>
                    <p class="card-date">Joined ${dateJoined}</p>
                </div>
                <div class="card-role">
                    <p>${userRole}</p>
                </div>
            </div>
            <div class="user-stats">
                <div class="user-stats-container">
                    <p>CO₂ Saved</p>
                    <h3>${co2Saved}</h3>
                </div>
                <div class="user-stats-container">
                    <p>Total Distance Travelled</p>
                    <h3>${totalDistance}</h3>                    
                </div>
            </div>
            <div class="user-contacts-container">
                <div class="user-contacts">
                    <p>${email}</p>
                    <p>${phoneNum}</p>
                </div>
                <button class='view-profile-btn'>View Profile</button>            
            </div>
        </div>
    `

    const el = div.firstElementChild;
    const viewProfileBtn = el.querySelector(".view-profile-btn")
    viewProfileBtn.addEventListener("click", () => {
        const popUp = createProfilePopUp(userId, username, userRole, dateJoined, co2Saved, totalDistance, email, phoneNum);
        
        document.body.appendChild(popUp);
        onHighlightStars(Number(rating), popUp.querySelectorAll(".stars i"));
    })

    return div.firstElementChild;
}

// highlight profile star
const highlightStars = (rating,stars) => {
    stars.forEach((star,index)=>{
        if (index+1<=rating){
            console.log("test test am i in stars");
            star.classList.add('highlighted');
        }
    })
}

const defaultPfp = "assets/img/leaf.png"
function render(){

    userGrid.innerHTML = "";
    states.users.forEach(user => {
        let ratingScore = 0;
        let rated = 0;
        let avgRating = 0;
        if (user.ratings){
            user.ratings.forEach(rating => {
                ratingScore += Number(rating.score);
                rated += 1;
                avgRating = Number(ratingScore / rated);   
                // states.users.user.push(ratingScore); 
            })
        }
        let co2Saved = 0;
        let totalDistance = 0;
        if (user.co2_logs){
            user.co2_logs.forEach(co2 => {
                co2Saved += Number(co2.co2_saved);
                totalDistance += Number(co2.total_distance);
            })
        }
        if (user.role === "Admin")return;
        const card = createUserCard(user.user_id,
                                    user.username,
                                    user.role,
                                    avgRating,
                                    user.created_at,
                                    co2Saved,
                                    totalDistance, 
                                    user.email,
                                    user.phone,
                                    user.profile_picture ?? defaultPfp,
                                    highlightStars);
        userGrid.appendChild(card)
    })
}


const cardUsers = document.querySelectorAll(".card-username");
const searchText = document.getElementById("search-text");

searchText.addEventListener("keyup", () => {
    let currText = (searchText.value.toLowerCase());
    userGrid.innerHTML = '';

    const filteredUsers = states.users.filter(user => {
        return user.username.toLowerCase().includes(currText)
    });
    // console.log(filteredUsers);

    if (filteredUsers.length !==0){
        console.log("AM I HERE")
        filteredUsers.forEach(user => {
            let ratingScore = 0;
            let rated = 0;
            let avgRating = 0;
            if (user.ratings){
                user.ratings.forEach(rating => {
                    ratingScore += Number(rating.score);
                    rated += 1;
                    avgRating = Number(ratingScore / rated);   
                    // states.users.user.push(ratingScore); 
                })
            }
            let co2Saved = 0;
            let totalDistance = 0;
            if (user.co2_logs){
                user.co2_logs.forEach(co2 => {
                    co2Saved += Number(co2.co2_saved);
                    totalDistance += Number(co2.total_distance);
                })
            }
            const card = createUserCard(user.user_id,
                                        user.username,
                                        user.role,
                                        avgRating,
                                        user.created_at,
                                        co2Saved,
                                        totalDistance, 
                                        user.email,
                                        user.phone,
                                        user.profile_picture ?? defaultPfp,
                                        highlightStars);
            userGrid.appendChild(card);
        });
    }
    else{
        // console.log("GAY")
    }
});

function getAllUsers(){
    fetch("api/users_api.php")
        .then(response => response.json())
        .then(data => {
            states.users = [];
            
            data.forEach(user => {
                states.users.push(user);
                render();
                console.log(states.users);
            });
        });
    fetch("api/license_api.php")
        .then(response => response.json())
        .then(data => {
            states.licenses = [];
            data.forEach(license => {
                states.licenses.push(license);
                console.log(states.licenses);
            });
        });
    fetch("api/ride_api.php")
        .then(res => res.json())
        .then(data => {
            states.rides = [];
            data.forEach(ride => {
                states.rides.push(ride);
                console.log(states);
            })
        })
}


// driver pop up
const createProfilePopUp = (userId, username, userRole, dateJoined, co2Saved, totalDistance, email, phone) => {

    const userLicense = states.licenses.find(license => license.user.user_id === userId);

    const userRides = states.rides.filter(ride => ride.driver.user_id === userId);
    let totalRides = userRides.length;
    console.log(totalRides);
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
                    <h1>${username}</h1>
                    <p>Joined at ${dateJoined.split(" ")[0]}</p>
                    <div class="popup-role">${userRole}</div>
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
                        <p class="grey-text">CO₂ Saved</p>
                        <h1>${co2Saved ?? 0}</h1>
                    </div>
                    <div>
                        <p class="grey-text">Total Distance</p>
                        <h1>${totalDistance ?? 0}</h1>
                    </div>
                    <div>
                        <p class="grey-text">Total Rides</p>
                        <h1>${totalRides ?? 0}</h1>
                    </div>
                </div>

                <div class="contact-container">
                    <p class="bold">Contact Information</p>
                    <p>${email}</p>
                    <p>${phone}</p>
                </div>
            </div>
        </div>
    `;

    const popUp = wrapper.firstElementChild;

    if (userLicense){
        popUp.querySelector('.driver-popup').innerHTML += `
            <div class="license-container">
                <p class="bold">Driver License</p>
                <div class="license-status-container">
                    <p class="grey-text">status</p>
                    <div>${userLicense.license_status}</div>
                </div>
            </div>
        `;
    }

    popUp.querySelector(".close-driver-popup-button").addEventListener("click", () => {
        popUp.remove();
    });

    

    return popUp;
}

getAllUsers();
// console.log(states.users);
