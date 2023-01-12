//getRatings.php - api to get the ratings in pages
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $pageData = json_decode($content, true);
    $sql = "SELECT
            COUNT(ratings.ratingID) AS 'ratings',
            ROUND(AVG(ratings.rating)) AS 'stars'
            FROM ratings
            WHERE ratings.pID = {$pageData['pID']};";
    $result = $conn->query($sql);
    if($result->num_rows > 0){
        $data = [];
        while($row = $result->fetch_assoc()){
            array_push($data, array("ratings"=>$row['ratings'], "stars"=>$row['stars']));
        }
        echo json_encode($data);
    }else{
        echo json_encode('[{"ratings":0, "stars":0}]');
    }
?>