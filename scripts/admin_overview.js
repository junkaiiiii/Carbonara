let states = {
    totalUsers: null,
    totalCo2: null,
    totalReports: null,
    totalRides: null,
    admins: null,
    drivers: null,
    passengers: null,
    bannedUsers: null,
    leaderboardUsers: []
};

const totalUsersEl = document.getElementById("totalUsers");
const totalCo2El = document.getElementById("totalCo2");
const totalReportsEl = document.getElementById("pendingReports");
const totalRidesEl = document.getElementById("totalRides");
const adminsEl = document.getElementById("adminCount");
const driversEl = document.getElementById("driverCount");
const passengersEl = document.getElementById("passengerCount");
const bannedUsersEl = document.getElementById("bannedCount");
const leaderboardListEl = document.getElementById("leaderboardList");

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

function fetchLeaderboard(){
    console.log("Fetching leaderboard...");
    return fetch('api/co2_api.php?mode=ranking')
        .then(response => {
            console.log("Leaderboard response status:", response.status);
            return response.json();
        })
        .then(data => {
            console.log("Leaderboard full data received: ", data);
            console.log("Data is array:", Array.isArray(data));
            console.log("Data length:", data ? data.length : 0);
            
            if (Array.isArray(data) && data.length > 0) {
                // Get top 3 users for the dashboard
                states.leaderboardUsers = data.slice(0, 3);
                console.log("Top 3 users stored:", states.leaderboardUsers);
            } else {
                console.warn("No valid leaderboard data received");
                states.leaderboardUsers = [];
            }
        })
        .catch(error => {
            console.error("Leaderboard fetch error:", error);
            states.leaderboardUsers = [];
        });
}

function createLeaderboardItem(user, index) {
    const ranking = index + 1;
    const div = document.createElement('div');
    div.className = `leaderboard-item rank-${ranking}`;
    
    div.innerHTML = `
        <div class="rank-badge">#${ranking}</div>
        <div class="leaderboard-user-info">
            <p class="leaderboard-username">${user.username || 'Unknown'}</p>
            <p class="leaderboard-role">${user.role || 'User'}</p>
        </div>
        <div class="leaderboard-co2">
            <p class="co2-value">${user.saved_co2 || '0'}</p>
            <p class="co2-unit">kg CO2</p>
        </div>
    `;
    
    return div;
}

function renderLeaderboard() {
    console.log("=== Starting leaderboard render ===");
    console.log("Leaderboard element exists:", !!leaderboardListEl);
    console.log("Leaderboard users:", states.leaderboardUsers);
    
    if (!leaderboardListEl) {
        console.error("Leaderboard element not found!");
        return;
    }
    
    leaderboardListEl.innerHTML = '';
    
    if (!states.leaderboardUsers || states.leaderboardUsers.length === 0) {
        console.log("No leaderboard data - showing empty state");
        leaderboardListEl.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #9ca3af;">
                <p style="margin: 0;">No leaderboard data available yet</p>
            </div>
        `;
        return;
    }
    
    console.log(`Rendering ${states.leaderboardUsers.length} leaderboard items`);
    
    states.leaderboardUsers.forEach((user, index) => {
        console.log(`Creating item ${index + 1}:`, user);
        const item = createLeaderboardItem(user, index);
        leaderboardListEl.appendChild(item);
    });
    
    console.log("Leaderboard HTML after render:", leaderboardListEl.innerHTML.substring(0, 200));
    console.log("=== Leaderboard render complete ===");
}

async function init(){
    console.log("=== Initializing admin overview ===");
    
    try {
        await Promise.all([
            fetchOverviewStats(),
            fetchLeaderboard()
        ]);
        
        console.log("All data fetched. Current states:", states);
        
        // Update overview stats
        if (totalUsersEl) totalUsersEl.textContent = states.totalUsers || '0';
        if (totalCo2El) totalCo2El.textContent = states.totalCo2 || '0';
        if (totalReportsEl) totalReportsEl.textContent = states.totalReports || '0';
        if (totalRidesEl) totalRidesEl.textContent = states.totalRides || '0';
        if (adminsEl) adminsEl.textContent = states.admins || '0';
        if (driversEl) driversEl.textContent = states.drivers || '0';
        if (passengersEl) passengersEl.textContent = states.passengers || '0';
        if (bannedUsersEl) bannedUsersEl.textContent = states.bannedUsers || '0';
        
        // Render leaderboard
        renderLeaderboard();
        
        console.log("=== Initialization complete ===");
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}