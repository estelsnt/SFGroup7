<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $cov = $_GET["cov"];
    $loc = $_GET["loc"];
    $service = $_GET["service"];

    $sql = "SELECT
            serviceposting.servicePostingID,
            users.userID,
            users.picture,
            CONCAT(
            users.firstName, ' ',
            users.lastName) AS 'name',
            service.serviceName,
            serviceposting.pricing,
            serviceposting.description,
            CONCAT(
            useraddress.address, ' ',
            refbrgy.brgyDesc, ', ',
            refcitymun.citymunDesc, ', ',
            refprovince.provDesc) AS 'location',
            users.verified,
            serviceposting.picture AS 'postPicture'
            FROM users
            JOIN serviceposting ON serviceposting.userID = users.userID
            JOIN service ON service.serviceID = serviceposting.serviceID
            JOIN useraddress ON useraddress.userID = serviceposting.userID
            JOIN refbrgy ON refbrgy.brgyCode = useraddress.brgyCode
            JOIN refcitymun ON refcitymun.citymunCode = useraddress.citymunCode
            JOIN refprovince ON refprovince.provCode = useraddress.provCode
            WHERE service.serviceName LIKE '%".$service."%' OR servicePosting.description LIKE '%".$service."%'";
            
    switch($cov){
        case "barangay":
            $sql .= " AND refbrgy.brgyDesc = '" . "$loc'";
        break;
        case "cityMunicipality":
            $sql .= " AND refcitymun.citymunDesc = '" . "$loc'";
        break;
        case "provice":
            $sql .= " AND refprovince.provDesc = '" . "$loc'";
        break;
        case "region":
            $sql .= " AND refregion.regDesc = '" . "$loc'";
        break;
    }

    $result = $conn ->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, [
                "servicePostingID"=>$row['servicePostingID'], 
                "userID"=>$row['userID'],
                "picture"=>$row['picture'],
                "name"=>$row['name'],
                "serviceName"=>$row['serviceName'],
                "pricing"=>$row['pricing'],
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