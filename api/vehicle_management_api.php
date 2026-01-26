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

    if($method === "GET"){
       $sql = "SELECT vehicle_id, driver_id, car_plate_number, color, type, brand, manufactured_year, registered_at 
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
        }
    }

    // if($method === "GET"){
    //     $sql = "SELECT vehicle_id, driver_id, car_plate_number, color, type, brand, year, registered_at 
    //             FROM vehicles 
    //             WHERE driver_id = ?
    //             ORDER BY registered_at DESC";
    //     $stmt = mysqli_prepare($conn, $sql);
        
    //     if (!$stmt){
    //         respond(["error" => "Database error: " . mysqli_error($conn)], 500);
    //     }
        
    //     mysqli_stmt_bind_param($stmt, 's', $sessionId);
    //     mysqli_stmt_execute($stmt);
    //     $result = mysqli_stmt_get_result($stmt);
        
    //     $vehicles = [];
    //     while ($row = mysqli_fetch_assoc($result)){
    //         $vehicles[] = $row;
    //     }
        
    //     respond(["vehicles" => $vehicles], 200);
    // }

    elseif($method === "POST" && $mode === "add"){
        $input = getJsonInput();

        $new_vehicle_id = generateId("VH_");

        if(empty($input['car_plate_number']) || empty($input['color']) || empty($input['type'])){
            respond(["error" => "Missing required fields"], 400);
            exit;
        }

        $sql = "INSERT INTO vehicles (vehicle_id, driver_id, car_plate_number, color, type, brand, manufactured_year, registered_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";

        $stmt = mysqli_prepare($conn, $sql);

        if(!$stmt){
            respond(["error" => "Database error: " . mysqli_error($conn)], 500);
        }

        $year = isset($input['year']) ? (int)$input['year'] : 0;

        mysqli_stmt_bind_param($stmt, 'ssssssi', 
            $new_vehicle_id, 
            $sessionId, 
            $input['car_plate_number'], 
            $input['color'], 
            $input['type'], 
            $input['brand'], 
            $year
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

    elseif ($method === "PUT" && $mode === "update"){
        $input = getJsonInput();

        if(empty($input['vehicle_id'])){
            respond(["error" => "Vehicle ID required"], 400);
        }

        $sql = "UPDATE vehicles
                SET car_plate_number = ?, color = ?, type = ?, brand = ?, manufactured_year = ?
                WHERE vehicle_id = ? AND driver_id = ?";
        
        $stmt = mysqli_prepare($conn, $sql);

        if(!$stmt){
            respond (["error" => "Database error: " . mysqli_error($conn)], 500);
        }

        $year = isset($input['year']) ? (int)$input['year'] : 0;

        mysqli_stmt_bind_param($stmt, 'ssssiss',
            $input['car_plate_number'], 
            $input['color'],
            $input['type'],
            $input['brand'],
            $year,
            $input['vehicle_id'],
            $sessionId
        );

        if(mysqli_stmt_execute($stmt)){
            respond(["success" => true, "message" => "Vehicle updated"], 200);
        } 
        else{
            respond(["error" => "Failed to update vehicle"], 500);
        }
    }

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