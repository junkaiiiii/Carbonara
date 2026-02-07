<?php
    session_start();

    include "headers.php";
    include "../db_connect.php";
    include "helpers.php";

    $method = $_SERVER["REQUEST_METHOD"]; // get http method from the server => "GET" / "POST / "DELETE"
    $mode = $_GET['mode'] ?? ''; // The mode is the key and the value can be anything, we access through the value of the mode e.g mode=add
    $sessionId = $_SESSION['user_id'] ?? null;

    //checks whether the user is logged in ornot. if !$sessionId = null => Not logged in
    if(!$sessionId){
        respond(["error" => "Unauthorized"], 401);
        exit;
    }

    function uploadImage($file){
        $target_dir = "../assets/img/vehicle_images/"; //target directory path
        if(!file_exists($target_dir)){
            mkdir($target_dir, 0777, true); // mkdir => function to make directory, 0777 is permission in octal notation (0777 => Full permission for everyone), true => Recursive, create parent folders if doesnt exist
        }

        $file_extension = pathinfo($file["name"], PATHINFO_EXTENSION); // if pathinfo is not specified, it will return all 4 datas in an array. PATHINFO_EXTENSION only grabs the data after the dot. meaning that from "car.png" we get png
        $new_filename = uniqid("car_") . "." . $file_extension; // creating a unique ID for the filename 
        $target_file = $target_dir . $new_filename; // creates a file directory by combining target directory and the created file name

        $allowed = ['jpg', 'jpeg', 'png']; 
        if(!in_array(strtolower($file_extension), $allowed)){ // strtolower makes it lowercase and checks whether the extracted file extension is allowed (as specified in the array)
            return ["error" => "Invalid file type. Only JPG, JPEG, and PNG file type are allowed."]; //exits the function and returns an array
        }

        if(move_uploaded_file($file["tmp_name"], $target_file)){ // built in tool for security which saves the data in a temporary file first 
            return "assets/img/vehicle_images/" . $new_filename; // we return the new file path without the ../ allowing browser to load image correctly from the web root
        }

        //why not just specify target dir without the ../ so its like the system doenst know where to start. once we specified it we dont have to specify it again afterwards since the system know where to locate the directory and HTML Is already at root
        return ["error" => "Failed to move uploaded file."];
    }


    if($method === "GET"){ // checks whether the value and type is GET "==="
       $sql = "SELECT vehicle_id, driver_id, car_plate_number, color, type, brand, manufactured_year, registered_at, vehicle_image
                FROM vehicles 
                WHERE driver_id = ?
                ORDER BY registered_at DESC";

        $stmt = mysqli_prepare($conn, $sql); //prepare the sql query to prevent sql attacks using bind parameters

        if(!$stmt){
            respond(["error" => "Database error: " . mysqli_error($conn)], 500);
            exit;
        }

        else{ // bind values to the '?' parameter using string value 's'
            mysqli_stmt_bind_param($stmt, 's', $sessionId);
            mysqli_stmt_execute($stmt); // runs the SQL query
            $result = mysqli_stmt_get_result($stmt); // doenst store the actual data itself but a pointer that allows our system to know where the data is located at 

            $vehicles = [];
            while ($row = mysqli_fetch_assoc($result)){ 
                $vehicles[] = $row; // append the $row array and proceed to stores all data inside an empty array 
            }

            respond(["vehicles" => $vehicles], 200); // sends this data back to js
            exit;
        }
    }

    elseif($method === "POST" && $mode === "add"){ 
        // Since we are adding picture, old approach wont work so we access via $_POST instead of JSON
        // JSON only reads text
        // $input = getJsonInput();

        $input = $_POST; // Reads form data from request which is already in array

        $new_vehicle_id = generateId("VH_"); //prefix for the ID

        if(empty($input['car_plate_number']) || empty($input['color']) || empty($input['type'])){ //empty = "" / null / 0 => returns true 
            respond(["error" => "Missing required fields"], 400);
            exit;
        }

        $imagePath = null;
        if(isset($_FILES['vehicle_image']) && $_FILES['vehicle_image']['error'] == 0){ // checks whether the key exist ornot and checks whether 'error' == 0'. if true, means that upload is successful
            $uploadResult = uploadImage($_FILES['vehicle_image']);
            if(is_array($uploadResult) && Isset($uploadResult['error'])){ //checks whether the upload result is an array / and does it have an error key
                respond($uploadResult, 400); /// sends error to user
                exit;
            }
            $imagePath = $uploadResult; // replaces imagePath with the validated image path
        }


        $sql = "INSERT INTO vehicles (vehicle_id, driver_id, car_plate_number, color, type, brand, manufactured_year, registered_at, vehicle_image) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)"; // NOW() is a MySQL function that returns the current timestamp

        $stmt = mysqli_prepare($conn, $sql);

        if(!$stmt){
            respond(["error" => "Database error: " . mysqli_error($conn)], 500);
        }

        $year = isset($input['year']) ? (int)$input['year'] : 0; // isset => checks whether the year key exists in the arrray. ? => If true change the variable to int, if false then set it to 0

        mysqli_stmt_bind_param($stmt, 'ssssssis', 
            $new_vehicle_id, 
            $sessionId, 
            $input['car_plate_number'], 
            $input['color'], 
            $input['type'], 
            $input['brand'], 
            $year,
            $imagePath
        );

        if(mysqli_stmt_execute($stmt)){
            respond([
                "success" => true,
                "message" => "Vehicle added successfully",
                "vehicle_id" => $new_vehicle_id
            ], 201); // a custom function that sends the data to js
        } 
        else{
            respond(["error" => "Failed to add vehicle"], 500);
        }
        exit;
    }

    elseif ($method === "POST" && $mode === "update"){
        // $input = getJsonInput();
        // same thing here since we are allowing users to add pictures

        $input = $_POST;
        $year = isset($input['year']) ? (int)$input['year'] : 0; // checks whether its true or false, if true make it an int, if false set it to 0
        $vehicle_id = $input['vehicle_id'] ?? ''; // if it doenst exist then use '' instead

        if(empty($input['vehicle_id'])){
            respond(["error" => "Vehicle ID required"], 400);
            exit;
        }

        $newImagePath = null; // default value set in daytabase is null so no new image 
        $isUpdatingImage = isset($_FILES['vehicle_image']) && $_FILES['vehicle_image']['error'] == 0; // did user select a file & is the upload successfull

        if ($isUpdatingImage) {
            $uploadResult = uploadImage($_FILES['vehicle_image']);
            if (is_array($uploadResult)) { // Error if the uploadresult is in an array since we need the directory not the array. If error uploadresult returns error if not directory will be returned instead
                respond($uploadResult, 400);
                exit;
            }
            $newImagePath = $uploadResult; 

            $sql = "UPDATE vehicles 
                    SET car_plate_number = ?, color = ?, type = ?, brand = ?, manufactured_year = ?, vehicle_image = ? 
                    WHERE vehicle_id = ? AND driver_id = ?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, 'ssssisss', 
                $input['car_plate_number'], 
                $input['color'],
                $input['type'], 
                $input['brand'], 
                $year, 
                $newImagePath, 
                $vehicle_id, 
                $sessionId);
        } else {
            // No new image, keep the old one (don't update the column)
            $sql = "UPDATE vehicles 
                    SET car_plate_number = ?, color = ?, type = ?, brand = ?, manufactured_year = ? 
                    WHERE vehicle_id = ? AND driver_id = ?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, 'ssssiss', 
                $input['car_plate_number'], 
                $input['color'], 
                $input['type'], 
                $input['brand'], 
                $year, 
                $vehicle_id, 
                $sessionId);
        }

        if(mysqli_stmt_execute($stmt)){
            respond(["success" => true, "message" => "Vehicle updated"], 200);
        } else {
            respond(["error" => "Database error: " . mysqli_error($conn)], 500);
        }
        exit;
    }

    elseif($method === "POST" && $mode === "delete"){
        $input = getJsonInput(); // get input

        if(empty($input['vehicle_id'])){ // check whether vehicle_id is empty ornot 
            respond(["error" => "Vehicle ID required"], 400);
        }

        $sql = "DELETE FROM vehicles WHERE vehicle_id = ? AND driver_id = ?";
        $stmt = mysqli_prepare($conn, $sql);

        if(!$stmt){
            respond(["error" => "Database error: " . mysqli_error($conn)], 500);
        }

        mysqli_stmt_bind_param($stmt, 'ss', $input['vehicle_id'], $sessionId);

        if(mysqli_stmt_execute($stmt)){
            respond(["success" => true, "message" => "Vehicle deleted"], 200);
        }
        else{
            respond(["error" => "Failed to delete vehicle"], 500);
        }
    }

    else{
        respond(["error" => "Invalid request"], 400);
    }

?>