<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['userID'];
    $sql = "SELECT
            serviceorder.serviceOrderID,
            servicecategory.categoryName,
            service.serviceName,
            serviceorder.description,
            serviceorder.serviceOrderDateTime,
            picture
            FROM serviceorder
            JOIN service ON service.serviceID = serviceorder.serviceID
            JOIN servicecategory ON servicecategory.serviceCategoryID = service.serviceCategoryID
            WHERE serviceorder.userID =".$id."
            ORDER BY serviceorder.serviceOrderDateTime DESC;";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                "serviceOrderID"=>$row['serviceOrderID'],
                "categoryName"=>$row['categoryName'],
                "serviceName"=>$row['serviceName'],
                "description"=>$row['description'],
                "serviceOrderDateTime"=>$row['serviceOrderDateTime'],
                "picture"=>$row['picture']
            ));
        }
        echo json_encode($d);
    }else{
        $d["posts"]=0;
        echo json_encode($d);   
    }
?>