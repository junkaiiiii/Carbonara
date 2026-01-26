let states = {
    rides : []
}

async function fetchAvailableRides(){
    await fetch("api/ride_api.php?mode=all")
    .then(response => response.json())
    .then(data => {
        data.forEach(ride => {
            // console.log(ride);
            states.rides.push(ride);
            // console.log(states.rides);
        });
        renderRides('all');
    })
}

function renderRides(filter = 'all') {
    const ridesGrid = document.getElementById('ridesGrid');
    
    const filteredRides = filter === 'all' ? states.rides : states.rides.filter(ride => ride.status === filter);
    
    ridesGrid.innerHTML = '';
    
    filteredRides.forEach(ride => {
        const rideCard = document.createElement('div');
        rideCard.className = 'ride-card';
        rideCard.innerHTML = `
            <div class="ride-header">
                <div class="ride-route">
                    <h3>${ride.origin_text} --> ${ride.destination_text}</h3>
                    <p class="ride-driver">Driver: ${ride.driver.name} (${ride.driver.phone})</p>
                </div>
                <div class="ride-actions">
                    <span class="status-badge ${ride.ride_status}">${ride.ride_status}</span>
                </div>
            </div>
            <div class="ride-details">
                <div class="ride-detail">
                    <span>${ride.departure_datetime}</span>
                </div>
                <div class="ride-detail">
                    <span>${ride.available_seats} seats available</span>
                </div>
                <div class="ride-detail-button">
                    <a href="admin_ride_details.php?id=${ride.ride_id}" style="text-decoration:none;">
                        <button class="view-ride-btn">View Ride</button>
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

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active');
            
            renderRides(button.dataset.filter);
        });
    });
    
    renderRides('all');
});

async function init(){
    await Promise.all([
        fetchAvailableRides()
    ]);

    console.log(states.rides);
}   
init();