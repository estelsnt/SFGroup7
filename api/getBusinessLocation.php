//getBusinessLocation.php - api for retrieving business address
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $sql = "SELECT
            useraddress.address,
            refbrgy.brgyDesc AS 'barangay',
            refcitymun.citymunDesc AS 'cityMun',
            refprovince.provDesc AS 'province'
            FROM useraddress
            JOIN refbrgy ON refbrgy.brgyCode = useraddress.brgyCode
            JOIN refcitymun ON refcitymun.citymunCode = useraddress.citymunCode
            JOIN refprovince ON refprovince.provCode = useraddress.provCode
            JOIN premiumpost ON premiumpost.userID = useraddress.userID
            WHERE premiumpost.pID = ".$id.";";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                "address"=>$row['address'],
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