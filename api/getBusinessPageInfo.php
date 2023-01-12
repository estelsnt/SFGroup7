//getBusinessPageInfo.php - api for retrieving page info
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['postID'];
    $sql = "SELECT *, CONCAT(users.firstName, ' ', users.lastName) AS 'ownerName'
            FROM premiumpost
            JOIN users ON users.userID = premiumpost.userID
            WHERE pID =". $id .";";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                "title"=>$row['title'],
                "description"=>$row['description'],
                "featuredPhoto"=>$row['featuredPhoto'],
                "postDate"=>$row['postDate'],
                "postDuration"=>$row['postDuration'],
                "userID"=>$row['userID'],
                "ownerName"=>$row['ownerName']
            ));
        }
        echo json_encode($d);
    }else{
        $d["posts"]=0;
        echo json_encode($d);   
    }
?>