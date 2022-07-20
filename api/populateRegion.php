<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $sql = 'SELECT regCode, regDesc 
            FROM refregion;
    ';
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $data = [];
        while($row = $result->fetch_assoc()){
            array_push($data, array("regCode"=>$row['regCode'], "description"=>$row['regDesc']));
        }
        echo json_encode($data);
    }
?>