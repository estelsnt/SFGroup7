<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $userData = json_decode($content, true);
    $sql = "UPDATE useraddress 
            SET 
            brgyCode = '{$userData['brgyCode']}', 
            address = '{$userData['address']}' 
            WHERE useraddress.userID = {$userData['id']};";
    $result = $conn->query($sql);
    echo json_encode($content);
?>