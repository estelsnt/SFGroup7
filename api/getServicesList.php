<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $id = $_GET["id"];
    $sql = "SELECT * FROM service
            WHERE serviceCategoryID = ".$id."
            ORDER BY serviceName;";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                "serviceID"=>$row['serviceID'], 
                "serviceName"=>$row['serviceName'], 
                "serviceDescription"=>$row['serviceDescription']
            ));
        }
        echo json_encode($d);
    }else{
        $d["userID"]=0;
        echo json_encode($d);   
    }
?>