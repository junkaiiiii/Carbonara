const userGrid = document.querySelector(".user-grid");
let states = {
    users : [],
    licenses: [],
    reports: [],
    rides: [],
    ratings: []
}


const createUserCard = (userId, username, userRole, rating, dateJoined, co2Saved, totalDistance, email, phoneNum, pfp_img, onHighlightStars, status) => {
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
                ${status === "Banned" ? `<button class='unban-btn'>Unban</button>` : ``} 
                <button class='view-profile-btn'>View Profile</button>   
                         
            </div>
        </div>
    `

    const el = div.firstElementChild;
    const viewProfileBtn = el.querySelector(".view-profile-btn");
    viewProfileBtn.addEventListener("click", () => {
        const popUp = createProfilePopUp(userId, username, userRole, rating, dateJoined, co2Saved, totalDistance, email, phoneNum, status);
        
        document.body.appendChild(popUp);
        onHighlightStars(Number(rating), popUp.querySelectorAll(".stars i"));
    })

    const unbanBtn = el.querySelector(".unban-btn");
    // console.log(unbanBtn);
    if (unbanBtn){
        unbanBtn.addEventListener("click", () => {
            console.log("HELLOWWW");
            unbanReport(userId, email);
        });
    }


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
                                    highlightStars,
                                    user.status);
        userGrid.appendChild(card)
    })
}


const cardUsers = document.querySelectorAll(".card-username");
const searchText = document.getElementById("search-text");


//FILTERRR
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
            if (user.role === "Admin" || user.status === "Banned")return;
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
                                        highlightStars,
                                        user.status);
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
                // states.users.forEach(user => {
                //     user.ratings.forEach(rater=> {
                //         console.log(rater.rater.rater_username);
                //     });
                // })
            })
        })
        .catch(error => console.error());;
    fetch("api/license_api.php")
        .then(response => response.json())
        .then(data => {
            states.licenses = [];
            data.forEach(license => {
                states.licenses.push(license);
            });
        });
    fetch("api/ride_api.php")
        .then(res => res.json())
        .then(data => {
            states.rides = [];
            data.forEach(ride => {
                states.rides.push(ride);
            });
        });
}

function unbanReport(id, reportedEmail){
    fetch("api/users_api.php", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            action: "Active",
            reported_email : reportedEmail
        })
    })
    .then(res => res.json())
    .then(data => {
        let index = states.users.findIndex(user => user.user_id === id);
        if (index === -1)return;

        user = states.users[index];
        user.status = "Active";
        states.users.push(user);
        states.users.splice(index, 1);

        render();
        // let index = states.reports.findIndex(report => report.report_id === id);
        // if (index === -1)return;

        // const report = states.reports[index];
        // console.log(report);
        // report.status = "Pending";
        // states.reports.forEach(report => {
        //     console.log(report.status);
        // })
        // console.log(states.reports);
        // states.reports.push(report);
        // states.reports.splice(index,1);

        // render();
    });
}

// profile pop up
const createProfilePopUp = (userId, username, userRole, rating, dateJoined, co2Saved, totalDistance, email, phone, status) => {

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
                    <div class="popup-role">
                        <p class='user-role'>${userRole}</p>
                        <p class='user-status'>${status}</p>
                    </div>
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <button class='view-rating-btn'>View Ratings</button>
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

    const viewRatingBtn = popUp.querySelector(".view-rating-btn");
    viewRatingBtn.addEventListener("click", () => {
        if (rating === 0)return;
        const ratingPopUp = createRatingPopUp(userId)

        popUp.querySelector(".driver-popup").classList.add("shifted");

        document.body.appendChild(ratingPopUp);
    })


    return popUp;
}


function createRatingPopUp(userId){

    const targetUser = states.users.find(u => u.user_id === userId);
    console.log(targetUser);
    // const user   Rat   

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class='rating-popup-container'>
            <div class='rating-popup'>
                <button class="close-rating-popup-button">
                    <img class="close-rating-popup-icon" src="assets/img/close.png">
                </button>
                <div class='rating-row'>
                    <h3>Ratings</h3>
                    <div class='rating-grid'>

                    </div>
                </div>

            </div>
        </div>
    `



    const popUp = wrapper.firstElementChild;
    const ratingGrid = popUp.querySelector(".rating-grid");

    if (targetUser && targetUser.ratings){
        targetUser.ratings.forEach(rating => {
            const ratingCard = createRatingCards(rating);
            console.log(ratingCard)
            ratingGrid.appendChild(ratingCard);
        })          
    }
    else{
        ratingGrid.innerHTML = `
            <p>No rating found for this user</p>
        `
    }

    popUp.querySelector(".close-rating-popup-button").addEventListener("click", () => {
        
        popUp.remove();

        document.querySelector(".driver-popup").classList.remove("shifted");
    });
    return popUp;
}

