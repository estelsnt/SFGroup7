$("document").ready(()=>{
    let id = sessionStorage.getItem("toView");
    let pageInfo;
    let slideshowImage;
    let currentImg = 0;

    //message button
    $("#contact").click(()=>{
        console.log(pageInfo[0].userID);
        console.log([pageInfo]);
    });
    //load data
    let getPostdata = ()=>{
        fetch('../api/getBusinessPageInfo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postID: id
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            pageInfo = data;
            $("#businessTitle").text(data[0].title);
            if(data[0].featuredPhoto == undefined){
                $(".featuredPhoto").attr("src", "../images/icons8-picture-500.png");
            }else{
                $(".featuredPhoto").attr("src", data[0].featuredPhoto);
            }
            if(data[0].description != undefined){
                $("#businessDetails").text(data[0].description);
            }
        })
        .catch(error=>console.log("error on retrieval of this user posts"));
    };

    //list items
    let getListItems = ()=>{
        fetch('../api/getPremiumPageListItems.php?id=' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            $("#listItems").empty();
            for(let i = 0; i < data.length; i++){
                $("#listItems").append(`
                    <li>
                        <span>`+data[i].item+`</span>
                    </li>
                `);
            }
        })
        .catch(error=>console.log("error on retrieving list list"));
    };

    //slideshow
    let getSlideshowImage = ()=>{
        fetch('../api/getBusinessSlideshowPhotos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            if(data.pPhotosID == 0){
                slideshowImages = [{pPhotosID: 0, photo: "../images/icons8-picture-500.png"}];
            }else{
                slideshowImages = data;
            }
            $(".slideshowImage").attr("src", slideshowImages[0].photo);
        })
        .catch(error=>console.log("error on retrieving photo"));
    };

    $(".right").click(()=>{
        if(currentImg == slideshowImages.length -1){
            currentImg = 0;
        }else{
            currentImg += 1;
        }
        $(".slideshowImage").attr("src", slideshowImages[currentImg].photo);
    });
    
    $(".left").click(()=>{
        if(currentImg == 0){
            currentImg = slideshowImages.length - 1;
        }else{
            currentImg -= 1;
        }
        $(".slideshowImage").attr("src", slideshowImages[currentImg].photo);
    });

    //location
    let getLocation = ()=>{
        fetch('../api/getBusinessLocation.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            $("#location").text(data[0].address + " " + data[0].barangay + ", " + data[0].cityMun + ", " + data[0].province);
        })
        .catch(error=>console.log("error on retrieving location"));
    };

    //comments
    $("#submitComment").click(()=>{
        if($("#commentText").val() != ""){
            $("#submitComment").attr("disabled", true);
            fetch('../api/addComment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: sessionStorage.getItem("id"),
                    pID: id,
                    comment: $("#commentText").val()
                })
            })
            .then(res=>{return res.json()})
            .then(data=>{
                $("#submitComment").attr("disabled", false);
                $("#commentText").val("");
                getComments();
            })
            .catch(error=>console.log("error on sending comment"));
        }
    });

    let getComments = ()=>{
        fetch('../api/getComments.php?id='+id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            displayComment(data);
        })
        .catch(error=>console.log("error on retrieving comment"));
    };

    let displayComment = (data)=>{
        $(".comments").empty();
        for(let i in data){
            let comment = document.createElement("div");
            let commentName = document.createElement("p");
            let cText = document.createElement("p");

            comment.setAttribute("class", "comment");
            commentName.setAttribute("class", "commentName");
            cText.setAttribute("class", "cText");

            commentName.innerText = data[i].name;
            cText.innerText = data[i].comment

            comment.append(commentName);
            comment.append(cText);

            fetch('../api/getCommentReply.php?id='+data[i].pCommentsID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res=>{return res.json()})
            .then(data1=>{
                for(let j in data1){
                    if(data1[j].pCommentReplyID == undefined){
                        break;
                    }
                    let reply = document.createElement("div");
                    let replyName = document.createElement("p");
                    let cReply = document.createElement("p");

                    reply.setAttribute("class", "reply");
                    replyName.setAttribute("class", "replyName")
                    cReply.setAttribute("class", "cReply");

                    replyName.innerText = data1[j].title;
                    cReply.innerText = data1[j].reply;

                    reply.append(replyName);
                    reply.append(cReply);
                    comment.append(reply);
                    
                }
                $(".comments").append(comment);
            })
            .catch(error=>{console.log("error on retrieving replies")});
        }
    };

    //contact button
    $("#contact").click(()=>{
        $(".cname").text(pageInfo[0].title);
        $(".pageOwner").text(pageInfo[0].ownerName);
        $(".sendMessageContainer").css({display: "block"});
    });

    $("#closeSendMessage").click(()=>{   //closes the search panel on exit button clicked
        $(".sendMessageContainer").css({display: "none"});
    });

    $(".sendMessageContainer").mousedown(()=>{       //closes the search panel on click outside the search panel
        $(".sendMessageContainer").css({display: "none"});
    });

    $(".sendMessage").mousedown(()=>{        //prevents the searchpanel close event propagation (doesnt close when search panel clicked)
        window.event.stopPropagation();
    });

    //send message button
    $(".messagePageButton").click(()=>{
        //check if user is already in contact
        if(pageInfo[0].userID == sessionStorage.getItem("id")){
            return;
        }
        fetch('../api/checkContact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: sessionStorage.getItem("id"),
                cID: pageInfo[0].userID
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            sessionStorage.setItem("activeContact", pageInfo[0].userID);
            sessionStorage.setItem("activeContactName", $(".pageOwner").text());
            if(data[0].contactID > 0){
                //user already in contact proceed to messaging
                console.log("user already in contact");
                let msg = $("#sendMessageInput").val();
                if($("#sendMessageInput").val() == ""){
                    msg = "Hi, is this available?";
                }
                fetch('../api/sendMessage.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        senderUserID: sessionStorage.getItem("id"),
                        receiverUserID: pageInfo[0].userID,
                        message: msg
                    })
                })
                .then(res=>{return res.json()})
                .then(data=>{
                    //send initial message to user
                    $("sendMessageButton").prop("disabled", false);
                    location.href = "messages.html";
                })
                .catch(error=>console.log("error on sending message: " + error));
            }else{
                //add the user to contact
                fetch('../api/addToContact.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user1ID: sessionStorage.getItem("id"),
                        user2ID: pageInfo[0].userID,
                        subject: $(".cname").text() 
                    })
                })
                .then(res=>{return res.json()})
                .then(data=>{
                    //send initial message to user
                    console.log("proceed to send message");
                    let msg = $("#sendMessageInput").val();
                    if($("#sendMessageInput").val() == ""){
                        msg = "Hi, is this available?";
                    }
                    fetch('../api/sendMessage.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            senderUserID: sessionStorage.getItem("id"),
                            receiverUserID: pageInfo[0].userID,
                            message: msg
                        })
                    })
                    .then(res=>{return res.json()})
                    .then(data=>{
                        //send initial message to user
                        $("sendMessageButton").prop("disabled", false);
                        location.href = "messages.html";
                    })
                    .catch(error=>console.log("error on sending message: " + error));
                })
                .catch(error=>console.log("error on adding to contact: " + error));
            }
        })
        .catch(error=>console.log("error on checking contact: " + error));  
    });

    //get notifications (realtime)
    let getNotification = ()=>{
        fetch('../api/getNotificationAll.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: sessionStorage.getItem("id"),
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            if(data[0].notification <= 0 || data[0].notification == null){
                $(".notif").css({display: "none"});
            }else{
                if($(window).width() < 870){
                    $(".headerNotif").css({display: "block"});
                }
                $(".notif:not(.headerNotif)").css({display: "block"});  
                $(".notif").text(data[0].notification);
            }
        })
        .then(()=>{
            setTimeout(()=>{
                getNotification();
            }, 3000);
        })
        .catch(error=>console.log("error on checking notification: " + error));
    };

    //rating functions
    $("#rateThis").click(()=>{
        $(".ratingInput").css({display : "block"});
    });

    $("#s1").hover(()=>{
        $("#s1").attr("src", "../images/star active.png");
    }, ()=>{
        clearStars();
    });

    $("#s2").hover(()=>{
        $("#s1").attr("src", "../images/star active.png");
        $("#s2").attr("src", "../images/star active.png");
    }, ()=>{
        clearStars();
    });

    $("#s3").hover(()=>{
        $("#s1").attr("src", "../images/star active.png");
        $("#s2").attr("src", "../images/star active.png");
        $("#s3").attr("src", "../images/star active.png");
    }, ()=>{
        clearStars();
    });

    $("#s4").hover(()=>{
        $("#s1").attr("src", "../images/star active.png");
        $("#s2").attr("src", "../images/star active.png");
        $("#s3").attr("src", "../images/star active.png");
        $("#s4").attr("src", "../images/star active.png");
    }, ()=>{
        clearStars();
    });

    $("#s5").hover(()=>{
        $("#s1").attr("src", "../images/star active.png");
        $("#s2").attr("src", "../images/star active.png");
        $("#s3").attr("src", "../images/star active.png");
        $("#s4").attr("src", "../images/star active.png");
        $("#s5").attr("src", "../images/star active.png");
    }, ()=>{
        clearStars();
    });

    const clearStars = ()=>{
        $("#s1").attr("src", "../images/star inactive.png");
        $("#s2").attr("src", "../images/star inactive.png");
        $("#s3").attr("src", "../images/star inactive.png");
        $("#s4").attr("src", "../images/star inactive.png");
        $("#s5").attr("src", "../images/star inactive.png"); 
    };

    $("#s1").click(()=>{
        rating(1);
    });

    $("#s2").click(()=>{
        rating(2);
    });

    $("#s3").click(()=>{
        rating(3);
    });

    $("#s4").click(()=>{
        rating(4);
    });

    $("#s5").click(()=>{
        rating(5);
    });

    //set rating
    let rating = (stars) =>{
        console.log(stars);
        //check if user already rated this service
        fetch('../api/checkRating.php?id=' + sessionStorage.getItem("id"), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            if(data[0].ratingID == 0){
                //register new rating record
                fetch('../api/addRating.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userID: sessionStorage.getItem("id"),
                        pID: id,
                        rating: stars
                    })
                })
                .then(()=>{
                    location.reload();
                })
                .catch(error=>console.log("error on sending rating"));
            }else{
                //update rating record
                fetch('../api/updateRating.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userID: sessionStorage.getItem("id"),
                        pID: id,
                        rating: stars
                    })
                })
                .then(()=>{
                    location.reload();
                })
                .catch(error=>console.log("error on updating rating"));
            }
        })
        .catch(error=>console.log("error on checking ratings: " + error));
    };

    //get ratings
    let getRatings = ()=>{
        fetch('../api/getRating.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pID: id
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            if(data[0].ratings != 0){
                if(data[0].stars >= 1){
                    $("#r1").attr("src", "../images/star active.png");
                }
                if(data[0].stars >= 2){
                    $("#r2").attr("src", "../images/star active.png");
                }
                if(data[0].stars >= 3){ 
                      $("#r3").attr("src", "../images/star active.png");
                }
                if(data[0].stars >= 4){
                    $("#r4").attr("src", "../images/star active.png");
                }
                if(data[0].stars >= 5){
                    $("#r5").attr("src", "../images/star active.png"); 
                }
                $(".ratingDesc").text(data[0].ratings + " ratings");
            }
        })
        .catch(error=>console.log("error on retrieval of rating"));
    };

    getNotification();

    //initial functions call
    getComments();
    getPostdata();
    getListItems();
    getSlideshowImage();
    getLocation();
    getRatings();
});