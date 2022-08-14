<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $sql = "CALL sfa.getBusinessLocation(". $id .");";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                "barangay"=>$row['barangay'],
                "cityMun"=>$row['cityMun'],
                "province"=>$row['province']
            ));
        }
        echo json_encode($d);
    }else{
        $d["unfound"]=0;
        echo json_encode($d);   
    }
?>