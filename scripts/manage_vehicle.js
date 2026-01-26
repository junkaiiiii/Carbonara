let states = {
    vehicles: []
};

const vehicleSection = document.getElementById('vehicleSection');

async function fetchVehicles() {
    console.log("Fetching vehicles...");
    try {
        const response = await fetch("api/vehicle_management_api.php");
        const data = await response.json();

        console.log("Received data: ", data);

        states.vehicles = data.vehicles || [];
    }
    catch (error) {
        console.error("Error fetching vehicles: ", error);
        showMessage("Failed to load vehicles", "delete");
    }
}

function createVehicleCard(vehicle) {
    let div = document.createElement("div");

    const registeredDate = new Date(vehicle.registered_at);
    const formattedDate = registeredDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    div.innerHTML = `
                <div class="car-details-container">
                    <img class="car-img" src="assets/img/kancil.jpg" alt="kancil">
                    <div class="container-content flex-column">
                        <div class="flex-spaced-between">
                            <div class="left-section">
                                <h3 class="bolded-content-title">${vehicle.brand} ${vehicle.manufactured_year}</h3>
                                <p class="bolded grey-content">License plate: ${vehicle.car_plate_number}</p>
                            </div>
                            <div class="right-section">
                                <p class="active">Active</p>
                            </div>
                        </div>

                        <div class="car-info-container">
                            <div class="car-details">
                                <div class="flex-spaced-between">
                                    <div class="flex-column">
                                        <p class="grey bolded">VEHICLE BRAND:</p> 
                                        <p class="obsidian bolded huge">${vehicle.brand || 'N/A'}</p>
                                    </div>
                                    <div class="flex-column">
                                        <p class="grey bolded">VEHICLE TYPE: </p>
                                        <p class="obsidian bolded huge text-right">${vehicle.type}</p>
                                    </div>
                                </div>
                                <div class="flex-spaced-between">
                                    <div class="flex-column">
                                        <p class="grey bolded">COLOUR: </p>
                                        <p class="obsidian bolded huge">${vehicle.color}</p>
                                    </div>
                                    <div class="flex-column">
                                        <p class="grey bolded">REGISTERED DATE: </p>
                                        <p class="obsidian bolded huge text-right">${formattedDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="stick-left button-container">
                            <div>
                                <button class="blue button" onclick="openEdit(
                                    'Registered at: ${vehicle.registered_at}',
                                    '${vehicle.vehicle_id}',
                                    '${vehicle.car_plate_number}',
                                    '${vehicle.color}',
                                    '${vehicle.type}',
                                    '${vehicle.brand || ''}',
                                    '${vehicle.manufactured_year || ''}'
                                )">Edit</button>
                            </div> 

                            <div>
                                <button class="red button" onclick="openDelete('${vehicle.vehicle_id}')">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

    return div.firstElementChild;
}

function renderVehicles() {
    console.log("Rendering vehicles: ", states.vehicles);
    vehicleSection.innerHTML = '';

    if (states.vehicles.length === 0) {
        vehicleSection.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No vehicles registered yet. Add one to get started!</p>';
        return;
    }

    else {
        states.vehicles.forEach(vehicle => {
            const card = createVehicleCard(vehicle);
            vehicleSection.appendChild(card);
        });
    }


}

// const dropdownTrigger = document.getElementById('dropdown-trigger');
// const profileDropdown = document.getElementById('profile-dropdown');

// dropdownTrigger.addEventListener('click', function(event) {
//     event.stopPropagation();
//     profileDropdown.classList.toggle('active');
// });

// document.addEventListener('click', function(event) {
//     if (!profileDropdown.contains(event.target)) {
//         profileDropdown.classList.remove('active');
//     }
// });

function openEdit(registered_at, id, plate, color, type, brand, manufactured_year) {
    document.getElementById('registeredTimeLabel').textContent =  registered_at;
    document.getElementById('edit_id').value = id;
    document.getElementById('edit_plate').value = plate;
    document.getElementById('edit_colour').value = color;
    document.getElementById('edit_type').value = type;
    document.getElementById('edit_brand').value = brand || '';
    document.getElementById('edit_year').value = manufactured_year || '';

    document.getElementById('overlay').classList.add('show');
    document.getElementById('edit').classList.add('show');
}

function closeEdit() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('edit').classList.remove('show');
}

function openAdd() {
    document.getElementById('overlay').classList.add('show');
    document.getElementById('add').classList.add('show');
}

function closeAdd() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('add').classList.remove('show');
}

let messageTimer;

function showMessage(text, type) {
    const notice = document.getElementById("notice");
    const progress = document.querySelector(".progress"); //class uses query Selector 
    const msg = document.getElementById("notice-msg");
    const icon = document.getElementById("notice-icon");

    clearTimeout(messageTimer);

    notice.classList.remove("success", "delete", "active"); // Reset the classes just in case

    void notice.offsetWidth; //lets the browser know that classes are removed

    msg.innerText = text;
    icon.innerText = type === "success" ? "✓" : "✘";
    const themeColor = type === "success" ? "#10b981" : "#ef4444";
    progress.style.setProperty('--bar-color', themeColor);

    notice.classList.add(type);
    notice.classList.add("active");

    messageTimer = setTimeout(() => {
        notice.classList.remove("active");
    }, 3000); // 3000 milliseconds 
}

let vehicleToDelete = null;

function openDelete(id) {
    vehicleToDelete = id;
    document.getElementById('overlay').classList.add('show');
    document.getElementById('deleteContainer').classList.add('show');
}

function closeDelete() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('deleteContainer').classList.remove('show');
}

document.getElementById('addVehicleForm').addEventListener('submit', async function (e) {
    e.preventDefault(); //stopping it from refreshing

    const data = {
        car_plate_number: document.getElementById('add_plate').value,
        color: document.getElementById('add_colour').value,
        type: document.getElementById('add_type').value,
        brand: document.getElementById('add_brand').value,
        year: parseInt(document.getElementById('add_year').value)
    };

    try {
        const response = await fetch('api/vehicle_management_api.php?mode=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            closeAdd();
            showMessage("Vehicles Added Successfully!", "success");

            await fetchVehicles();
            renderVehicles();

            document.getElementById('addVehicleForm').reset();
        }
        else {
            showMessage(result.error || "Failed to add vehicle", "delete");
        }
    }
    catch (error) {
        console.error("Error: ", error);
        showMessage("Connection Error", "delete");
    }
});

document.getElementById('confirmDeleteBtn').addEventListener('click', async function () {
    if (!vehicleToDelete) return;

    try {
        const response = await fetch('api/vehicle_management_api.php?mode=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicle_id: vehicleToDelete })
        });

        const result = await response.json();

        if (result.success) {
            closeDelete();
            showMessage("Vehicle Deleted!", "success");

            await fetchVehicles();
            renderVehicles();

            vehicleToDelete = null;
        }
        else {
            showMessage(result.error || "Failed to delete", "delete");
        }
    }
    catch (error) {
        console.error("Error: ", error);
        showMessage("Connection Error", "delete");
    }
});

document.getElementById('confirmEditBtn').addEventListener('click', async function (e) {
    e.preventDefault();

    const data = {
        vehicle_id: document.getElementById('edit_id').value,
        car_plate_number: document.getElementById('edit_plate').value,
        color: document.getElementById('edit_colour').value,
        type: document.getElementById('edit_type').value,
        brand: document.getElementById('edit_brand').value,
        year: document.getElementById('edit_year').value
    };

    try {
        const response = await fetch('api/vehicle_management_api.php?mode=update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            closeEdit();
            showMessage("Vehicle Updated Successfully!", "success");

            await fetchVehicles();
            renderVehicles();
        }
        else {
            showMessage(result.error || "Failed to updae", "delete");
        }
    }
    catch (error) {
        console.error("Error:", error);
        showMessage("Connection Error", "delete");
    }
});


async function init() {
    console.log("Initializing app...");

    await fetchVehicles();
    renderVehicles();

    console.log("App loaded!");
}

init();