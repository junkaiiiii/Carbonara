let states = {
    vehicles: []
};

const vehicleSection = document.getElementById('vehicleSection'); // create a constant (cant be reassigned) for vehicle section

async function fetchVehicles() { //makes function asynchronous using await 
    console.log("Fetching vehicles..."); // debug message
    try {
        const response = await fetch("api/vehicle_management_api.php"); // wait for this response to be fetched. php takes data from db and sends it back to js
        const data = await response.json(); // converts from JSON text to Js object

        console.log("Received data: ", data);

        states.vehicles = data.vehicles || []; //replaces the vehicles we defined in states to the data we obtained. if null then assign to empty array
    }
    catch (error) {
        console.error("Error fetching vehicles: ", error);
        showMessage("Failed to load vehicles", "delete");
    }
}

function createVehicleCard(vehicle) {
    let div = document.createElement("div"); // create a div element in memory. 

    const imagePath = vehicle.vehicle_image ? vehicle.vehicle_image : 'assets/img/kancil.jpg'; // checks whether vehicle has an image? if yes use it, if no use the default img

    const registeredDate = new Date(vehicle.registered_at); // create date object using the registered time 
    const formattedDate = registeredDate.toLocaleDateString('en-GB', { // British English format
        day: 'numeric', // e.g 24
        month: 'long', // e.g January
        year: 'numeric' //e.g 2026
    });

    // sets the HTML content for the div | ` => allow multi line strings and ${} for variables
    div.innerHTML = `
                <div class="car-details-container">
                    <img class="car-img" src="${imagePath}" alt="${vehicle.brand}">
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
                                    '${vehicle.manufactured_year || ''}',
                                    '${vehicle.vehicle_image || ""}'
                                )">Edit</button>
                            </div> 

                            <div>
                                <button class="red button" onclick="openDelete('${vehicle.vehicle_id}')">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `; // the value being passed in openEdit() has '' to prevent the code from breaking due to spaces or special character

    return div.firstElementChild; // send back the content without the created div
}

function renderVehicles() {
    console.log("Rendering vehicles: ", states.vehicles);
    vehicleSection.innerHTML = ''; // set it to an empty string so that the previous loaded data wont remain

    if (states.vehicles.length === 0) {
        vehicleSection.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No vehicles registered yet. Add one to get started!</p>';
        return;
    } // if none then return a message 

    else {
        states.vehicles.forEach(vehicle => { // passes every object of vehicles in the states.vehicles array
            const card = createVehicleCard(vehicle);
            vehicleSection.appendChild(card); // add card to the page
        });
    }
}

function openEdit(registered_at, id, plate, color, type, brand, manufactured_year, imagePath) { // pass in 7 parameters
    document.getElementById('registeredTimeLabel').textContent =  registered_at; // replace the texts with the passed in parameters
    document.getElementById('edit_id').value = id;
    document.getElementById('edit_plate').value = plate;
    document.getElementById('edit_colour').value = color;
    document.getElementById('edit_type').value = type;
    document.getElementById('edit_brand').value = brand || '';
    document.getElementById('edit_year').value = manufactured_year || '';

    const imgPreview = document.getElementById('current_edit_img'); // finds the img element in the edit form
    if(imagePath && imagePath !== 'null'){ // if exist and not null set the source to the imagePath to load it 
        imgPreview.src = imagePath;
        imgPreview.style.display = 'block'; // access its CSS display property and set it to visible 
    }
    else{
        imgPreview.style.display = 'none'; // else hide it 
    }

    document.getElementById('overlay').classList.add('show'); // add show class to the overlay class to make it appear since its hidden
    document.getElementById('edit').classList.add('show');
}

