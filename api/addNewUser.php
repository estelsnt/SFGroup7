<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $userData = json_decode($content, true);
    $sql = "INSERT INTO users 
            (userName, passWord, lastName, firstName, middleName, contactNumber, email, gender, birthDate, registerDate)
            VALUES 
            (
                '{$userData['userName']}',
                '{$userData['passWord']}',
                '{$userData['lastName']}',
                '{$userData['firstName']}',
                '{$userData['middleName']}',
                '{$userData['contactNumber']}',
                '{$userData['email']}',
                '{$userData['gender']}',
                '{$userData['birthDate']}',
                now()
            );
    ";
    $result = $conn->query($sql);
    echo json_encode($content);
?>