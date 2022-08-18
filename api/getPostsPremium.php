<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $cov = $_GET["cov"];
    $loc = $_GET["loc"];
    $service = $_GET["service"];

    $sql = "SELECT
            premiumpost.pID,
            premiumpost.userID,
            CONCAT(
            users.firstName, ' ',
            users.lastName) AS 'name',
            premiumpost.featuredPhoto,
            premiumpost.title,
            premiumpost.description,
            CONCAT(
            useraddress.address, ' ',
            refbrgy.brgyDesc, ' ',
            refcitymun.citymunDesc, ' ',
            refprovince.provDesc) AS 'location'
            FROM premiumpost
            JOIN users ON users.userID = premiumpost.userID
            JOIN useraddress ON useraddress.userID = premiumpost.userID
            JOIN refbrgy ON refbrgy.brgyCode = useraddress.brgyCode
            JOIN refcitymun ON refcitymun.citymunCode = useraddress.citymunCode
            JOIN refprovince ON refprovince.provCode = useraddress.provCode
            WHERE premiumpost.title LIKE '%".$service."%' OR premiumpost.description LIKE '%".$service."%'";
            
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
                "pID"=>$row['pID'], 
                "userID"=>$row['userID'],
                "name"=>$row['name'],
                "featuredPhoto"=>$row['featuredPhoto'],
                "title"=>$row['title'],
                "description"=>$row['description'],
                "location"=>$row['location']
            ]);
        }
        echo json_encode($d);
    }else{
        $d["servicePostingID"]=0;
        echo json_encode($d);   
    }
?>