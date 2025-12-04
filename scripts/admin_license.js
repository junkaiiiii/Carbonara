const licenseGrid = document.querySelector('.user-grid');
const reviewedGrid = document.querySelector('.reviewed-grid');


states = {
    licenses : [],
    reviewed : [
                {
                    username : "Eng Hong Xuan",
                    licenseNum: "SP111",
                    status : "Approved" 
                },
                {
                    username : "Ian Gay",
                    licenseNum: "999AB",
                    status : "Rejected" 
                },                
                {
                    username : "Ivan Gex",
                    licenseNum: "PP902",
                    status : "Approved" 
                },
            ]
    
}

const createLicenseCard = (name, email, pfpImgUrl, status, licenseNum, licenseUrl) =>{
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
                <h3>License Number: ${licenseNum}</h3>
                <div class="license-img"><img src="${licenseUrl}"></div>
            </div>
            <div class="options">
                <div class="button"><button id="approve">Approve</button></div>
                <div class="button"><button id="reject">Reject</button></div>
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
            <p class="reviewed-num">${licenseNum}</p>
            <p class="reviewed-status">${status}</p>
        </div>
    `
    return div.firstElementChild;
}
function render(){
    console.log("Am i here???");
    licenseGrid.innerHTML = ``;
    console.log(states);
    states.licenses.forEach(license => {
        console.log("but im not here???");
        const card = createLicenseCard(license.user.name,
                                    license.user.email,
                                    license.user.pfp,
                                    license.license_status,
                                    "SJK732",
                                    license.license_img_url);
        console.log(card);
        licenseGrid.appendChild(card);
    })
}

reviewedGrid.innerHTML = `
    <div class="column-header">
        <p class="reviewed-user">User</p>
        <p class="reviewed-num">License Number</p>
        <p class="reviewed-status">Status</p>
    </div>
`;
let count = 1
states.reviewed.forEach(review => {
    console.log(count);    

    const card = createReviewedCard(review.username,
                                    review.licenseNum,
                                    review.status);
    reviewedGrid.appendChild(card);
    const reviewedStatus = document.querySelectorAll('.reviewed-status');  
    const reviewedRow = document.querySelectorAll('.reviewed-row');
    // 
    if (review.status === "Approved"){
        reviewedStatus[count].style.color = 'rgba(22, 91, 22, 1)';
        reviewedStatus[count].style.border = 'solid 2px rgb(38, 221, 38)';
        reviewedRow[count-1].style.borderLeftColor = 'rgb(38, 221, 38)'
    }else{
        reviewedStatus[count].style.color = 'rgba(95, 25, 25, 1)';
        reviewedStatus[count].style.border = 'solid 2px rgba(246, 59, 59, 1)';  
        reviewedRow[count-1].style.borderLeftColor = 'rgba(246, 59, 59, 1)' 
    }
    console.log(reviewedRow[count-1].style.borderLeftColor);
    // console.log(reviewedStatus[count].style);
    count += 1;
})
// states.reviewed.forEach(review => {
//     if (review.status === "Approved"){
//         console.log("test");
//         console.log(document.getElementsByClassName(".reviewed-status"));
//     }
// })


const getAllPendLicens = () => {
    fetch("api/license.php")
        .then(response => response.json())
        .then(data => {
            states.license = [];

            data.forEach(license => {
                console.log(license);
                if (license.license_status === "Pending"){
                    console.log("HELLOWW??");
                    states.licenses.push(license);
                    console.log(states.license);
                }
            })
            console.log("AM I HERE???");
            render();
        })
}
getAllPendLicens();