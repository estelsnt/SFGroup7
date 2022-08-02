<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['userID'];

    $sqlbrgy = "SELECT refbrgy.brgyDesc, refbrgy.brgyCode
                FROM refbrgy
                JOIN useraddress ON useraddress.brgyCode = refbrgy.brgyCode
                WHERE useraddress.userID = ".$id.";";
    
    $sqlcitymun = "SELECT refcitymun.citymunDesc, refcitymun.citymunCode
                FROM refcitymun 
                WHERE refcitymun.citymunCode = (
                SELECT refbrgy.citymunCode 
                FROM refbrgy
                JOIN useraddress ON useraddress.brgyCode = refbrgy.brgyCode
                WHERE useraddress.userID = ".$id.")";

    $sqlprov = "SELECT refprovince.provDesc, refprovince.provCode
                FROM refprovince
                WHERE refprovince.provCode = (
                SELECT refbrgy.provCode
                FROM refbrgy
                JOIN useraddress ON useraddress.brgyCode = refbrgy.brgyCode
                WHERE useraddress.userID = ".$id.")";

    $sqlreg = "SELECT refregion.regDesc, refregion.regCode
                FROM refregion
                WHERE refregion.regCode = (
                SELECT refbrgy.regCode
                FROM refbrgy
                JOIN useraddress ON useraddress.brgyCode = refbrgy.brgyCode
                WHERE useraddress.userID = ".$id.");";

    $sqladd = "SELECT useraddress.address
                FROM useraddress
                WHERE useraddress.userID = ".$id.";";

    $resultbrgy = $conn->query($sqlbrgy);
    $resultcitymun = $conn->query($sqlcitymun);
    $resultprov = $conn->query($sqlprov);
    $resultreg = $conn->query($sqlreg);
    $resultadd = $conn->query($sqladd);
    $d = [];

    if($resultbrgy->num_rows > 0){
        while($row = $resultbrgy->fetch_assoc()){
            array_push($d, array("brgy"=>array("brgyDesc"=>$row['brgyDesc'], "brgyCode"=>$row['brgyCode'])));
        }
    }

    if($resultcitymun->num_rows > 0){
        while($row = $resultcitymun->fetch_assoc()){
            array_push($d, array("citymun"=>array("citymunDesc"=>$row['citymunDesc'], "citymunCode"=>$row['citymunCode'])));
        }
    }

    if($resultprov->num_rows > 0){
        while($row = $resultprov->fetch_assoc()){
            array_push($d, array("prov"=>array("provDesc"=>$row['provDesc'], "provCode"=>$row['provCode'])));
        }
    }

    if($resultreg->num_rows > 0){
        while($row = $resultreg->fetch_assoc()){
            array_push($d, array("reg"=>array("regDesc"=>$row['regDesc'], "regCode"=>$row['regCode'])));
        }
    }

    if($resultadd->num_rows > 0){
        while($row = $resultadd->fetch_assoc()){
            array_push($d, array("address"=>array("address"=>$row['address'])));
        }
    }

    echo json_encode($d);

?>