import { highlightNavBar  } from "./app.js";
import { createQrPopUp } from "./qr.js";

let states = {
    vouchers: [],
    visible_voucher_count: 4,
    badges: [],
    visible_badge_count: 4,
    points: 0
};

let voucherSection = document.getElementById("voucher-list");
let loadVoucherBtn = document.getElementById("loadVoucherBtn");
let badgeSection = document.getElementById("badge-list");
let loadBadgeBtn = document.getElementById("loadBadgeBtn");
let point = document.getElementById("points-container");

async function fetchRewards(){
    console.log("Fetching rewards...");

    try{
        const response = await fetch("api/inventory_api.php?mode=all");
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

        states.points = (typeof data === 'object' && data !== null) ? data.points : data;
    }
    catch(error){
        console.error("Error fetching points: ", error);
        showMessage("Failed to load vehicles", "delete");
    }
}

function createBadgeCard(item){
    const div = document.createElement('div');
    
    const obtainedDate = new Date(item.redeemed_at).toLocaleDateString('en-GB', {
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

    return div.firstElementChild;
}

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
                        <P id="activea" class="active-status">Active</P>
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

function renderVouchers(){
    console.log("Rendering vouchers: ", states.vouchers);
    if(!voucherSection) return;
    voucherSection.innerHTML = '';

    for (let i = 0; i < Math.min(states.vouchers.length, states.visible_voucher_count); i++){
        const voucherCard = createRewardCard(states.vouchers[i]);
        voucherSection.appendChild(voucherCard);
    }

    console.log(states.visible_voucher_count, states.vouchers.length);
    loadVoucherBtn.style.display = states.visible_voucher_count >= states.vouchers.length ? 'none' : 'flex';
}

function renderBadges(){
    console.log("Rendering badges: ", states.badges);
    if(!badgeSection) return;
    badgeSection.innerHTML = '';

    for (let i = 0; i < Math.min(states.badges.length, states.visible_badge_count); i++) {

        const badgeCard = createBadgeCard(states.badges[i]);
        badgeSection.appendChild(badgeCard);
    }

    loadBadgeBtn.style.display = states.visible_badge_count >= states.badges.length ? 'none' : 'flex';
}

function renderPoints(){
    console.log("Rendering points: ", states.points);

    if(point){
        point.innerHTML = `<img class="small-icons" src="assets/img/coin.png" alt="">
                            <p class="green-font">${states.points} points</p>`
                            ;
    }
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
    highlightNavBar("inventory");

    // event listeners
    loadVoucherBtn.addEventListener('click', () => {
        states.visible_voucher_count += 4;
        renderVouchers();
    })
}



init();