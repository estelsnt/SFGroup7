//checkVerifiedUser.php - api to check if user is verified
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['userID'];
    $sql = "SELECT userID, verified FROM userverification
            WHERE userverification.verified = 'TRUE'
            AND userverification.userID =".$id.";";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
           $d["userID"]=$row['userID'];
           $d["verified"]=$row['verified'];
        }
        echo json_encode($d);
    }else{
        $d["userID"]=0;
        echo json_encode($d);   
    }
?>