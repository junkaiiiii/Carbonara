const userGrid = document.querySelector(".user-grid");
let states = {
    users : [
                {
                    username : "Rebooted",
                    userRole : "driver",
                    rating : 4.8,
                    dateJoined : "Nov 10, 2025",
                    co2Saved : "145.5kg",
                    totalRides : 42,
                    email : "jensen@gmail.com",
                    phoneNum : "0123456789",
                    pfpUrl : "./images/PLUS ULTRA.jpg"
                },
                {
                    username : "LLENN",
                    userRole : "passenger",
                    rating : 4.1,
                    dateJoined : "Oct 1, 2025",
                    co2Saved : "35kg",
                    totalRides : 39,
                    email : "junkainoob@gmail.com",
                    phoneNum : "0198358819",
                    pfpUrl : "./images/PLUS ULTRA.jpg"
                },    
                {
                    username : "ENG",
                    userRole : "driver",
                    rating : 1.3,
                    dateJoined : "Jan 21, 2025",
                    co2Saved : "90.5kg",
                    totalRides : 60,
                    email : "ENGG@gmail.com",
                    phoneNum : "018748921",
                    pfpUrl : "./images/PLUS ULTRA.jpg"
                }
        ]
}


const createUserCard = (username, userRole, rating, dateJoined, co2Saved, totalRides, email, phoneNum, pfp_img) => {
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
                    <p>Total Rides</p>
                    <h3>${totalRides}</h3>                    
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

userGrid.innerHTML = "";

states.users.forEach(user => {
    const card = createUserCard(user.username,
                                user.userRole,
                                user.rating,
                                user.dateJoined,
                                user.co2Saved,
                                user.totalRides, 
                                user.email,
                                user.phoneNum,
                                user.pfpUrl);
    userGrid.appendChild(card)
})

const cardUsers = document.querySelectorAll(".card-username");
const searchText = document.getElementById("search-text");

searchText.addEventListener("keyup", () => {
    let currText = (searchText.value.toLowerCase());
    userGrid.innerHTML = '';

    const filteredUsers = states.users.filter(user => {
        return user.username.toLowerCase().includes(currText)
    });
    console.log(filteredUsers);

    if (filteredUsers.length !==0){
        console.log("AM I HERE")
        filteredUsers.forEach(user => {
            const card = createUserCard(user.username,
                                        user.userRole,
                                        user.rating,
                                        user.dateJoined,
                                        user.co2Saved,
                                        user.totalRides, 
                                        user.email,
                                        user.phoneNum,
                                        user.pfpUrl);
            userGrid.appendChild(card);
        });
    }
    else{
        console.log("GAY")
    }
});
