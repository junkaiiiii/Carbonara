let states = {
    vouchers: [],
    badges: []
}

let voucherSection = document.getElementById('voucherSection');
let badgeSection = document.getElementById('badgeSection');

// fetch functions
function fetchRewards(){
    console.log("Fetching rewards...")
    return fetch("api/reward_api.php?mode=admin_all")
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

// components functions
function createRewardCard(reward){
    console.log("rendering rewards: ", states.vouchers);

    // let buttonHTML = reward.redeemed === true ? 
    //         `<button class="button" style="background-color:grey; cursor: not-allowed;" >
    //             Redeemed
    //         </button>` :
    //         `<button class="button" id="redeemButton">
    //             Redeem ${reward.prize_name.charAt(0).toUpperCase() + reward.prize_name.slice(1)}
    //         </button>`;

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
        </div>
    `;

    let el = div.firstElementChild;


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
    
    states.vouchers.forEach(voucher => {
        // console.log("testtest");
        const voucherCard = createRewardCard(voucher);
        // console.log(voucherCard);
        voucherSection.appendChild(voucherCard);
    })

    

    // console.log(states.visible_voucher_count,states.vouchers.length )
    // loadVoucherBtn.style.display = states.visible_voucher_count >= states.vouchers.length ? 'none' : 'flex';
}




async function init(){
    // fetch functions
    await Promise.all([
        fetchRewards(),
    ]);
    console.log("Finished fetching");
    console.log(states);

    // render functions
    renderVouchers();
    // renderBadges();

    // event listeners
    // loadVoucherBtn.addEventListener('click', ()=> {
    //     states.visible_voucher_count += 4;
    //     renderVouchers();
    // })
}

init();