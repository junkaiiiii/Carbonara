import { highlightNavBar  } from "./app.js";

let states = {
    vouchers : [],
    badges : []
};

// DOM
let voucherSection = document.getElementById("voucerSection");

// fetch functions
function fetchRewards(){
    console.log("Fetching rewards")
    return fetch("api/reward_api.php?mode=all")
        .then(response => response.json())
        .then(data => {
            console.log("fetched rewards: ", data);
            states.rewards = data;
        })
};

// render functions
function renderRewards(){
    console.log("rendering ")
}

async function init(){
    // fetch functions
    await Promise.all([
        fetchRewards()
    ]);
    console.log("Finished fetching");
    console.log(states);

    // render functions


    highlightNavBar("rewards");
}

init();