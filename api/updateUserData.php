//updateUserData.php - api to change user data
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    try{
        $content = trim(file_get_contents("php://input"));
        $userData = json_decode($content, true);
        $sql = "UPDATE users 
                SET 
                userName = '{$userData['userName']}', 
                passWord = '{$userData['passWord']}', 
                lastName = '{$userData['lastName']}', 
                firstName = '{$userData['firstName']}', 
                middleName = '{$userData['middleName']}', 
                contactNumber = '{$userData['contactNumber']}', 
                email = '{$userData['email']}', 
                picture = '{$userData['picture']}', 
                gender = '{$userData['gender']}', 
                birthDate = '{$userData['birthDate']}' 
                WHERE users.userID = {$userData['id']};";
        $result = $conn->query($sql);
        echo json_encode($content);
    }catch(Exception $e){
        $d["update"]=0;
        echo json_encode($d);   
    }
?>