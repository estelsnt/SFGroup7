//retrievePassword.php - api for recovering account
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $content = trim(file_get_contents("php://input"));
    $otpData = json_decode($content, true);
    $sql = "INSERT INTO otp
            (otpCode, contactNumber, otpDateTime, isSent, requestType)
            VALUES
            (
                (SELECT users.passWord FROM users WHERE users.contactNumber = '{$otpData['contactNumber']}'),
                '{$otpData['contactNumber']}',
                now(),
                'FALSE',
                'PASS'
            );";
    if(mysqli_query($conn, $sql)){
        $lastID = mysqli_insert_id($conn);
        echo json_encode(array("lastID"=>$lastID));
    }
?>