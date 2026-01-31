const licenseGrid = document.querySelector('.user-grid');
const reviewedGrid = document.querySelector('.reviewed-grid');


states = {
    licenses : [],
    reviewed : []
    
}

const createLicenseCard = (name, email, pfpImgUrl, status, licenseNum, licenseUrl, licenseId) =>{
    console.log(pfpImgUrl);
    console.log(licenseUrl);
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="user-card">
            <div class="user">
                <div class="pfp"><img class="card-pfp-img" src="${pfpImgUrl}"></div>
                <div class="username">
                    <h3>${name}</h3>
                    <p>${email}</p>
                </div>
                <div class="status"><p>${status}</p> </div>
            </div>
            <div class="license">
                <div class="license-img"><img src="${licenseUrl}"></div>
            </div>
            <div class="options">
                <div class="button"><button class="approve" data-id='${licenseId}'>Approve</button></div>
                <div class="button"><button class="reject" data-id='${licenseId}'>Reject</button></div>
            </div>
        </div>
    `

    return div.firstElementChild;
}

const createReviewedCard = (name, licenseNum, status) => {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="reviewed-row">
            <p class="reviewed-user">${name}</p>

            <p class="reviewed-status">${status}</p>
        </div>
    `
    return div.firstElementChild;
}



function render(){
    console.log("Am i here???");
    licenseGrid.innerHTML = ``;
    console.log(states);
    console.log(states.licenses.length);
    if (states.licenses.length === 0){
        console.log("I AM 0");
        licenseGrid.innerHTML = `
            <div class='no-state'>
                <p>No License Pending Request</p>
            </div>
        `;
    }
    else{
        console.log("Am i here?")
        states.licenses.forEach(license => {

            console.log("but im not here???");
            const card = createLicenseCard(license.user.name,
                                        license.user.email,
                                        license.user.pfp ?? "assets/img/leaf.png",
                                        license.license_status,
                                        "SJK732",
                                        license.license_img_url,
                                        license.license_id);
            // console.log(card);
            licenseGrid.appendChild(card);
        })
    }

    reviewedGrid.innerHTML = `
        <div class="column-header">
            <p class="reviewed-user">User</p>

            <p class="reviewed-status">Status</p>
        </div>
    `;
    let count = 1
    states.reviewed.forEach(review => {
        // console.log(count);    
        // console.log(review);
        const card = createReviewedCard(review.user.name,
                                        "Test",
                                        review.license_status);
        reviewedGrid.appendChild(card);
        const reviewedStatus = document.querySelectorAll('.reviewed-status');  
        const reviewedRow = document.querySelectorAll('.reviewed-row');
        // 
        if (review.license_status === "Approved"){
            reviewedStatus[count].style.color = 'rgba(22, 91, 22, 1)';
            reviewedStatus[count].style.border = 'solid 2px rgb(38, 221, 38)';
            reviewedRow[count-1].style.borderLeftColor = 'rgb(38, 221, 38)'
        }else{
            reviewedStatus[count].style.color = 'rgba(95, 25, 25, 1)';
            reviewedStatus[count].style.border = 'solid 2px rgba(246, 59, 59, 1)';  
            reviewedRow[count-1].style.borderLeftColor = 'rgba(246, 59, 59, 1)' 
        }
        // console.log(reviewedRow[count-1].style.borderLeftColor);
        // console.log(reviewedStatus[count].style);
        count += 1;
    })
}
const getAllPendLicens = () => {
    fetch("api/license_api.php")
        .then(response => response.json())
        .then(data => {
            states.licenses = [];
            states.reviewed = [];

            data.forEach(license => {

                if (license.license_status === "Pending"){
                    // console.log("HELLOWW??");
                    states.licenses.push(license);
                    // console.log(states.license);
                }
                else{
                    console.log(license);
                    states.reviewed.push(license);
                    // console.log("wtf am i doing");
                }
            })
            render();
        })
}

function approveLicense(id){
    fetch("api/license_api.php", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            action: "approve",
            license_id: id
        })
    })
    .then(response => response.json())
    .then(data => {
        let index = states.licenses.findIndex(license => license.license_id === id)
        if(index === -1) return;
        console.log("RAHHHHHHHHHHHHHHHH");

        const license = states.licenses[index];
        license.license_status = "Approved";

        states.reviewed.push(license);

        states.licenses.splice(index, 1); //remove one element at index 

        render()
    })


}

function rejectLicense(id){
    fetch("api/license_api.php", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            action: "reject",
            license_id: id
        })
    })
    .then(response => response.json())
    .then(data => {
        let index = states.licenses.findIndex(license => license.license_id === id)
        if(index === -1) return;
        console.log("RAHHHHHHHHHHHHHHHH");

        const license = states.licenses[index];
        license.license_status = "Rejected";

        states.reviewed.push(license);

        states.licenses.splice(index, 1); //remove one element at index 

        render()    
    })

}

getAllPendLicens();



licenseGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("approve")) {
        const licenseId = e.target.dataset.id;
        approveLicense(licenseId)
        // put your logic here
    }
    if (e.target.classList.contains("reject")) {
        const licenseId = e.target.dataset.id;
        rejectLicense(licenseId);
    }
});
