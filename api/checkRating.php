<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $id = $_GET['id'];
    $sql = "SELECT ratingID 
            FROM ratings
            WHERE userID = '{$id}';
    ";
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $data = [];
        while($row = $result->fetch_assoc()){
            array_push($data, array("ratingID"=>$row['ratingID']));
        }
        echo json_encode($data);
    }else{
        echo '[{"ratingID":0}]';
    }
?>