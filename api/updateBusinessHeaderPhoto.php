<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $postData = json_decode($content, true);
    $sql = "UPDATE premiumpost SET
            featuredPhoto='{$postData['photo']}'
            WHERE pID ={$postData['id']};";
    $result = $conn->query($sql);
    echo json_encode($content);
?>