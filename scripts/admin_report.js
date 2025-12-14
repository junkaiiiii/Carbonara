const reportGrid = document.querySelector(".user-grid");

states = {
    reports : []
}

const createUserCard = (reporterUsername, reporterUrl, reporterEmail, receipantUsername, receipantUrl, receipantEmail, description, status, reportId) => {
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
                <div class="button"><button class="approve" data-id='${reportId}' data-email='${receipantEmail}'>Approve</button></div>
                <div class="button">
                    <button class="reject" data-id='${reportId}' data-email='${receipantEmail}'>Reject</button>
                </div>
            </div>
        </div>   
    `

    return div.firstElementChild;
}

function render(){
    let count = 0;
    reportGrid.innerHTML = '';
    states.reports.forEach(user => {
        // console.log(user.status.toLowerCase());
        const card = createUserCard(user.reporter_name,
                                    user.reporter_pfp ?? "assets/img/leaf.png",
                                    user.reporter_email,
                                    user.reported_name,
                                    user.reported_pfp ?? "assets/img/leaf.png",
                                    user.reported_email,
                                    user.description,
                                    user.status,
                                    user.report_id
        )
        reportGrid.appendChild(card);
        const reportCard = card;
        const reportStatus = card.querySelector('.status p');
        const reportOptions = (card.querySelector('.options'));  
        if (user.status === "Approved"){
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
            // card.querySelector(".approve").style.display = "none";
            reportOptions.style.display = "none";
            reportStatus.style.color = "red";
            reportStatus.style.borderColor = "red";
        }
        // reportCard.style.boxShadow = "var(--box-shadow)";
        count += 1;
    })
}

//Remember to make sure to change the status in users table

function approveReport(id, reportedEmail){
    fetch("api/reports_api.php", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            action: "approve",
            report_id : id
        })
    })
    .then(res => res.json())
    .then(data => {
        let index = states.reports.findIndex(report => report.report_id === id);
        if (index === -1)return;

        const report = states.reports[index];
        // console.log(report);
        report.status = "Approved";
        // states.reports.forEach(report => {
        //     console.log(report.status);
        // })
        // console.log(states.reports);
        states.reports.push(report);
        states.reports.splice(index,1);

        render();

        const approvedReports = states.reports.filter(report => {
            return report.reported_email === reportedEmail && 
            report.status === "Approved";
        })
        console.log(approvedReports);
        if (approvedReports.length > 2){
            console.log("am i here???");
            fetch("api/users_api.php", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    action: "Banned",
                    reported_email: reportedEmail
                })
            })
        }
    });


}

function rejectReport(id){
    fetch("api/reports_api.php", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            action: "reject",
            report_id : id
        })
    })
    .then(res => res.json())
    .then(data => {
        let index = states.reports.findIndex(report => report.report_id === id);
        if (index === -1)return;

        const report = states.reports[index];
        console.log(report);
        report.status = "Rejected";
        // states.reports.forEach(report => {
        //     console.log(report.status);
        // })
        // console.log(states.reports);
        states.reports.push(report);
        states.reports.splice(index,1);

        render();
    })

}

function unbanReport(id, reportedEmail){
    fetch("api/reports_api.php", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            action: "unban",
            report_id : id
        })
    })
    .then(res => res.json())
    .then(data => {
        let index = states.reports.findIndex(report => report.report_id === id);
        if (index === -1)return;

        const report = states.reports[index];
        console.log(report);
        report.status = "Pending";
        states.reports.forEach(report => {
            console.log(report.status);
        })
        console.log(states.reports);
        states.reports.push(report);
        states.reports.splice(index,1);

        render();
    });
    // fetch("api/users_api.php", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type":"application/json"
    //     },
    //     body: JSON.stringify({
    //         action: "Active",
    //         reported_email: reportedEmail
    //     })
    // })

}


function getAllReports(){
    fetch("api/reports_api.php")
        .then(response => response.json())
        .then(data => {
            states.reports = [];
            // console.log(data);
            data.forEach(report => {
                states.reports.push(report);
            })
            // console.log(states.reports);
            render();
        })
}

getAllReports();


//FILTERSSSS
const buttons = document.querySelectorAll("[data-filter]");
buttons.forEach(btn => {
    // getAllReports();
    btn.addEventListener("click", () => {
        // console.log(btn.dataset.filter);
        filter = btn.dataset.filter
        const cards = document.querySelectorAll(".user-card");
        cards.forEach(card => {
            // console.log(card);
            // console.log(card.dataset.status);
            
            const cardStatus = card.dataset.status
            console.log(filter, cardStatus);
            if (filter === "all" || filter === cardStatus){
                card.style.display = "block"
            }
            else{
                card.style.display = "none";
            }
        })
    })
})


reportGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("approve")){
        const reportId = e.target.dataset.id;
        const reportedEmail = e.target.dataset.email;
        approveReport(reportId, reportedEmail);
    }
    if(e.target.classList.contains("reject")){
        const reportId = e.target.dataset.id;
        const reportedEmail = e.target.dataset.email;
        rejectReport(reportId, reportedEmail);
    } 
})