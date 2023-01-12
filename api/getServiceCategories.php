//getServiceCategories.php - api to get list of service categories
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = "SELECT * FROM servicecategory
            ORDER BY categoryName;";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array("serviceCategoryID"=>$row['serviceCategoryID'], "categoryName"=>$row['categoryName']));
        }
        echo json_encode($d);
    }else{
        $d["categories"]=0;
        echo json_encode($d);   
    }
?>