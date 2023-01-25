<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $id = $_GET['id'];
    $sql = 'SELECT brgyCode, brgyDesc 
            FROM refbrgy
            WHERE cityMunCode = '. $id .';
    ';
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $data = [];
        while($row = $result->fetch_assoc()){
            array_push($data, array("brgyCode"=>$row['brgyCode'], "description"=>$row['brgyDesc']));
        }
        echo json_encode($data);
    }
?>