<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['userID'];
    $sql = "SELECT
            (SELECT users.userID FROM users WHERE users.userID = contacts.user1ID) AS 'user1ID',
            (SELECT CONCAT(users.firstName, ' ', users.lastName) FROM users WHERE users.userID = contacts.user1ID) AS 'user1',
            (SELECT users.picture FROM users WHERE users.userID = contacts.user1ID) AS 'user1Picture',
            (SELECT users.userID FROM users WHERE users.userID = contacts.user2ID) AS 'user2ID',
            (SELECT CONCAT(users.firstName, ' ', users.lastName) FROM users WHERE users.userID = contacts.user2ID) AS 'user2',
            (SELECT users.picture FROM users WHERE users.userID = contacts.user2ID) AS 'user2Picture'
            FROM users
            JOIN contacts ON contacts.user1ID = users.userID OR contacts.user2ID = users.userID
            WHERE users.userID =" . $id . ";";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                "user1ID"=>$row['user1ID'],
                "user1"=>$row['user1'],
                "user1Picture"=>$row['user1Picture'],
                "user2ID"=>$row['user2ID'],
                "user2"=>$row['user2'],
                "user2Picture"=>$row['user2Picture']
            ));
        }
        echo json_encode($d);
    }else{
        $d["userID"]=0;
        echo json_encode($d);   
    }
?>