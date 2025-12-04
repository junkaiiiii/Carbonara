const reportGrid = document.querySelector(".user-grid");

states = {
    users : [
        {
            reporter : "JUNKAI",
            reporterUrl : "./images/stableRonaldo.avif",
            reporterEmail : "junkaigay@gmail.com",
            receipant : "Jensen",
            receipantUrl : "./images/adc.jpg",
            receipantEmail : "IMISSHER@gmail.com",
            description : "Jensen sucks at driving cause hes bad",
            status : "Pending"
        },
        {
            reporter : "IANNNN",
            reporterUrl : "./images/stableRonaldo.avif",
            reporterEmail : "ianissssgay@gmail.com",
            receipant : "Jensen",
            receipantUrl : "./images/adc.jpg",
            receipantEmail : "IMISSHER@gmail.com",
            description : "I just reported for fun",
            status : "Banned"
        },        
        {
            reporter : "ENGGG",
            reporterUrl : "./images/stableRonaldo.avif",
            reporterEmail : "pokemonTrainer@gmail.com",
            receipant : "Ivan",
            receipantUrl : "./images/adc.jpg",
            receipantEmail : "ILOVVENEGGG@gmail.com",
            description : "I have a gf",
            status : "Resolved"
        },
    ]
}

const createUserCard = (reporterUsername, reporterUrl, reporterEmail, receipantUsername, receipantUrl, receipantEmail, description, status) => {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="user-card" data-status='${status.toLowerCase()}'>
            <div class="user">
                <div class="pfp"><img class="card-pfp-img" src="${reporterUrl}"></div>
                <div class="username">
                    <h3>${reporterUsername}</h3>
                    <p>${reporterEmail}</p>
                </div>
                <p class="arrow">➔</p>
                <div class="pfp"><img class="card-pfp-img" src="${receipantUrl}"></div>
                <div class="username">
                    <h3>${receipantUsername}</h3>
                    <p>${receipantEmail}</p>
                </div>
                <div class="status"><p>${status}</p> </div>
            </div>
            <div class="report">
                <h3>Reason of report</h3>
                <p>${description}</p>
            </div>
            <div class="options">
                <div class="button"><button id="approve">Approve</button></div>
                <div class="button"><button id="reject">Reject</button></div>
            </div>
        </div>   
    `

    return div.firstElementChild;
}


let count = 0;
reportGrid.innerHTML = '';
states.users.forEach(user => {
    const card = createUserCard(user.reporter,
                                user.reporterUrl,
                                user.reporterEmail,
                                user.receipant,
                                user.receipantUrl,
                                user.receipantEmail,
                                user.description,
                                user.status
    )
    reportGrid.appendChild(card);
    const reportCard = card;
    const reportStatus = card.querySelector('.status p');
    const reportOptions = (card.querySelector('.options'));  
    if (user.status === "Resolved"){
        reportCard.style.border = "solid 2px";
        reportCard.style.borderColor = 'rgb(38, 221, 38)';
        reportOptions.style.display = "none";
        reportStatus.style.color = "rgb(38, 221, 38)";
        reportStatus.style.borderColor = "rgb(38, 221, 38)";
    }
    else if (user.status === "Pending"){
        reportCard.style.border = "solid 2px";
        reportCard.style.borderColor = 'orange'; 

    }
    else{
        reportCard.style.border = "solid 2px";
        reportCard.style.borderColor = 'red';  
        reportOptions.style.display = "none";
        reportStatus.style.color = "red";
        reportStatus.style.borderColor = "red";
    }
    reportCard.style.boxShadow = "var(--box-shadow)";
    count += 1;
})

const cards = document.querySelectorAll(".user-card");
const buttons = document.querySelectorAll("[data-filter]");
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        console.log(btn.dataset.filter);
        filter = btn.dataset.filter
        cards.forEach(card => {
            const cardStatus = card.dataset.status
            if (filter === "all" || filter === cardStatus){
                card.style.display = "block"
            }
            else{
                card.style.display = "none";
            }
        })
    })
})

