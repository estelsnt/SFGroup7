//populateCityMun.php - api to get city and municipalities given province code
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $id = $_GET['id'];
    $sql = 'SELECT citymunCode, citymunDesc 
            FROM refcitymun
            WHERE provCode = '. $id .';
    ';
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $data = [];
        while($row = $result->fetch_assoc()){
            array_push($data, array("citymunCode"=>$row['citymunCode'], "description"=>$row['citymunDesc']));
        }
        echo json_encode($data);
    }
?>