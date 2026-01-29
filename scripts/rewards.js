import { highlightNavBar } from "./app.js";

let states = {
    vouchers: [],
    visible_voucher_count: 4,
    badges: [],
    visible_badge_count: 4,
    points: 0
};

// DOM
let voucherSection = document.getElementById("voucherSection");
let loadVoucherBtn = document.getElementById("loadVoucherBtn");
let badgeSection = document.getElementById("badgeSection");
let loadBadgeBtn = document.getElementById("loadBadgeBtn");
let point = document.getElementById("point");



// fetch functions
function fetchRewards() {
    console.log("Fetching rewards...")
    return fetch("api/reward_api.php?mode=all")
        .then(response => response.json())
        .then(data => {

            data.forEach(prize => {
                if (prize.prize_type === "voucher") {
                    states.vouchers.push(prize);
                } else {
                    states.badges.push(prize);
                }
            });

        })
};

function fetchPoints() {
    console.log("Fetching points...");
    return fetch("api/point_api.php")
        .then(response => response.json())
        .then(data => {
            states.points = data;
        })
}

// General functions
function confirmRedeem(prize_id, prize_cost) {
    if (states.points < prize_cost) {
        return false;
    }

    fetch("api/redemption_api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prize_id: prize_id,
            cost: prize_cost
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    return true;
}

// components functions
function createRewardCard(reward, onConfirmPopUp, onConfirm) {
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
            <img class="voucher-img-size" src="assets/img/${reward.prize_image_url}" alt="">

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
    if (redeemButton) {
        redeemButton.addEventListener('click', () => {
            let popUp = onConfirmPopUp(reward, onConfirm);
            document.body.appendChild(popUp);
        });
    }


    return div.firstElementChild;
}

function createConfirmationPopUp(reward, onConfirm) {
    let div = document.createElement('div');
    div.innerHTML = `
        <div class="confirm-bg">
            <div class="confirm-container">
                <p>Do You Sure You want to Redeem ${reward.prize_name}?</p>
                <div style="display:flex;">
                    <button class="button" id="rejectBtn" style="flex:1; background-color:red;">No</button>
                    <button class="button" id="confirmBtn" style="flex:1;">Yes</button>
                </div>
            </div>
        </div>
    `;

    let el = div.firstElementChild;

    let confirmBtn = el.querySelector("#confirmBtn");
    confirmBtn.addEventListener("click", () => {

        if (!onConfirm(reward.prize_id, reward.points_required)) {
            let popUp = el.querySelector('.confirm-container');
            popUp.innerHTML =
                `<p>Sorry You Dont Have Enough Points</p>
             <button class="button" id="quitBtn"  background-color:red;">Back</button>`;

            let quitBtn = el.querySelector("#quitBtn");
            quitBtn.addEventListener("click", () => {
                el.remove();
            })
            return
        }


        let selectedReward;

        if (reward.prize_type === "voucher") {
            selectedReward = states.vouchers.find(voucher => voucher.prize_id === reward.prize_id);
        } else if (reward.prize_type === "badge") {
            selectedReward = states.badges.find(badge => badge.prize_id === reward.prize_id);
        }

        if (selectedReward) {
            selectedReward.redeemed = true;
        }

        states.points -= reward.points_required;

        renderPoints();
        renderBadges();
        renderVouchers();

        setTimeout(el.remove(), 0.3);
    });

    let rejectBtn = el.querySelector("#rejectBtn");
    rejectBtn.addEventListener("click", () => {
        el.remove();
    })

    return div.firstElementChild;
}

//render functions
function renderVouchers() {
    console.log("rendering vouchers: ", states.vouchers);
    voucherSection.innerHTML = ``;

    // states.vouchers.forEach(voucher => {
    //     const voucherCard = createVoucherCard(voucher);
    //     voucherSection.appendChild(voucherCard);
    // });

    for (let i = 0; i < Math.min(states.vouchers.length, states.visible_voucher_count); i++) {

        const voucherCard = createRewardCard(states.vouchers[i], createConfirmationPopUp, confirmRedeem);
        voucherSection.appendChild(voucherCard);
    }

    console.log(states.visible_voucher_count, states.vouchers.length)
    loadVoucherBtn.style.display = states.visible_voucher_count >= states.vouchers.length ? 'none' : 'flex';
}

function renderBadges() {
    console.log("rendering badges: ", states.badges);
    badgeSection.innerHTML = ``;

    // states.badges.forEach(badge => {
    //     const badgeCard = createbadgeCard(badge);
    //     badgeSection.appendChild(badgeCard);
    // });

    for (let i = 0; i < Math.min(states.badges.length, states.visible_badge_count); i++) {

        const badgeCard = createRewardCard(states.badges[i], createConfirmationPopUp, confirmRedeem);
        badgeSection.appendChild(badgeCard);
    }

    loadBadgeBtn.style.display = states.visible_badge_count >= states.badges.length ? 'none' : 'flex';
}

function renderPoints() {
    console.log("rendering points: ", states.points);
    point.innerHTML = `${states.points} points`;
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