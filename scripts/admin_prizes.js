let states = {
    vouchers: [],
    badges: []
}

// REMINDERRRR JENSENNNN PUT THE BADGES ALSO LATER!!!

let addVoucherBtn = document.getElementById('addVoucherBtn');
let addBadgeBtn = document.getElementById('addBadgeBtn');

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
            <img class="voucher-img-size" src="assets/img/${reward.prize_image_url}" alt="">

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

function renderBadges(){
    badgeSection.innerHTML = ``;
    states.badges.forEach(badge => {
        const badgeCard = createRewardCard(badge);
        badgeSection.appendChild(badgeCard);
    });
}

function setupListeners(){
    addVoucherBtn.addEventListener('click', () => {
        const popUp = createPopUp("voucher");
        document.body.appendChild(popUp);
    });
    addBadgeBtn.addEventListener('click', () => {
        const popUp = createPopUp("badge");
        document.body.appendChild(popUp);
    })
}

function createPopUp(type){
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="popup-container">
            <div class="popup-content">
                <button class="close-popup-button">
                    <img class="close-popup-icon" src="assets/img/close.png">
                </button>

                <form class="popup-form" id="rewardForm">
                    <div class="form-group">
                        <label>Prize Name:</label>
                        <input type="text" id="prizeName" name="prize_name" required>
                    </div>
                    <div class="form-group">
                        <label>Points Required:</label>
                        <input type="number" id="pointsReq" name="points_required" required>
                    </div>
                    <div class="form-group">
                        <label>Stock Quantity:</label>
                        <input type="number" id="stock" name="stock" required>
                    </div>
                    <div class="form-group">
                        <label>Upload Prize Image:</label>
                        <input type="file" id="prizeImg" name="prize_image_url" required>
                        <div class="image-preview" id="imagePreview"></div>
                    </div>  
                    
                    <input type="hidden" name="prize_type" value="${type}">

                    <div class="form-actions">
                        <button type="button" class="cancel-button">Cancel</button>
                        <button type="submit" class="submit-button">Add Prize</button>
                    </div>
                </form>

            </div>
        </div>
    `;

    const popUp = wrapper.firstElementChild;

    const closeBtn = popUp.querySelector('.close-popup-button');
    closeBtn.addEventListener('click', () => {
        popUp.remove();
    })

    const cancelBtn = popUp.querySelector('.cancel-button');
    cancelBtn.addEventListener('click', () => {
        popUp.remove(); 
    })

    popUp.addEventListener('click', (e) => {
        if (e.target === popUp) {
            popUp.remove();
        }
    });

    //image preview
    const imageInput = popUp.querySelector('#prizeImg');
    const imagePreview = popUp.querySelector('#imagePreview');
    //image in html is using base64 encoding
    //use change event listener when user selects file
    //use index 0 to get first file 
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 300px; border-radius: 8px; margin-top: 10px;">
                `;
            };
            //converts binary to base64Url
            reader.readAsDataURL(file);
        }
    });    
    const form = popUp.querySelector('#rewardForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        //collects values from form
        const formData = new FormData(form);

        try{
            const response = await fetch('api/reward_api.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok){
                //re-render again :D
                console.log("Successfully added reward: ", result);
                popUp.remove();
                states.vouchers = [];
                states.badges = [];
                await fetchRewards();
                renderVouchers();
                renderBadges();
            }
            else{
                console.log("Failed to add reward: ", result.message);
            }
        }
        catch(error){
            console.error("Error adding reward: ", error);
        }
    })


    return popUp;
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
    renderBadges();

    setupListeners();
    // event listeners
    // loadVoucherBtn.addEventListener('click', ()=> {
    //     states.visible_voucher_count += 4;
    //     renderVouchers();
    // })
}

init();