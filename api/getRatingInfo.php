<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $pageData = json_decode($content, true);
    $sql = "SELECT 
            CONCAT(users.firstName, ' ', users.lastName) AS 'name',
            ratings.rating
            FROM ratings
            JOIN users ON users.userID = ratings.userID
            WHERE pID = {$pageData['pID']};";
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $data = [];
        while($row = $result->fetch_assoc()){
            array_push($data, array("name"=>$row['name'], "rating"=>$row['rating']));
        }
        echo json_encode($data);
    }else{
        echo json_encode('[{name:0, rating:0}]');
    }
?>