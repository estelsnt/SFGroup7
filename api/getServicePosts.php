//getServicePosts.php - api to retrieve services posted
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['userID'];
    $sql = "SELECT
            serviceposting.servicePostingID,
            servicecategory.categoryName,
            service.serviceName,
            serviceposting.pricing,
            serviceposting.description,
            serviceposting.servicePostDateTime,
            serviceposting.picture
            FROM serviceposting
            JOIN service ON service.serviceID = serviceposting.serviceID
            JOIN servicecategory ON servicecategory.serviceCategoryID = service.serviceCategoryID
            WHERE serviceposting.userID =". $id ."
            ORDER BY serviceposting.servicePostDateTime DESC;";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                "servicePostingID"=>$row['servicePostingID'],
                "categoryName"=>$row['categoryName'],
                "serviceName"=>$row['serviceName'],
                "pricing"=>$row['pricing'],
                "description"=>$row['description'],
                "servicePostDateTime"=>$row['servicePostDateTime'],
                "picture"=>$row['picture']
            ));
        }
        echo json_encode($d);
    }else{
        $d["posts"]=0;
        echo json_encode($d);   
    }
?>