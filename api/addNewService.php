<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $serviceData = json_decode($content, true);
    $sql = "INSERT INTO service 
            (serviceCategoryID, serviceName, serviceDescription)
            VALUES 
            (
                (SELECT servicecategory.serviceCategoryID 
                    FROM servicecategory
                    WHERE servicecategory.categoryName = '--Others--'),
                '{$serviceData['serviceName']}',
                '{$serviceData['serviceDescription']}'
            );";
    if(mysqli_query($conn, $sql)){
        $lastID = mysqli_insert_id($conn);
        echo json_encode(array("lastID"=>$lastID));
    }
?>