//clearNotification.php - api to clear notifications
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $contactData = json_decode($content, true);
    $sql = "UPDATE notification SET
            notification.notify = 0
            WHERE notification.notifierID = {$contactData['notifierID']} AND receiverID = {$contactData['receiverID']};";
    $result = $conn->query($sql);
    echo json_encode($result);
?>