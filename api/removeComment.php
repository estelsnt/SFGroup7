<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $postData = json_decode($content, true);
    $sql = "DELETE FROM pcommentreply
            WHERE pCommentsID ={$postData['id']};";
    $sql1 = "DELETE FROM pcomments
            WHERE pCommentsID ={$postData['id']};";
    $result = $conn->query($sql);
    $result1 = $conn->query($sql1);
    echo json_encode($content);
?>