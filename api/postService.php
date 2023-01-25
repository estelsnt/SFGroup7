<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $postData = json_decode($content, true);
    $sql = "INSERT INTO serviceposting
            (userID, serviceID, pricing, description, servicePostDateTime, picture) 
            VALUES 
            (
                {$postData['userID']}, 
                {$postData['serviceID']}, 
                '{$postData['pricing']}',
                '{$postData['description']}', 
                now(),
                '{$postData['picture']}'
            );";
    $result = $conn->query($sql);
    echo json_encode($content);
?>