<?php session_start() ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="styles/vehicles.css">

</head>
<body>
    <?php
        include("user_header.php");
    ?>

    <div id="manage-vehicles-header">
        <div class="flex-spaced-between">
            <div class="left-section">
                <h2>Manage Vehicles</h2>
                <p>Manage your registered vehicles</p>
            </div>
            <div class="right-section">
                <button class="green button" onclick="openAdd()">
                    <img class="small-icons" src="assets/img/add.png" alt="plus-sign">
                    Add New Vehicle
                </button>
            </div>
        </div>
    </div>

    <div id="vehicleSection"></div>

    <div class="overlay" id="overlay"></div>

    <div class="popup" id="edit">
        <h2 class="bolded huge">Edit Vehicle Details</h2>
        <!-- <p class="obsidian bolded huge text-right" id="registeredTimeLabel"></p>  -->
        <p class="bolded grey" id="registeredTimeLabel"></p>
        <hr class="margin10top">
        <form id="editVehicleForm">

            <img class="margin10top" id="current_edit_img" src="" alt="Current Vehicle" style="max-width: 150px; border-radius: 8px; display: none;">
        
            <p>Update Image (Optional):</p>
            <input type="file" id="edit_image" name="vehicleImage" accept="image/*">

            <p>Vehicle Brand:</p>
            <input type="hidden" id="edit_id" name="vehicle_id">

            <input type="text" id="edit_brand" name="carbrandInput" placeholder="Perodua Kancil" required="required">

            <p>Year:</p>
            <input type="number" id="edit_year" name="yearInput" placeholder="2000" required="required">

            <p>Plate Number:</p>
            <input type="text" id="edit_plate" name="plateInput" placeholder="ABC 123" required="required">

            <p>Vehicle Colour:</p>
            <input type="text" id="edit_colour" name="colourInput" placeholder="Brown" required="required">

            <p>Vehicle Type:</p>
            <select id="edit_type" name="vehicletypeSelect" required="required">
                <option value="" disabled selected>Choose a category</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="MPV">MPV</option>
                <option value="Pickup">Pickup</option> <option value="Van">Van</option>
                <option value="Motorcycle">Motorcycle</option>
            </select>

            <div class="stick-left button-container margin20bottom">
                 <div>
                    <button class="red button" type="button" onclick="closeEdit()">Close</button>
                    <!-- changes to type button because when the browser detects the button as type submit it automatically refreshes it  -->
                </div> 

                <div>
                    <button id="confirmEditBtn" class="green button" type="button">Save Changes</button>
                </div>
            </div>
        </form>
    </div>

    <!-- <button onclick="showMessage('Vehicle Information Updated Successfully!', 'success')">Edit</button>
    <button onclick="showMessage('Vehicle Added Successfully!', 'success')">Add</button>
    <button onclick="showMessage('Vehicle Deleted Successfully!', 'success')">Delete</button>
    <button onclick="showMessage('Error!', 'delete')">Error</button> -->

    <div class="popup" id="add">
        <h2 class="bolded huge">Add New Vehicle</h2>
        <hr class="margin10top">
        <form id="addVehicleForm">
            <p>Vehicle Image:</p>
            <input type="file" id="add_image" name="vehicleImage" accept="image/*">

            <p>Vehicle Brand:</p>
            <input type="text" id="add_brand" name="carbrandInput" placeholder="Perodua Kancil" required="required">

            <p>Year:</p>
            <input type="number" id="add_year" name="yearInput" placeholder="2000" required="required">

            <p>Plate Number:</p>
            <input type="text" id="add_plate" name="plateInput" placeholder="ABC 123" required="required">

            <p>Vehicle Colour:</p>
            <input type="text" id="add_colour" name="colourInput" placeholder="Brown" required="required">

            <p>Vehicle Type:</p>
            <select id="add_type" name="vehicletypeSelect" required="required">
                <option value="" disabled selected>Choose a category</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="MPV">MPV</option>
                <option value="Pickup">Pickup</option> <option value="Van">Van</option>
                <option value="Motorcycle">Motorcycle</option>
            </select>

            <div class="stick-left button-container margin10bottom">
                 <div>
                    <button class="red button" onclick="closeAdd()">Close</button>
                </div> 

                <div>
                    <button class="green button" type="submit">Add Vehicle</button>
                </div>
            </div>
        </form>
    </div>

    <div id="notice" class="notice">
        <div class="notice-content flex-column">
            <span id="notice-icon"></span>
            <div class="message">
                <span id="notice-msg"></span>
            </div>
        </div>
        <div class="progress"></div>
    </div>

    <div id="deleteContainer" class="delete">
        <div class="flex-center flex-column">
            <img class="popup-icon" src="assets/img/bin.png" alt="tongsampah">
            <h2 class="hugee">Are you sure you want to delete?</h2>
            <div class="button-container">
                <button class="grey button light-grey-border" onclick="closeDelete()">No</button>
                <button class="red button" id="confirmDeleteBtn">Yes</button>
            </div>
        </div>
    </div>

    <?php include("user_navbar.html"); ?>

    <script src="scripts/manage_vehicle.js"></script>
</body>
</html>