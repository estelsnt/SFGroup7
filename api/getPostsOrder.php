<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $cov = $_GET["cov"];
    $loc = $_GET["loc"];
    $service = $_GET["service"];

    $sql = "SELECT
            serviceorder.serviceOrderID,
            serviceorder.userID,
            users.picture,
            CONCAT(
            users.firstName, ' ',
            users.lastName) AS 'name',
            service.serviceName,
            serviceorder.description,
            CONCAT(
            useraddress.address, ' ',
            refbrgy.brgyDesc, ' ',
            refcitymun.citymunDesc, ' ',
            refprovince.provDesc) AS 'location',
            users.verified,
            serviceorder.picture AS 'postPicture'
            FROM serviceorder
            JOIN users ON users.userID = serviceorder.userID
            JOIN service ON service.serviceID = serviceorder.serviceID
            JOIN useraddress ON useraddress.userID = users.userID
            JOIN refbrgy ON refbrgy.brgyCode = useraddress.brgyCode
            JOIN refcitymun ON refcitymun.citymunCode = useraddress.citymunCode
            JOIN refprovince ON refprovince.provCode = useraddress.provCode
            JOIN refregion ON refregion.regCode = useraddress.regCode
            WHERE (service.serviceName LIKE '%".$service."%' OR serviceorder.description LIKE '%".$service."%')";
    switch($cov){
        case "barangay":
            $sql .= " AND refbrgy.brgyDesc = '"."$loc'";
        break;
        case "cityMunicipality":
            $sql .= " AND refcitymun.citymunDesc = '"."$loc'";
        break;
        case "provice":
            $sql .= " AND refprovince.provDesc = '"."$loc'";
        break;
        case "region":
            $sql .= " AND refregion.regDesc = '"."$loc'";
        break;
    }

    $result = $conn ->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, [
                "serviceOrderID"=>$row['serviceOrderID'], 
                "userID"=>$row['userID'],
                "picture"=>$row['picture'],
                "name"=>$row['name'],
                "serviceName"=>$row['serviceName'],
                "description"=>$row['description'],
                "location"=>$row['location'],
                "verified"=>$row['verified'],
                "postPicture"=>$row['postPicture']
            ]);
        }
        echo json_encode($d);
    }else{
        $d["servicePostingID"]=0;
        echo json_encode($d);   
    }
?>