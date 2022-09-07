<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $contactData = json_decode($content, true);
    $sql = "INSERT INTO contacts
            (user1ID, user2ID, contactDate, subject)
            VALUES 
            (
                {$contactData['user1ID']},
                {$contactData['user2ID']},
                now(),
                '{$contactData['subject']}'
            );";
    if(mysqli_query($conn, $sql)){
        $lastID = mysqli_insert_id($conn);
        echo json_encode(array("lastID"=>$lastID));
    }
?>