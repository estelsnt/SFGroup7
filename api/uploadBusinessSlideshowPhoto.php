<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $postData = json_decode($content, true);
    $sql = "INSERT INTO pphotos
            (pID, photo)
            VALUES
            (
                {$postData['id']},
                '{$postData['photo']}'
            )";
    $result = $conn->query($sql);
    echo json_encode($content);
?>