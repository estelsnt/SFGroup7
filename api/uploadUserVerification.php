//uploadUserVerification.php - api for uploading ids for verification
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $userData = json_decode($content, true);
    $sql = "INSERT INTO userverification
            (userID, id1, id2, verified)
            VALUES 
            (
                '{$userData['userID']}',
                '{$userData['id1']}',
                '{$userData['id2']}',
                'FALSE'
            );";
    $result = $conn->query($sql);
    echo json_encode($content);
?>