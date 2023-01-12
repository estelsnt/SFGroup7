//checkContact.php - api to check a user's existence in contacts
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $contactData = json_decode($content, true);
    $sql = "SELECT contactID 
            FROM contacts
            WHERE user1ID = {$contactData['userID']} AND user2ID = {$contactData['cID']} 
            OR user1ID = {$contactData['cID']} AND user2ID = {$contactData['userID']};";
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $data = [];
        while($row = $result->fetch_assoc()){
            array_push($data, array("contactID"=>$row['contactID']));
        }
        echo json_encode($data);
    }else{
        echo '[{"contactID":0}]';
    }
?>