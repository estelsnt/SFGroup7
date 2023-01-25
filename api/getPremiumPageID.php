<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $id = $_GET["id"];
    $sql = "SELECT pID, title
            FROM premiumpost
            WHERE userID = ".$id.";";
    $result = $conn ->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, ["pID"=>$row['pID'], "title"=>$row['title']]);
        }
        echo json_encode($d);
    }else{
        $d["pID"]=0;
        echo json_encode($d);   
    }
?>