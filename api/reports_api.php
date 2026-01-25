<?php
session_start();

include "headers.php";
include "../db_connect.php";
include "helpers.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {

    // check a user is reported or not
    $user_id = $_GET['user_id'] ?? "";
    $ride_id = $_GET['ride_id'] ?? "";
    if (!empty($user_id) && !empty($ride_id)) {
        $sql = "SELECT report_id FROM reports
                    WHERE reported_user_id = ? AND ride_id = ? AND status = 'Approved'";

        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, 'ss', $user_id, $ride_id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($result && mysqli_num_rows($result)) {
            respond(['ride_id' => $ride_id, 'user_id' => $user_id, 'is_reported' => true], 200);
        }

        respond(['ride_id' => $ride_id, 'user_id' => $user_id, 'is_reported' => false], 200);
    }

    // Get all reports details
    $sql = "SELECT re.*, 
        reporter.full_name AS reporter_name, 
        reporter.email AS reporter_email, 
        reporter.profile_picture_url AS reporter_pfp,
        reported.full_name AS reported_name, 
        reported.email AS reported_email,
        reported.profile_picture_url AS reported_pfp
        FROM reports re 
        INNER JOIN users reporter 
        ON re.reporter_id = reporter.user_id 
        INNER JOIN users reported 
        ON re.reported_user_id = reported.user_id";

    $result = mysqli_query($conn, $sql);
    $response = [];

    if ($result && mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $reports = [
                "report_id" => $row["report_id"],
                "reporter_name" => $row["reporter_name"],
                "reporter_email" => $row["reporter_email"],
                "reporter_pfp" => $row["reporter_pfp"],
                "reported_user_id" => $row["reported_user_id"],
                "reported_name" => $row["reported_name"],
                "reported_email" => $row["reported_email"],
                "reported_pfp" => $row["reported_pfp"],
                "description" => $row["description"],
                "status" => $row["status"]
            ];
            $response[] = $reports;
        }
        respond($response, 200);
    }
} elseif ($method === "POST") {
    $data = json_decode(file_get_contents('php://input'), true);

    $reports_list = $data['reports'] ?? null;

    if (!$reports_list || !is_array($reports_list)) {
        respond(['error' => 'No reports data found'], 400);
    }

    $required = ['reporter_id', 'reported_user_id', 'ride_id', 'description'];

    foreach ($reports_list as $report) {
        foreach ($required as $r) {
            if (empty($report[$r])) {
                respond(['error' => 'Missing Required Field' . $r], 400);
            }
        }
    }


    foreach ($report_list as $report) {
        $sql = "INSERT INTO reports (report_id, ride_id, reporter_id, reported_user_id, description, status, created_at) VALUES
        (?,?,?,?,?,'Pending',NOW())";

        $stmt = mysqli_prepare($conn, $sql);

        $report_id = generateId("RE");
        mysqli_stmt_bind_param($stmt, 'sssss', $report_id, $report['ride_id'], $report['reporter_id'], $report['reported_user_id'], $report['description']);

        $executed = mysqli_stmt_execute($stmt);

        if (!$executed) {
            respond([
                "error" => "Database execution failed",
                "details" => mysqli_stmt_error($stmt)
            ], 500);
        }

        if (mysqli_stmt_affected_rows($stmt) === 0) {
            respond([
                "error" => "No request updated (already cancelled or not found)"
            ], 404);
        }
    }

    respond(["success" => "Successfully created the reports"]);
} elseif ($method === "PUT") {
    $data = getJsonInput();
    //check if data is not empty
    if (!$data) {
        respond(["error" => "Invalid or empty JSON"], 400);
    }
    // check if action and report id is not empty / is set
    if (!isset($data["action"], $data["report_id"])) {
        respond(["error" => "Missing required fields"], 400);
    }

    $action = $data["action"]; // status
    $report_id = $data["report_id"];

    if ($action === "approve") { // if 3 approve === ban
        $newStatus = "Approved";
    } elseif ($action === "reject") { // rejects the report
        $newStatus = "Rejected";
    } elseif ($action === "unban") {
        $newStatus = "Pending";
    } else {
        respond(["error" => "Invalid action"], 400);
    }

    $sql = "UPDATE reports
                SET status = ?
                WHERE report_id = ?";

    $stmt = mysqli_prepare($conn, $sql);

    //if no statements === sql failed
    if (!$stmt) {
        respond(['error' => 'Database error: ' . mysqli_error($conn)], 500);
    }

    //replace question mark with variables
    mysqli_stmt_bind_param($stmt, "ss", $newStatus, $report_id);
    mysqli_stmt_execute($stmt);      //execute sql / stmt


    if (mysqli_stmt_affected_rows($stmt) > 0) { //if row is affected
        respond(["message" => "Report Updated", "status" => $newStatus], 200);
    } else { // no rows effected
        respond(["error" => "No rows updated"], 400);
    }
}
