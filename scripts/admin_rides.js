let states = {
    rides : [] //Array to store all rides' data
}

// Fetch all the data regardless of ride's status
async function fetchAvailableRides(){
    await fetch("api/ride_api.php?mode=all")
    .then(response => response.json())
    .then(data => {
        data.forEach(ride => {
            console.log('Ride status:', ride.ride_status, 'Type:', typeof ride.ride_status);
            states.rides.push(ride);
        });
        renderRides('all');
    })
}

// Display rides abased on filters
function renderRides(filter = 'all') {
    const ridesGrid = document.getElementById('ridesGrid');
    
    const normalizedFilter = filter.toLowerCase().trim();
    
    console.log('Filtering by:', normalizedFilter);
    console.log('Total rides:', states.rides.length);
    
    //Filter rides based on all, if not "all" then show other filtered rides
    const filteredRides = normalizedFilter === 'all' 
        ? states.rides 
        : states.rides.filter(ride => {
            const rideStatus = ride.ride_status ? ride.ride_status.toLowerCase().trim() : '';
            console.log('Comparing:', rideStatus, '===', normalizedFilter, ':', rideStatus === normalizedFilter);
            return rideStatus === normalizedFilter;
        });
    
    console.log('Filtered rides:', filteredRides.length);
    
    ridesGrid.innerHTML = '';
    
    //Creates new div for card
    filteredRides.forEach(ride => {
        const rideCard = document.createElement('div');
        rideCard.className = 'ride-card';
        
        const normalizedStatus = ride.ride_status ? ride.ride_status.toLowerCase().trim() : 'unknown';
        
        rideCard.innerHTML = `
            <div class="ride-header">
                <div class="ride-route">
                    <h3>📍${ride.origin_text} --> ${ride.destination_text}</h3>
                    <p class="ride-driver">👤Driver: ${ride.driver.name} <br> 📞(${ride.driver.phone})</p>
                </div>
                <div class="ride-actions">
                    <span class="status-badge ${normalizedStatus}">${normalizedStatus}</span>
                </div>
            </div>
            <div class="ride-details">
                <div class="ride-detail">
                    <span>📅${ride.departure_datetime}</span>
                </div>
                <div class="ride-detail">
                    <span>💺${ride.available_seats} seats available</span>
                </div>
                <div class="ride-detail-button">
                    <a href="admin_ride_details.php?id=${ride.ride_id}" style="text-decoration:none;">
                        <button class="view-ride-btn">View Ride Details</button>
                    </a>
                </div>
            </div>
        `;
        ridesGrid.appendChild(rideCard);
        console.log(ride.ride_id);
    });
}

//Current active filter from UI
function getCurrentFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.dataset.filter : 'all';
}

// Event listener to handle filter swithcing 
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active');
            
            renderRides(button.dataset.filter);
        });
    });
}

async function init(){
        fetchAvailableRides();

    console.log('Loaded rides:', states.rides);
    
    // Setup filter buttons after data is loaded
    setupFilterButtons();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init();
});