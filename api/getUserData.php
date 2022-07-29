<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['userID'];
    $sql = "SELECT *
            FROM users
            WHERE userID=" . $id . ";
        ";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
           $d["userName"]=$row['userName'];
           $d["passWord"]=$row['passWord'];
           $d["lastName"]=$row['lastName'];
           $d["firstName"]=$row['firstName'];
           $d["middleName"]=$row['middleName'];
           $d["contactNumber"]=$row['contactNumber'];
           $d["email"]=$row['email'];
           $d["userName"]=$row['userName'];
           $d["picture"]=$row['picture'];
           $d["gender"]=$row['gender'];
           $d["birthDate"]=$row['birthDate'];
        }
        echo json_encode($d);
    }else{
        $d["userID"]=0;
        echo json_encode($d);   
    }
?>