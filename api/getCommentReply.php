//getCommentReply.php - api for retrieving replies in comment
<?php
    include 'connection.php';
    if($conn->connect_error){
        die($conn->connect_error);
    }
    $id = $_GET["id"];
    $sql = "SELECT
            pcommentreply.pCommentReplyID,
            premiumpost.title,
            pcommentreply.reply
            FROM pcommentreply
            JOIN premiumpost ON premiumpost.pID = pcommentreply.pID
            WHERE pcommentreply.pCommentsID =".$id.";";
    $result = $conn->query($sql);
    $d = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            array_push($d, array(
                "pCommentReplyID"=>$row['pCommentReplyID'], 
                "title"=>$row['title'], 
                "reply"=>$row['reply']
            ));
        }
        echo json_encode($d);
    }else{
        $d["pCommentReplyID"]=0;
        echo json_encode($d);   
    }
?>