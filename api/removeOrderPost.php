//removeOrderPost.php - api to delete order post
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $postData = json_decode($content, true);
    $sql = "DELETE FROM serviceorder 
            WHERE serviceOrderID ={$postData['id']};";
    $result = $conn->query($sql);
    echo json_encode($content);
?>