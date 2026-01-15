import { highlightNavBar  } from "./app.js";

let states = {
    vouchers : [],
    visible_voucher_count : 4,
    badges : [],
    visible_badge_count : 4,
    points : 0
};

// DOM
let voucherSection = document.getElementById("voucherSection");
let loadVoucherBtn = document.getElementById("loadVoucherBtn");
let badgeSection = document.getElementById("badgeSection");
let loadBadgeBtn = document.getElementById("loadBadgeBtn");
let point = document.getElementById("point");



// fetch functions
function fetchRewards(){
    console.log("Fetching rewards...")
    return fetch("api/reward_api.php?mode=all")
        .then(response => response.json())
        .then(data => {

            data.forEach(prize => {
                if (prize.prize_type === "voucher"){
                    states.vouchers.push(prize);
                } else {
                    states.badges.push(prize);
                }
            });
            
        })
};

function fetchPoints(){
    console.log("Fetching points...");
    return fetch("api/point_api.php")
        .then(response => response.json())
        .then(data => {
            states.points = data;
        })
}

// components functions
function createRewardCard(reward){
    console.log("rendering rewards: ", states.vouchers);

    let buttonHTML = reward.redeemed === true ? 
            `<button class="button" style="background-color:grey; cursor: not-allowed;" >
                Redeemed
            </button>` :
            `<button class="button" id="redeemButton">
                Redeem ${reward.prize_name.charAt(0).toUpperCase() + reward.prize_name.slice(1)}
            </button>`;

    let div = document.createElement("div");
    div.innerHTML = `
        <div class="voucher-container">
            <img class="voucher-img-size" src="assets/img/tng-pic.jpg" alt="">

            <div class="tng-voucher-content">
                <p>${reward.prize_name}</p>

                <div class="group">
                    <img class="small-icons" src="assets/img/coin.png" alt="">
                    <p class="green-font">${reward.points_required} points</p>
                </div>
            </div>

            ${buttonHTML}
        </div>
    `;

    let el = div.firstElementChild;
    let redeemButton = el.querySelector('#redeemButton');
    if (redeemButton){
        redeemButton.addEventListener('click', ()=> console.log(`Redeeming voucher ${voucher.prize_name}`));
    }

    return div.firstElementChild;
}

//render functions
function renderVouchers(){
    console.log("rendering vouchers: ", states.vouchers);
    voucherSection.innerHTML = ``;

    // states.vouchers.forEach(voucher => {
    //     const voucherCard = createVoucherCard(voucher);
    //     voucherSection.appendChild(voucherCard);
    // });
    
    for (let i=0; i<Math.min(states.vouchers.length, states.visible_voucher_count); i++){

        const voucherCard = createRewardCard(states.vouchers[i]);
        voucherSection.appendChild(voucherCard);
    }

    console.log(states.visible_voucher_count,states.vouchers.length )
    loadVoucherBtn.style.display = states.visible_voucher_count >= states.vouchers.length ? 'none' : 'flex';
}

function renderBadges(){
    console.log("rendering badges: ", states.badges);
    badgeSection.innerHTML = ``;

    // states.badges.forEach(badge => {
    //     const badgeCard = createbadgeCard(badge);
    //     badgeSection.appendChild(badgeCard);
    // });
    
    for (let i=0; i<Math.min(states.badges.length, states.visible_badge_count); i++){

        const badgeCard = createRewardCard(states.badges[i]);
        badgeSection.appendChild(badgeCard);
    }

    loadBadgeBtn.style.display = states.visible_badge_count >= states.badges.length ? 'none' : 'flex';
}

function renderPoints(){
    console.log("rendering points: ", states.points);
    point.innerHTML = `${states.points} points`;
}


async function init(){
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
    loadVoucherBtn.addEventListener('click', ()=> {
        states.visible_voucher_count += 4;
        renderVouchers();
    })
}

init();