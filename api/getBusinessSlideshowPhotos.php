//getBusinessSlideshowPhotos.php - api to retrieve slideshow images
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $sql = "SELECT *
            FROM pphotos
            WHERE pID =". $id ." ORDER BY pPhotosID DESC;";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                "pPhotosID"=>$row['pPhotosID'],
                "photo"=>$row['photo']
            ));
        }
        echo json_encode($d);
    }else{
        $d["pPhotosID"]=0;
        echo json_encode($d);   
    }
?>