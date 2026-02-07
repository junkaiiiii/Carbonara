import { highlightNavBar  } from "./app.js";

let states = {
    vouchers: [],
    visible_voucher_count: 4, // shows only 4 vouchers initially
    badges: [],
    visible_badge_count: 4,
    points: 0
};

//references
let voucherSection = document.getElementById("voucher-list");
let loadVoucherBtn = document.getElementById("loadVoucherBtn");
let badgeSection = document.getElementById("badge-list");
let loadBadgeBtn = document.getElementById("loadBadgeBtn");
let point = document.getElementById("points-container");

//fetching rewards from the server
async function fetchRewards(){
    console.log("Fetching rewards...");

    try{
        const response = await fetch("api/inventory_api.php?mode=all"); // HTTP GET request with mode=all parameter and gets json 
        const data = await response.json(); // converts json to js block

        console.log("Received data: ", data);

        data.forEach(prize => {
            if(prize.prize_type === "voucher"){
                states.vouchers.push(prize); // add to states.vouchers array
            }
            else{
                states.badges.push(prize); // otherwise add to states.badges array
            };
        })
    }
    catch(error){
        console.error("Error fetching data: ", error);
        showMessage("Failed to load vehicles", "delete"); // popup that shows successful/failure
    }
};

async function fetchPoints(){
    console.log("Fetching points...");
    try{
        const response = await fetch("api/point_api.php"); // fetch json data from point_api
        const data = await response.json(); // converts it to js block

        console.log("Received data: ", data); // debugging

        states.points = (typeof data === 'object' && data !== null) ? data.points : data; // checks whether the data is object and not null. if yes set states.points to data.points. || object is like "key:value"
    }
    catch(error){
        console.error("Error fetching points: ", error);
        showMessage("Failed to load vehicles", "delete");
    }
}

function createBadgeCard(item){
    const div = document.createElement('div'); // creates a div element
    
    const obtainedDate = new Date(item.redeemed_at).toLocaleDateString('en-GB', { // sets the date format to english british or smthing
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    div.innerHTML = `
        <div class="badge-container">
            <div class="center">
                <img class="badge-img-size" src="assets/img/${item.prize_image_url}" alt="Badge">
            </div>

            <div class="badge-content">
                <p>${item.prize_name}</p>

                <div class="group">
                    <p class="green-font">Obtained on ${obtainedDate}</p>
                </div>
            </div>

            <button class="button" id="viewBadgeBtn" onclick="openBadge('${item.prize_image_url}', '${item.prize_name}', '${obtainedDate}')">
                View Badge
            </button>
        </div>
    `;

    return div.firstElementChild; // returns only the code inside the created div
}

    //creating reward card
    function createRewardCard(item){
        const div = document.createElement('div');

        const redeemedDate = new Date(item.redeemed_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const redemptionId = item.redemption_id;

        div.innerHTML = `
            <div class="voucher-container">
                <img class="voucher-img-size" src="assets/img/${item.prize_image_url}" alt="Voucher">

                <div class="tng-voucher-content">
                    <div class="spaced-between">
                        <p>${item.prize_name}</p>
                        <p id="active" class="active-status">Active</p>
                    </div>

                    <div class="group">
                        <p class="green-font">Redeemed on ${redeemedDate}</p>
                    </div>
                </div>

                <button class="button" onclick="openVoucher('${item.prize_name}', '${redemptionId}')">
                    Reveal Code
                </button>
            </div>
        `;

        return div.firstElementChild;
    }

// update the page with new vouchers 
function renderVouchers(){
    console.log("Rendering vouchers: ", states.vouchers);
    if(!voucherSection) return; // if no vouchers exit this function
    voucherSection.innerHTML = ''; // set the innerHTML to '' so that previous data wont remain

    for (let i = 0; i < Math.min(states.vouchers.length, states.visible_voucher_count); i++){ //when i is less than the Min between(the length of the states.vouchers and the visible voucher count) e.g length is now 3 and visible is 4, we use length. we use the smaller one. 
        const voucherCard = createRewardCard(states.vouchers[i]); //creates the voucher card
        voucherSection.appendChild(voucherCard); // append it to voucher section
    }

    console.log(states.visible_voucher_count, states.vouchers.length);
    loadVoucherBtn.style.display = states.visible_voucher_count >= states.vouchers.length ? 'none' : 'flex'; // if visible voucher count is more than the length then we hide the show more button
}

//update the page with new badges
function renderBadges(){
    console.log("Rendering badges: ", states.badges); //debugging
    if(!badgeSection) return; // if no badges then exit function
    badgeSection.innerHTML = ''; // same approach with rendervouchers

    for (let i = 0; i < Math.min(states.badges.length, states.visible_badge_count); i++) {

        const badgeCard = createBadgeCard(states.badges[i]);
        badgeSection.appendChild(badgeCard);
    }

    loadBadgeBtn.style.display = states.visible_badge_count >= states.badges.length ? 'none' : 'flex';
}

//update the page with updated points
function renderPoints(){
    console.log("Rendering points: ", states.points);

    if(point){ // if the points container exist then chaneg the content to the current points thats saved in states
        point.innerHTML = `<img class="small-icons" src="assets/img/coin.png" alt="">
                            <p class="green-font">${states.points} points</p>`
                            ;
    }
}

async function init() {
    // fetch functions
    await Promise.all([ // wait until rewards and points are all fetched
        fetchRewards(),
        fetchPoints()
    ]);
    console.log("Finished fetching");
    console.log(states);

    // render functions
    renderPoints();
    renderVouchers();
    renderBadges();

    // general function
    highlightNavBar("inventory");

    // event listeners
    loadVoucherBtn.addEventListener('click', () => {
        states.visible_voucher_count += 4; // when users click the + 4 button, the visible vouchers becomes 4 -> 8 until its bigger than the length
        renderVouchers();
    })

    loadBadgeBtn?.addEventListener('click', () => {
        states.visible_badge_count += 4;
        renderBadges();
    });
}



init();