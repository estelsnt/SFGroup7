//getComments.php - api for retrieving comments in page
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $id = $_GET["id"];
    $sql = "SELECT
            pcomments.pCommentsID,
            CONCAT(
            users.firstName, ' ',
            users.lastName) AS 'name',
            pcomments.comment
            FROM pcomments
            JOIN users ON users.userID = pcomments.userID
            WHERE pcomments.pID = ".$id.";";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                "pCommentsID"=>$row['pCommentsID'], 
                "name"=>$row['name'], 
                "comment"=>$row['comment']
            ));
        }
        echo json_encode($d);
    }else{
        $d["pCommentsID"]=0;
        echo json_encode($d);   
    }
?>