function closeEdit() {
    document.getElementById('overlay').classList.remove('show'); // remove the show class to make it hidden again
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

let messageTimer; // variable to store timeout ID 

function showMessage(text, type) {
    const notice = document.getElementById("notice");
    const progress = document.querySelector(".progress"); //class uses query Selector 
    const msg = document.getElementById("notice-msg");
    const icon = document.getElementById("notice-icon");

    clearTimeout(messageTimer); // cancel any existing timer

    notice.classList.remove("success", "delete", "active"); // Reset the classes just in case

    void notice.offsetWidth; //forces the browser to recalculate layout and discard value

    msg.innerText = text;
    icon.innerText = type === "success" ? "✓" : "✘"; // ternary operator 
    const themeColor = type === "success" ? "#10b981" : "#ef4444";
    progress.style.setProperty('--bar-color', themeColor); // custom CSS property so that we dont have to change the color manually like making several classes. we just assign the -- to themeColour

    notice.classList.add(type); /// this changes the font colour 
    notice.classList.add("active");

    messageTimer = setTimeout(() => { // after a specific amount of time, remove the active class so it will be hidden
        notice.classList.remove("active");
    }, 3000); // 3000 milliseconds 
}

let vehicleToDelete = null;

function openDelete(id) {
    vehicleToDelete = id; // store the id being passed in
    document.getElementById('overlay').classList.add('show');
    document.getElementById('deleteContainer').classList.add('show');
}

function closeDelete() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('deleteContainer').classList.remove('show');
}

document.getElementById('addVehicleForm').addEventListener('submit', async function (e) { // finds the form, listen for submit event, async function which recieves event object
    e.preventDefault(); //stopping it from refreshing since its the default behaviour when submitting

    //form data instead of json object

    const formData = new FormData(); // form data used. json cant hold file data but file data can hold file data and automatically formats them too
    formData.append('car_plate_number', document.getElementById('add_plate').value); // append adds a key-value pair to formData e.g (car_plate_number = "ABC123")
    formData.append('color', document.getElementById('add_colour').value);
    formData.append('type', document.getElementById('add_type').value);
    formData.append('brand', document.getElementById('add_brand').value);
    formData.append('year', parseInt(document.getElementById('add_year').value)); // converts string to integer

    const fileInput = document.getElementById('add_image'); // finds the file input element 
    if(fileInput.files[0]){ // selects the first image in the array but why [0] we send the object instead of the whole array
        formData.append('vehicle_image', fileInput.files[0]); 
    }

    // Content-Type removed since we;re not using json 

    try {
        const response = await fetch('api/vehicle_management_api.php?mode=add', {
            method: 'POST', // no need headers since formdata set Content-Type automatically
            body: formData // sends form data directly instead of using JSON.stringify() to encode back to json to send data back to PHP
        });

        const result = await response.json(); // wait for php response 

        if (result.success) {
            closeAdd();
            showMessage("Vehicle Added Successfully!", "success");

            await fetchVehicles(); // fetch new data from the database 
            renderVehicles(); // update the screen with new data

            document.getElementById('addVehicleForm').reset(); // resets the form
        }
        else {
            showMessage(result.error || "Failed to add vehicle", "delete");
        }
    }
    catch (error) { // error if it crashed
        console.error("Error: ", error);
        showMessage("Connection Error", "delete"); 
    }
});

document.getElementById('confirmDeleteBtn').addEventListener('click', async function (e) {
    if (!vehicleToDelete) { // check whether vehicle id exists
        return
    };

    try {
        const response = await fetch('api/vehicle_management_api.php?mode=delete', { // stores response
            method: 'POST', // use POST method
            headers: { 'Content-Type': 'application/json' }, // tell the server that we're using json
            body: JSON.stringify({ vehicle_id: vehicleToDelete }) // convert object to JSON string 
        });

        const result = await response.json(); // convert json to js object

        if (result.success) {
            closeDelete();
            showMessage("Vehicle Deleted!", "success");

            await fetchVehicles();
            renderVehicles();

            vehicleToDelete = null; // sets the vehicle to delete back to null 
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

    const formData = new FormData();
    formData.append('vehicle_id', document.getElementById('edit_id').value); // vehicle id is hidden
    formData.append('car_plate_number', document.getElementById('edit_plate').value);
    formData.append('color', document.getElementById('edit_colour').value);
    formData.append('type', document.getElementById('edit_type').value);
    formData.append('brand', document.getElementById('edit_brand').value);
    formData.append('year', document.getElementById('edit_year').value);

    const fileInput = document.getElementById('edit_image');
    if(fileInput.files[0]) {
        formData.append('vehicle_image', fileInput.files[0]);
    } //same thing as add but we access vehicle id to know which vehicle to update

    try {
        const response = await fetch('api/vehicle_management_api.php?mode=update', {
            method: 'POST',
            body: formData
        });

        const result = await response.json(); // same thing as add too

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


async function init() { // async init function
    console.log("Initializing app...");

    await fetchVehicles(); //fetch vehicles data and render
    renderVehicles();

    console.log("App loaded!");
}

init();