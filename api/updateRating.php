<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $ratingData = json_decode($content, true);
    $sql = "UPDATE ratings SET
            rating = {$ratingData['rating']}
            WHERE userID = {$ratingData['userID']} AND pID = {$ratingData['pID']};";
    $result = $conn->query($sql);
    echo json_encode($content);
?>