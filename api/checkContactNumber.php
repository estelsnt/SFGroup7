<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $id = $_GET['id'];
    $sql = "SELECT userName 
            FROM users
            WHERE contactNumber = '{$id}';
    ";
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $data = [];
        while($row = $result->fetch_assoc()){
            array_push($data, array("userName"=>$row['userName']));
        }
        echo json_encode($data);
    }else{
        echo '[{"userName":0}]';
    }
?>