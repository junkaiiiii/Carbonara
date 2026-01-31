<?php
    session_start();

    include "headers.php";
    include "../db_connect.php";
    include "helpers.php";

    $method = $_SERVER["REQUEST_METHOD"];
    $mode = $_GET['mode'] ?? '';
    $sessionId = $_SESSION['user_id'] ?? null;

    if(!$sessionId){
        respond(["error" => "Unauthorized"], 401);
        exit;
    }

    function uploadImage($file){
        $target_dir = "../assets/vehicle_images/";
        if(!file_exists($target_dir)){
            mkdir($target_dir, 0777, true);
        }

        $file_extension = pathinfo($file["name"], PATHINFO_EXTENSION);
        $new_filename = uniqid("car_") . "." . $file_extension;
        $target_file = $target_dir . $new_filename;

        $allowed = ['jpg', 'jpeg', 'png'];
        if(!in_array(strtolower($file_extension), $allowed)){
            return ["error" => "Invalid file type. Only JPG, JPEG, and PNG file type are allowed."];
        }

        if(move_uploaded_file($file["tmp_name"], $target_file)){
            return "assets/vehicle_images/" . $new_filename;
        }
        return ["error" => "Failed to move uploaded file."];
    }

    if($method === "GET"){
       $sql = "SELECT vehicle_id, driver_id, car_plate_number, color, type, brand, manufactured_year, registered_at, vehicle_image
                FROM vehicles 
                WHERE driver_id = ?
                ORDER BY registered_at DESC";

        $stmt = mysqli_prepare($conn, $sql);

        if(!$stmt){
            respond(["error" => "Database error: " . mysqli_error($conn)], 500);
            exit;
        }

        else{
            mysqli_stmt_bind_param($stmt, 's', $sessionId);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            $vehicles = [];
            while ($row = mysqli_fetch_assoc($result)){
                $vehicles[] = $row;
            }

            respond(["vehicles" => $vehicles], 200);
            exit;
        }
    }

    elseif($method === "POST" && $mode === "add"){ 
        // Since we are adding picture, old approach wont work so we access via $_POST instead of JSON
        // $input = getJsonInput();

        $input = $_POST;

        $new_vehicle_id = generateId("VH_");

        if(empty($input['car_plate_number']) || empty($input['color']) || empty($input['type'])){
            respond(["error" => "Missing required fields"], 400);
            exit;
        }

        $imagePath = null;
        if(isset($_FILES['vehicle_image']) && $_FILES['vehicle_image']['error'] == 0){
            $uploadResult = uploadImage($_FILES['vehicle_image']);
            if(is_array($uploadResult) && Isset($uploadResult['error'])){
                respond($uploadResult, 400);
                exit;
            }
            $imagePath = $uploadResult;
        }


        $sql = "INSERT INTO vehicles (vehicle_id, driver_id, car_plate_number, color, type, brand, manufactured_year, registered_at, vehicle_image) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)";

        $stmt = mysqli_prepare($conn, $sql);

        if(!$stmt){
            respond(["error" => "Database error: " . mysqli_error($conn)], 500);
        }

        $year = isset($input['year']) ? (int)$input['year'] : 0;

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
            ], 201);
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
        $year = isset($input['year']) ? (int)$input['year'] : 0;
        $vehicle_id = $input['vehicle_id'] ?? '';

        if(empty($input['vehicle_id'])){
            respond(["error" => "Vehicle ID required"], 400);
            exit;
        }

        $newImagePath = null;
        $isUpdatingImage = isset($_FILES['vehicle_image']) && $_FILES['vehicle_image']['error'] == 0;

        if ($isUpdatingImage) {
            $uploadResult = uploadImage($_FILES['vehicle_image']);
            if (is_array($uploadResult)) { // Error returned from uploadImage
                respond($uploadResult, 400);
                exit;
            }
            $newImagePath = $uploadResult;

            $sql = "UPDATE vehicles 
                    SET car_plate_number = ?, color = ?, type = ?, brand = ?, manufactured_year = ?, vehicle_image = ? 
                    WHERE vehicle_id = ? AND driver_id = ?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, 'ssssisss', 
                $input['car_plate_number'], $input['color'], $input['type'], 
                $input['brand'], $year, $newImagePath, $vehicle_id, $sessionId);
        } else {
            // No new image, keep the old one (don't update the column)
            $sql = "UPDATE vehicles 
                    SET car_plate_number = ?, color = ?, type = ?, brand = ?, manufactured_year = ? 
                    WHERE vehicle_id = ? AND driver_id = ?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, 'ssssiss', 
                $input['car_plate_number'], $input['color'], $input['type'], 
                $input['brand'], $year, $vehicle_id, $sessionId);
        }

        if(mysqli_stmt_execute($stmt)){
            respond(["success" => true, "message" => "Vehicle updated"], 200);
        } else {
            respond(["error" => "Database error: " . mysqli_error($conn)], 500);
        }
        exit;
    }

    //     if(isset($_FILES['vehicle_image']) && $_FILES['vehicle_image']['error'] == 0){
    //         $imagePath = uploadImage($_FILES['vehicle_image']);
    //         if(is_array($imagePath)) {
    //             respond($imagePath, 400);
    //             exit;
    //         }
            
    //         $sql = "UPDATE vehicles
    //                 SET car_plate_number = ?, color = ?, type = ?, brand = ?, manufactured_year = ?, vehicle_image = ?
    //                 WHERE vehicle_id = ? AND driver_id = ?";

    //         $stmt = mysqli_prepare($conn, $sql);

    //         if(!$stmt){
    //             respond (["error" => "Database error: " . mysqli_error($conn)], 500);
    //         }

    //         mysqli_stmt_bind_param($stmt, 'ssssisss',
    //             $input['car_plate_number'], 
    //             $input['color'],
    //             $input['type'],
    //             $input['brand'],
    //             $year,
    //             $imagePath,
    //             $input['vehicle_id'],
    //             $sessionId
    //         );
    //     }
    //     else{
    //         // Only updates text

    //         $sql = "UPDATE vehicles
    //             SET car_plate_number = ?, color = ?, type = ?, brand = ?, manufactured_year = ?
    //             WHERE vehicle_id = ? AND driver_id = ?";

    //             $stmt = mysqli_prepare($conn, $sql);

    //         if(!$stmt){
    //             respond (["error" => "Database error: " . mysqli_error($conn)], 500);
    //         }

    //         mysqli_stmt_bind_param($stmt, 'ssssiss',
    //             $input['car_plate_number'], 
    //             $input['color'],
    //             $input['type'],
    //             $input['brand'],
    //             $year,
    //             $input['vehicle_id'],
    //             $sessionId
    //         );
    //     }

    //     if(mysqli_stmt_execute($stmt)){
    //         respond(["success" => true, "message" => "Vehicle updated"], 200);
    //     } 
    //     else{
    //         respond(["error" => "Failed to update vehicle"], 500);
    //     }
    // }

    elseif($method === "POST" && $mode === "delete"){
        $input = getJsonInput();

        if(empty($input['vehicle_id'])){
            respond(["error" => "Vehicle ID require"], 400);
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