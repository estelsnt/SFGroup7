//getUserOrderCount.php - api to get the orders posted by user
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $id = $_GET["id"];
    $sql = "SELECT COUNT(serviceorder.serviceOrderID) AS 'posts'
            FROM serviceorder
            WHERE serviceOrder.userID = ".$id.";";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, ["posts"=>$row['posts']]);
        }
        echo json_encode($d);
    }else{
        $d["posts"]=0;
        echo json_encode($d);   
    }
?>