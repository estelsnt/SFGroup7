//getChat.php - api for retrieving messages
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = "SELECT chat.chatID, chat.senderUserID, chat.message, chat.chatDateTime FROM chat
            WHERE ((chat.senderUserID = {$data['userID']} AND chat.receiverUserID = {$data['contactID']})
            OR (chat.senderUserID = {$data['contactID']} AND chat.receiverUserID = {$data['userID']}))
            AND chat.chatID > {$data['lastID']};";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                "chatID"=>$row['chatID'],
                "senderUserID"=>$row['senderUserID'],
                "message"=>$row['message'],
                "chatDateTime"=>$row['chatDateTime']
            ));
        }
        echo json_encode($d);
    }else{
        $d["chatID"]=0;
        echo json_encode($d);   
    }
?>