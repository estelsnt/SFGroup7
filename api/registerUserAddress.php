<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $userData = json_decode($content, true);
    $sql = "INSERT INTO useraddress
            (userID, brgyCode, citymunCode, provCode, regCode, address)
            VALUES 
            (
                (SELECT userID FROM users WHERE username = '{$userData['userName']}'),
                '{$userData['brgyCode']}',
                '{$userData['citymunCode']}',
                '{$userData['provCode']}',
                '{$userData['regCode']}',
                '{$userData['address']}'
            );
        ";
    $result = $conn->query($sql);
    echo json_encode($content);
?>