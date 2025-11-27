<?php
//utilities
//------------------------------------

//send response
function respond($data, $code = 200){
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function generateId($prefix){
    return uniqid($prefix);
}

//receive post body
function getJsonInput(){
    $body = file_get_contents("php://input");
    $data = json_decode($body,true);
    if (!is_array($data)){
        return [];
    }
    return $data;
}
?>