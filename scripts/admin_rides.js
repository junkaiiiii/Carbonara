let states = {
    rides : []
}

async function fetchAvailableRides(){
    await fetch("api/ride_api.php?mode=all")
    .then(response => response.json())
    .then(data => {
        data.forEach(ride => {
            // Debug: log the status to see what values we're getting
            console.log('Ride status:', ride.ride_status, 'Type:', typeof ride.ride_status);
            states.rides.push(ride);
        });
        renderRides('all');
    })
}

function renderRides(filter = 'all') {
    const ridesGrid = document.getElementById('ridesGrid');
    
    // Normalize the filter value to lowercase for comparison
    const normalizedFilter = filter.toLowerCase().trim();
    
    console.log('Filtering by:', normalizedFilter);
    console.log('Total rides:', states.rides.length);
    
    const filteredRides = normalizedFilter === 'all' 
        ? states.rides 
        : states.rides.filter(ride => {
            const rideStatus = ride.ride_status ? ride.ride_status.toLowerCase().trim() : '';
            console.log('Comparing:', rideStatus, '===', normalizedFilter, ':', rideStatus === normalizedFilter);
            return rideStatus === normalizedFilter;
        });
    
    console.log('Filtered rides:', filteredRides.length);
    
    ridesGrid.innerHTML = '';
    
    filteredRides.forEach(ride => {
        const rideCard = document.createElement('div');
        rideCard.className = 'ride-card';
        
        // Normalize status to lowercase and trim whitespace
        const normalizedStatus = ride.ride_status ? ride.ride_status.toLowerCase().trim() : 'unknown';
        
        rideCard.innerHTML = `
            <div class="ride-header">
                <div class="ride-route">
                    <h3>📍${ride.origin_text} --> ${ride.destination_text}</h3>
                    <p class="ride-driver">👤Driver: ${ride.driver.name} (${ride.driver.phone})</p>
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
        // const viewRideBtn = rideCard.querySelector('.view-ride-btn');
        // viewRideBtn.addEventListener('click', () => {
        //     window.location.href = `admin_ride_details.php?ride_id=${ride.ride_id}`;
        // });
    });
}

function deleteRide(rideId) {
  const index = ridesData.findIndex(ride => ride.id === rideId);
    if (index > -1) {
      ridesData.splice(index, 1);
      renderRides(getCurrentFilter());
    }
}


function getCurrentFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.dataset.filter : 'all';
}

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
    await Promise.all([
        fetchAvailableRides()
    ]);

    console.log('Loaded rides:', states.rides);
    
    // Setup filter buttons after data is loaded
    setupFilterButtons();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init();
});