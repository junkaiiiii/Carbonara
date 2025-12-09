const userGrid = document.querySelector(".user-grid");
let states = {
    users : []
}


const createUserCard = (username, userRole, rating, dateJoined, co2Saved, totalDistance, email, phoneNum, pfp_img) => {
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
                <a href="">View Profile</a>            
            </div>
        </div>
    `

    return div.firstElementChild;
}

function render(){
    const defaultPfp = "assets/img/leaf.png"
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
        const card = createUserCard(user.username,
                                    user.role,
                                    avgRating,
                                    user.created_at,
                                    co2Saved,
                                    totalDistance, 
                                    user.email,
                                    user.phone,
                                    user.profile_picture ?? defaultPfp);
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
            const card = createUserCard(user.username,
                                        user.role,
                                        avgRating,
                                        user.created_at,
                                        co2Saved,
                                        totalDistance, 
                                        user.email,
                                        user.phone,
                                        user.profile_picture ?? defaultPfp);
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
}

getAllUsers();
// console.log(states.users);
