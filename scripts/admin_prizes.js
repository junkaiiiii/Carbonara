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

    let updateStockBtnHTML = "";
    let stockValue = "";

    if (reward.prize_type === "voucher"){
        updateStockBtnHTML = `
            <button class="restock-btn">Update Stock</button>

        `;
        stockValue = `
            <p>Stock: ${reward.stock}</p>
        `
    }

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

                ${stockValue}
            </div>
            
            <div class="update-btn">
                ${updateStockBtnHTML}
                <button class="update-point-btn">Update Points</button>
            </div>
        </div>
    `;

    let el = div.firstElementChild;
    const updatePointBtn = el.querySelector(".update-point-btn");
    const restockBtn = el.querySelector(".restock-btn");
    const prizeId = reward.prize_id;
    const prizeName = reward.prize_name;
    if (restockBtn){
        restockBtn.addEventListener("click", () => {

            const currentStock = reward.stock;

            const popup = restockPopup(prizeId, prizeName, currentStock);
            document.body.appendChild(popup);
        });  
    }
    updatePointBtn.addEventListener("click", () => {
        const currentPoint = reward.points_required;
        const popup = updatePointsPopup(prizeId,prizeName,currentPoint);
        document.body.appendChild(popup);
    })

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
    let stockInputHTML = ''
    if (type === "voucher"){
        stockInputHTML = `
            <div class="form-group">
                <label>Stock Quantity:</label>
                <input type="number" id="stock" name="stock" required>
            </div>
        `;
    }
    else{
        stockInputHTML = `
            <div class="form-group">
                <input type="hidden" id="stock" name="stock" value="${null}"required>
            </div>
        `;
    }

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
                    ${stockInputHTML}
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

function restockPopup(prizeId, prizeName, currentStock){
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="popup-container">
            <div class="popup-content">
                <button class="close-popup-button">
                    <img class="close-popup-icon" src="assets/img/close.png">
                </button>

                <h2 style="margin-bottom: 10px;">Update Stock</h2>
                <p style="margin-bottom: 20px; color: #6b7280;">${prizeName}</p>

                <div class="form-group">
                    <label>Current Stock</label>
                    <input type="number" value="${currentStock}" disabled style="background-color: #f3f4f6; cursor: not-allowed;">
                </div>

                <div class="form-group">
                    <label>New Stock Quantity</label>
                    <input type="number" id="newStockInput" value="${currentStock}" min="0" placeholder="Enter new stock quantity">
                    <p id="stockError" style="color: #dc2626; font-size: 12px; margin-top: 5px; display: none;"></p>
                </div>

                <div class="form-actions">
                    <button type="button" class="cancel-button" id="cancelBtn">Cancel</button>
                    <button type="button" class="submit-button" id="updateStockBtn">Update Stock</button>
                </div>
            </div>
        </div>
    `;

    const popup = wrapper.firstElementChild;
    const cancelBtn = popup.querySelector(".cancel-button");
    const closeBtn = popup.querySelector(".close-popup-button");
    closeBtn.addEventListener("click", () => {
        popup.remove();
    });
    
    cancelBtn.addEventListener("click", () => {
        popup.remove();
    })
    

    popup.addEventListener('click', (e) => {
        if (e.target === popup){
            popup.remove();
        }
    })

    const updateBtn = popup.querySelector("#updateStockBtn");
    const newStockInput = popup.querySelector("#newStockInput");
    const stockErr = popup.querySelector("#stockError");

    updateBtn.addEventListener('click', async () => {
        const newStock = parseInt(newStockInput.value);
        if (newStock < 0){
            stockErr.textContent = "Please enter a valid stock quantity"
            stockErr.style.display ='block';
            return;
        }

        // stockErr.style.display = 'none';

        updateBtn.disabled = true;
        updateBtn.textContent = 'Updating...'

        try{
            console.log("TESTESTSTTTT");
            const response = await fetch("api/reward_api.php?mode=stock", {
                method: "PUT",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prize_id: prizeId,
                    new_stock: newStock
                })
            });

            const result = await response.json();

            if (response.ok){
                popup.remove();

                //re-render states
                states.vouchers = [];
                states.badges = [];
                await fetchRewards();
                renderVouchers();
                renderBadges();

            }
            else{
                stockErr.textContent = result.error || 'Failed to update stock';
                stockErr.style.display = 'block';
                updateBtn.disabled = false;
                updateBtn.textContent = 'Update Stock';
            }
        }
        catch(error){
            console.log("why am i here???")
            stockErr.textContent = 'Network error. Please try again.';
            stockErr.style.display = 'block';
            updateBtn.disabled = false;
            updateBtn.textContent = 'Update Stock';
        }
    })
    return popup;
}

function updatePointsPopup(prizeId,prizeName,prizePoints){
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="popup-container">
            <div class="popup-content">
                <button class="close-popup-button">
                    <img class="close-popup-icon" src="assets/img/close.png">
                </button>

                <h2 style="margin-bottom: 10px;">Update Points</h2>
                <p style="margin-bottom: 20px; color: #6b7280;">${prizeName}</p>

                <div class="form-group">
                    <label>Current Points</label>
                    <input type="number" value="${prizePoints}" disabled style="background-color: #f3f4f6; cursor: not-allowed;">
                </div>

                <div class="form-group">
                    <label>New Points Required</label>
                    <input type="number" id="newPointInput" value="${prizePoints}" min="0" placeholder="Enter new stock quantity">
                    <p id="stockError" style="color: #dc2626; font-size: 12px; margin-top: 5px; display: none;"></p>
                </div>

                <div class="form-actions">
                    <button type="button" class="cancel-button" id="cancelBtn">Cancel</button>
                    <button type="button" class="submit-button" id="updateStockBtn">Update Points</button>
                </div>
            </div>
        </div>
    `;

    const popup = wrapper.firstElementChild;
    const cancelBtn = popup.querySelector(".cancel-button");
    const closeBtn = popup.querySelector(".close-popup-button");
    closeBtn.addEventListener("click", () => {
        popup.remove();
    });
    
    cancelBtn.addEventListener("click", () => {
        popup.remove();
    })
    

    popup.addEventListener('click', (e) => {
        if (e.target === popup){
            popup.remove();
        }
    })

    const updateBtn = popup.querySelector("#updateStockBtn");
    const newPointInput = popup.querySelector("#newPointInput");
    const stockErr = popup.querySelector("#stockError");

    updateBtn.addEventListener('click', async () => {
        const newPoint = parseInt(newPointInput.value);
        if (newPoint < 0){
            stockErr.textContent = "Please enter a valid stock quantity"
            stockErr.style.display ='block';
            return;
        }

        // stockErr.style.display = 'none';

        updateBtn.disabled = true;
        updateBtn.textContent = 'Updating...'

        try{
            console.log("TESTESTSTTTT");
            const response = await fetch("api/reward_api.php?mode=points", {
                method: "PUT",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prize_id: prizeId,
                    new_point: newPoint
                })
            });

            const result = await response.json();

            if (response.ok){
                popup.remove();

                //re-render states
                states.vouchers = [];
                states.badges = [];
                await fetchRewards();
                renderVouchers();
                renderBadges();

            }
            else{
                stockErr.textContent = result.error || 'Failed to update stock';
                stockErr.style.display = 'block';
                updateBtn.disabled = false;
                updateBtn.textContent = 'Update Stock';
            }
        }
        catch(error){
            console.log("why am i here???")
            stockErr.textContent = 'Network error. Please try again.';
            stockErr.style.display = 'block';
            updateBtn.disabled = false;
            updateBtn.textContent = 'Update Stock';
        }
    })
    return popup;  
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