function createRatingCards(rating){
    const div = document.createElement("div");
    div.innerHTML = `
        <div class='rating-card'>
            <div class='rating-header'>
                <img class="rater-pfp" src="${rating.rater.profile_picture ?? defaultPfp}">
                <h4>${rating.rater.rater_username}</h4>
            </div>
            <div class='rating-info'>
                <h4>Rating Score</h4>
                <p>${rating.score} stars</p>
            </div>
        </div>
    `;
    
    return div.firstElementChild;
}

function createSignUpPopup(){
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class="signup-popup-section">
            <div class="signup-popup-container">
                <button class="close-popup-button">
                    <img class="close-popup-icon" src="assets/img/close.png">
                </button>
                <form class="sign-up-form" id="signUpForm">

                    <div>
                        <label>
                            Full Name
                        </label>
                        <input type="text" name="fullName" placeholder="John Doe">
                    </div>
                    
                    <div>
                        <label>
                            Username
                        </label>
                        <input type="text" name="username" placeholder="johndoe_123">
                    </div>
                    
        
                    <div>
                        <label>
                            Email
                        </label>
                        <input type="email" name="email" placeholder="your@email.com">
                    </div>

                    <div>
                        <label>
                            Phone Number
                        </label>
                        <input type="text" name="phoneNumber" placeholder="+123456789">
                    </div>
                    <p id="gender">Gender</p>
                    <div class="radio-group">
                        <label><input type="radio" name="gender" value="Male"> Male</label>
                        <label><input type="radio" name="gender" value="Female"> Female</label>
                    </div>

                    <div>
                        <label>
                            Date of Birth
                        </label>
                        <input type="date" name="dateOfBirth" > 
                    </div>

                    <div>
                        <label>
                            Password
                        </label>
                        <input type="password" name="password" >
                    </div>

                    <input type="hidden" name="role" value="Admin">

                    <button type="submit" id="signUpBtn" >Create Account</button>
                </form>
            </div>    
        </div>
    `
    const el = wrapper.firstElementChild;
    const signUpBtn = el.querySelector("#signUpBtn");

    const closeBtn = el.querySelector(".close-popup-button");
    closeBtn.addEventListener("click", () => {
        el.remove();
    });

    el.addEventListener("click", (e) => {
        if (e.target === el) {
            el.remove();
        }
    });

    const form = el.querySelector("#signUpForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        let plainData = {};
        formData.forEach((value,key) => {
            plainData[key] = value;
        });
        
        try{
            const response = await fetch('api/signup_api.php', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(plainData),
            });
            const data = await response.json();
            // console.log("Admin user created:", data);

            if (response.ok){
                // alert("Admin user created successfully!");
                getAllUsers();
                el.remove();
            }
        }
        catch(err){
            console.error("Error creating admin user:", err);
        }
    });


    return wrapper.firstElementChild;
}

const addAdminBtn = document.getElementById("add-admin-user-btn");
addAdminBtn.addEventListener("click", () => {
    const signUpPopUp = createSignUpPopup();
    document.body.appendChild(signUpPopUp);
});
// states.users.forEach(user => {
//     console.log(user);
// })
getAllUsers();
// console.log(states.users);
