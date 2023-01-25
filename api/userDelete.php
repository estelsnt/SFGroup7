<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $postData = json_decode($content, true);
    $id = $_GET["id"];
    $sql = "DELETE FROM useraddress WHERE `useraddress`.`userAddressID` = {$id};";
    $sql1 = "DELETE FROM users WHERE `users`.`userID` = {$id}";

    $result = $conn->query($sql);
    $result2 = $conn->query($sql1);
    echo json_encode($content);
?>