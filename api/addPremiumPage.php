<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $postData = json_decode($content, true);
    $sql = "INSERT INTO premiumpost 
            (userID, title, postDate, postDuration)
            VALUES 
            (
                {$postData['userID']},
                '{$postData['title']}',
                now(),
                '{$postData['postDuration']}'
            );
    ";
    if(mysqli_query($conn, $sql)){
        $lastID = mysqli_insert_id($conn);
        echo json_encode(array("lastID"=>$lastID));
    }
?>