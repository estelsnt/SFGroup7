//getPremiumPageListItems.php - api to get the lists in pages
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $id = $_GET["id"];
    $sql = "SELECT pListItemsID, item
            FROM plistitems
            WHERE pID = ". $id .";";
    $result = $conn ->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, ["pListItemsID"=>$row['pListItemsID'], "item"=>$row['item']]);
        }
        echo json_encode($d);
    }else{
        $d["pListItemsID"]=0;
        echo json_encode($d);   
    }
?>