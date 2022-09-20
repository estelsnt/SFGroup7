<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $contactData = json_decode($content, true);
    $sql = "SELECT notification.notify
            FROM notification
            WHERE notification.receiverID = {$contactData['userID']} AND notification.notifierID = {$contactData['notifierID']};";
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $data = [];
        while($row = $result->fetch_assoc()){
            array_push($data, array("notify"=>$row['notify']));
        }
        echo json_encode($data);
    }else{
        echo '[{"notify":0}]';
    }
?>