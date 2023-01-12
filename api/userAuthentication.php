//userAuthentication.php - api for authentication on logins
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['userName'];
    $password = $data['passWord'];
    $sql = "SELECT userID
            FROM users
            WHERE userName='" . $username . "' AND passWord='" . $password . "';
        ";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
           $d["userID"]=$row['userID'];
        }
        echo json_encode($d);
    }else{
        $d["userID"]=0;
        echo json_encode($d);   
    }
?>