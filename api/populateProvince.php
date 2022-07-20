<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $id = $_GET['id'];
    $sql = 'SELECT provCode, provDesc 
            FROM refprovince
            WHERE regCode = '. $id .';
    ';
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $data = [];
        while($row = $result->fetch_assoc()){
            array_push($data, array("provCode"=>$row['provCode'], "description"=>$row['provDesc']));
        }
        echo json_encode($data);
    }
?>