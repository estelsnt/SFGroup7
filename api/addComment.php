//addcomment.php - api for inserting comments in pages
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $serviceData = json_decode($content, true);
    $sql = "INSERT INTO pcomments 
            (userID, pID, comment)
            VALUES 
            (
                '{$serviceData['userID']}',
                '{$serviceData['pID']}',
                '{$serviceData['comment']}'
            );";
    if(mysqli_query($conn, $sql)){
        $lastID = mysqli_insert_id($conn);
        echo json_encode(array("lastID"=>$lastID));
    }
?>