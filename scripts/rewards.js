import { highlightNavBar } from "./app.js";

let states = {
    vouchers: [],
    visible_voucher_count: 4,
    badges: [],
    visible_badge_count: 4,
    points: 0
};

// DOM (Document Object Model)
// DOM (Document Object Model)
let voucherSection = document.getElementById("voucherSection");
let loadVoucherBtn = document.getElementById("loadVoucherBtn");
let badgeSection = document.getElementById("badgeSection");
let loadBadgeBtn = document.getElementById("loadBadgeBtn");
let point = document.getElementById("point");



// fetch functions
function fetchRewards() {
    console.log("Fetching rewards...") // debugging
    return fetch("api/reward_api.php?mode=all") // http request 
        .then(response => response.json()) // then waits for the fetch to be completed and converts json to js object
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
    return fetch("api/point_api.php") // fetch data
        .then(response => response.json()) // use json() to convert json to js object
        .then(data => {
            states.points = data; // use the object to replace the current data
        })
}

// General functions
function confirmRedeem(prize_id, prize_cost) { // pass in the prize id and cost 
    if (states.points < prize_cost) { // checks whether the user points is less than the cost 
        return false; // if yes return false => unsuccesful
    }

    fetch("api/redemption_api.php", { // else fetch redemption api
        method: "POST", // tell that we're sending data too using method POST
        headers: {
            "Content-Type": "application/json"// tells server we're using JSON data
        },
        body: JSON.stringify({ // converts js object to json string. (Body => the actual data being sent)
            prize_id: prize_id, // then js uses the data received and return the result
            cost: prize_cost
        })
    })
        .then(res => res.json()) // converts received response to json
        .then(data => console.log(data)) // if successfil log the response data
        .catch(error => console.error(error)); // otherwise log error 
    return true;
}

// components functions
function createRewardCard(reward, onConfirmPopUp, onConfirm) {
    console.log("rendering rewards: ", states.vouchers); // debugging 

    let buttonHTML = reward.redeemed === true ? // checks whether the reward is redeemed or not. If true, create a grey and unclickable button. if false, creates an active redeemable button
        `<button class="button" style="background-color:grey; cursor: not-allowed;" >
                Redeemed
            </button>` :
        `<button class="button" id="redeemButton">
                Redeem ${reward.prize_name.charAt(0).toUpperCase() + reward.prize_name.slice(1)} 
            </button>`;
        // gets the first letter of the prize name to be capitalized and get the rest of the string using /slice(1)

    let div = document.createElement("div"); // creates a div in memory 
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

    let el = div.firstElementChild; // gets the content inside the created div 
    let redeemButton = el.querySelector('#redeemButton'); // finds the button with id redeemButton inside el
    if (redeemButton) { // if exists (means that theres redeemButton id)
        redeemButton.addEventListener('click', () => { // when clicked run the following functions
            let popUp = onConfirmPopUp(reward, onConfirm); // creates a confirmation popup
            document.body.appendChild(popUp); //adds the popup to the page body
        });
    }


    return div.firstElementChild; // return the created card element
}

function createConfirmationPopUp(reward, onConfirm) {
    let div = document.createElement('div'); // creates a div in memory as usual
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

    let el = div.firstElementChild; // store references to el

    let confirmBtn = el.querySelector("#confirmBtn"); // selects the confirmBtn id from el
    confirmBtn.addEventListener("click", () => { // when clicked

        if (!onConfirm(reward.prize_id, reward.points_required)) { // checks if user have enough points or not if false then runs this if block
            let popUp = el.querySelector('.confirm-container');
            popUp.innerHTML =
                `<p>Sorry You Dont Have Enough Points</p>
            <button class="button" id="quitBtn"  background-color:red;">Back</button>`;

            let quitBtn = el.querySelector("#quitBtn"); // selects the quitBtn id inside el and when clicked remove el which is the popup
            quitBtn.addEventListener("click", () => {
                el.remove(); // removes the popup from the screen
            })
            return // stops the execution
        }


        let selectedReward;

        if (reward.prize_type === "voucher") { // searches vouchers that have the same prize id as the passed in id
            selectedReward = states.vouchers.find(voucher => voucher.prize_id === reward.prize_id); // .find() is an array method that finds the first matching element in an array
        } else if (reward.prize_type === "badge") {
            selectedReward = states.badges.find(badge => badge.prize_id === reward.prize_id);
        }

        if (selectedReward) { // if theres a matching id make it true so that the button becomes grey and disabled
            selectedReward.redeemed = true;
        }

        states.points -= reward.points_required; // deduct our points 

        renderPoints(); // render all the data again to refresh the page with new data
        renderBadges();
        renderVouchers();

        setTimeout(el.remove(), 0.3);
    });

    let rejectBtn = el.querySelector("#rejectBtn"); // finds the no button 
    rejectBtn.addEventListener("click", () => {
        el.remove(); // when clicked remove the popup
    })

    return div.firstElementChild; // returns the created popup element
}

//render functions
function renderVouchers() {
    console.log("rendering vouchers: ", states.vouchers); // debugging 
    voucherSection.innerHTML = ``; // makes the innerHTML so that the previous data wont remain

    for (let i = 0; i < Math.min(states.vouchers.length, states.visible_voucher_count); i++) { // chooses the min between the voucher length and visible count

        const voucherCard = createRewardCard(states.vouchers[i], createConfirmationPopUp, confirmRedeem); // create reward card based on index
        voucherSection.appendChild(voucherCard); // appends the created card to voucher section
    }

    console.log(states.visible_voucher_count, states.vouchers.length) // debugging
    loadVoucherBtn.style.display = states.visible_voucher_count >= states.vouchers.length ? 'none' : 'flex'; // if the visible count is more than the length of vouchers then change the disaply to none to hide it
}

function renderBadges() { // same process here
    console.log("rendering badges: ", states.badges);
    badgeSection.innerHTML = ``;

    for (let i = 0; i < Math.min(states.badges.length, states.visible_badge_count); i++) {

        const badgeCard = createRewardCard(states.badges[i], createConfirmationPopUp, confirmRedeem);
        badgeSection.appendChild(badgeCard);
    }

    loadBadgeBtn.style.display = states.visible_badge_count >= states.badges.length ? 'none' : 'flex';
}

function renderPoints() {
    console.log("rendering points: ", states.points); // logs current point for debugging purposes
    point.innerHTML = `${states.points} points`; // changes the innerHTML of point to whats stored in states
}


async function init() { // asynchronous operation
    // fetch functions
    await Promise.all([ // runs multiple promises simultaneously
        fetchRewards(),
        fetchPoints()
    ]);
    console.log("Finished fetching"); 
    console.log(states);

    // render functions
    renderPoints(); // then execute the functions after it
    renderVouchers();
    renderBadges();

    // general function
    highlightNavBar("rewards");

    // event listeners
    loadVoucherBtn.addEventListener('click', () => {
        states.visible_voucher_count += 4;
        renderVouchers();
    })

    loadBadgeBtn.addEventListener('click', () => {
        states.visible_badge_count += 4;
        renderBadges();
    })
}

init();