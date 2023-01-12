//addReply.php - api for replying to pages
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $serviceData = json_decode($content, true);
    $sql = "INSERT INTO pcommentreply
            (pCommentsID, pID, reply)
            VALUES 
            (
                '{$serviceData['pCommentsID']}',
                '{$serviceData['pID']}',
                '{$serviceData['reply']}'
            );";
    if(mysqli_query($conn, $sql)){
        $lastID = mysqli_insert_id($conn);
        echo json_encode(array("lastID"=>$lastID));
    }
?>