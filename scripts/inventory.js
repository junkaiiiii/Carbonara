import { highlightNavBar  } from "./app.js";
import { createQrPopUp } from "./qr.js";

let states = {
    vouchers: [],
    visible_voucher_count: 4,
    badges: [],
    visible_badge_count: 4,
    points: 0
};

let voucherSection = document.getElementById("voucherSection");
let loadVoucherBtn = document.getElementById("loadVoucherBtn");
let badgeSection = document.getElementById("badgeSection");
let loadBadgeBtn = document.getElementById("loadBadgeBtn");
let point = document.getElementById("point");

async function fetchRewards(){
    console.log("Fetching rewards...");

    try{
        const response = await fetch("api/reward_api.php?mode=all");
        const data = await response.json();

        console.log("Received data: ", data);

        data.forEach(prize => {
            if(prize.prize_type === "voucher"){
                states.vouchers.push(prize); // adding multiple arrays
            }
            else{
                states.badges.push(prize);
            };
        })
    }
    catch(error){
        console.error("Error fetching data: ", error);
        showMessage("Failed to load vehicles", "delete");
    }
};

async function fetchPoints(){
    console.log("Fetching points...");
    try{
        const response = await fetch("api/point_api.php");
        const data = await response.json();

        console.log("Received data: ", data);

        states.points = data.points;
    }
    catch(error){
        console.error("Error fetching points: ", error);
        showMessage("Failed to load vehicles", "delete");
    }
}

function renderVouchers(){
    console.log("Rendering vouchers: ", states.vouchers);
    voucherSection.innerHTML = '';

    for (let i = 0; i < Math.min(states.vouchers.length, states.visible_voucher_count); i++){
        const voucherCard = createRewardCard();
        voucherSection.appendChild(voucherCard);
    }

    console.log(states.visible_voucher_count, states.vouchers.length);
    loadVoucherBtn.style.display = states.visible_voucher_count >= states.vouchers.length ? 'none' : 'flex';
}

function renderBadges(){
    console.log("Rendering badges: ", states.badges);
    badgeSection.innerHTML = '';

    for (let i = 0; i < Math.min(states.badges.length, states.visible_badge_count); i++) {

        const badgeCard = createRewardCard(states.badges[i], createConfirmationPopUp, confirmRedeem);
        badgeSection.appendChild(badgeCard);
    }

    loadBadgeBtn.style.display = states.visible_badge_count >= states.badges.length ? 'none' : 'flex';
}

function renderPoints(){
    console.log("Rendering points: ", states.points);
    points.innerHTML = `${states.points} points`;
}

async function init() {
    // fetch functions
    await Promise.all([
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
    highlightNavBar("rewards");

    // event listeners
    loadVoucherBtn.addEventListener('click', () => {
        states.visible_voucher_count += 4;
        renderVouchers();
    })
}



init();