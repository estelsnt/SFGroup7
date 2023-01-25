<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $chatData = json_decode($content, true);
    $sql = "INSERT INTO chat
            (senderUserID, receiverUserID, message, chatDateTime)
            VALUES
            ('{$chatData['senderUserID']}', '{$chatData['receiverUserID']}', '{$chatData['message']}', now());";
    if(mysqli_query($conn, $sql)){
        $lastID = mysqli_insert_id($conn);
        echo json_encode(array("lastID"=>$lastID));
    }
?>