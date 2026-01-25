let states = {
    totalUsers:null,
    totalCo2: null,
    totalReports: null,
    totalRides: null,
    admins: null,
    drivers: null,
    passengers: null,
    bannedUsers: null
};

const totalUsersEl = document.getElementById("totalUsers");
const totalCo2El = document.getElementById("totalCo2");
const totalReportsEl = document.getElementById("pendingReports");
const totalRidesEl = document.getElementById("totalRides");
const adminsEl = document.getElementById("adminCount");
const driversEl = document.getElementById("driverCount");
const passengersEl = document.getElementById("passengerCount");
const bannedUsersEl = document.getElementById("bannedCount");

function fetchOverviewStats(){
    console.log("Fetching overview stats...");
    return fetch("api/overview_api.php")
        .then(response => response.json())
        .then(data => {
            console.log("Overview data: ", data);

            states.totalUsers = data.total_users;
            states.totalCo2 = data.total_co2_saved;
            states.totalReports = data.pending_reports;
            states.totalRides = data.total_rides;
            states.admins = data.admins;
            states.drivers = data.drivers;
            states.passengers = data.passengers;
            states.bannedUsers = data.banned_users;
        });
}

async function init(){
    await Promise.all([
        fetchOverviewStats()
    ]);
    console.log("States after fetch: ", states);
    console.log(states.totalUsers)
    totalUsersEl.textContent = states.totalUsers;
    totalCo2El.textContent = states.totalCo2;
    totalReportsEl.textContent = states.totalReports;
    totalRidesEl.textContent = states.totalRides;
    adminsEl.textContent = states.admins;
    driversEl.textContent = states.drivers;
    passengersEl.textContent = states.passengers;
    bannedUsersEl.textContent = states.bannedUsers;
}

init();
