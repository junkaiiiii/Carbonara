const ridesData = [
    {
        id: 1,
        from: "Putra Heights",
        to: "Bukit Jalil",
        driver: "John Lee",
        phone: "+6017-7493753",
        datetime: "Jan 01, 2026, 6.00 AM",
        seats: 3,
        status: "active"
    },
    {
        id: 2,
        from: "Petaling Jaya",
        to: "Bukit Jalil",
        driver: "Azim",
        phone: "+6011-32453753",
        datetime: "Jan 11, 2026, 6.30 AM",
        seats: 2,
        status: "completed"
    },
    {
        id: 3,
        from: "Puchong",
        to: "Bukit Jalil",
        driver: "Sarah",
        phone: "+6011-2342457",
        datetime: "Dec 25, 2025, 3.00 PM",
        seats: 1,
        status: "cancelled"
    }
];

function renderRides(filter = 'all') {
    const ridesGrid = document.getElementById('ridesGrid');
    
    const filteredRides = filter === 'all' 
        ? ridesData 
        : ridesData.filter(ride => ride.status === filter);
    
    ridesGrid.innerHTML = '';
    
    filteredRides.forEach(ride => {
        const rideCard = document.createElement('div');
        rideCard.className = 'ride-card';
        rideCard.innerHTML = `
            <div class="ride-header">
                <div class="ride-route">
                    <h3>${ride.from} --> ${ride.to}</h3>
                    <p class="ride-driver">Driver: ${ride.driver} (${ride.phone})</p>
                </div>
                <div class="ride-actions">
                    <span class="status-badge ${ride.status}">${ride.status}</span>
                    <button class="delete-btn" onclick="deleteRide(${ride.id})">
                        delete
                    </button>
                </div>
            </div>
            <div class="ride-details">
                <div class="ride-detail">
                    <span>${ride.datetime}</span>
                </div>
                <div class="ride-detail">
                    <span>${ride.seats} seats available</span>
                </div>
            </div>
        `;
        ridesGrid.appendChild(rideCard);
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