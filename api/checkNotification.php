//checkNotification.php - api to check for new notifications
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $contactData = json_decode($content, true);
    $sql = "SELECT notification.notificationID 
            FROM notification
            WHERE notification.notifierID = {$contactData['notifierID']} AND receiverID = {$contactData['receiverID']};";
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $data = [];
        while($row = $result->fetch_assoc()){
            array_push($data, array("notificationID"=>$row['notificationID']));
        }
        echo json_encode($data);
    }else{
        echo '[{"notificationID":0}]';
    }
?>