$("document").ready(()=>{

    let slideshowImages;
    let pageInfo;
    //track the index of current image from slideshow image array
    let currentImg = 0;

    let subscription = "20";

    

    //load data
    let getPostdata = ()=>{
        fetch('../api/getBusinessPageInfo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postID: sessionStorage.getItem("businessPage")
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            pageInfo = data;
            pid = sessionStorage.getItem("businessPage");
            $("#duration").text("duration: " + data[0].postDuration);
            $("#businessName").val(data[0].title);
            if(data[0].featuredPhoto == undefined){
                $("#featuredPhoto").attr("src", "../images/icons8-picture-500.png");
            }else{
                $("#featuredPhoto").attr("src", data[0].featuredPhoto);
            }
            if(data[0].description != undefined){
                $("#businessDetails").val(data[0].description);
            }
        })
        .catch(error=>console.log("error on retrieval of this user posts"));
    };

    getPostdata();

    $("#businessName").keyup(()=>{
        $("#businessName").css({height: "0"});
        $("#businessName").css({height: $("#businessName").prop('scrollHeight') + "px"});
    });

    $("#businessDetails").keyup(()=>{
        $("#businessDetails").css({height: "0"});
        $("#businessDetails").css({height: $("#businessDetails").prop('scrollHeight') + "px"});
    });

    //always trigger keyup to resize textarea
    $("#businessName").keyup();
    $("#businessDetails").keyup();
    
    //edit title
    $("#businessName").keyup(()=>{
        $("#editBusinessName").attr("src", "../images/check.png");
    });

    $("#editBusinessName").click(()=>{
        if($("#businessName").val() == pageInfo[0].title){
            $("#businessName").css({border: "1px solid gold"});
            setTimeout(()=>{
                $("#businessName").css({border: "1px solid grey"});
            }, 1000);
        }else{
            let name = $("#businessName").val();
            name = name.replace("'", "\\'");
            fetch('../api/updateBusinessTitle.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: sessionStorage.getItem("businessPage"),
                    title: name
                })
            })
            .then(res=>{return res.json()})
            .then(data=>{
                $("#businessName").css({border: "1px solid gold"});
                $("#editBusinessName").attr("src", "../images/edit.png");
                setTimeout(()=>{
                    $("#businessName").css({border: "1px solid grey"});
                }, 1000);
            })
            .catch(error=>console.log("error on retrieval of this user posts"));
        }
    });

    //edit description
    $("#businessDetails").keyup(()=>{
        $("#editBusinessDetails").attr("src", "../images/check.png");
    });

    $("#editBusinessDetails").click(()=>{
        if($("#businessDetails").val() == pageInfo[0].details){
            $("#businessDetails").css({border: "1px solid gold"});
            setTimeout(()=>{
                $("#businessDetails").css({border: "1px solid grey"});
            }, 1000);
        }else{
            let details = $("#businessDetails").val();
            details = details.replace("'", "\\'");
            fetch('../api/updateBusinessDescription.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: sessionStorage.getItem("businessPage"),
                    description: details
                })
            })
            .then(res=>{return res.json()})
            .then(data=>{
                $("#businessDetails").css({border: "1px solid gold"});
                $("#editBusinessDetails").attr("src", "../images/edit.png");
                setTimeout(()=>{
                    $("#businessDetails").css({border: "1px solid grey"});
                }, 1000);
            })
            .catch(error=>console.log("error on retrieval of this user posts"));
        }
    });

    //change header photo
    function previewProfileImage(uploader) {   
        //ensure a file was selected 
        if (uploader.files && uploader.files[0]) {
            var imageFile = uploader.files[0];
            var reader = new FileReader();    
            reader.onload = function (e) {
                //set the image data as source
                $('#featuredPhoto').attr('src', e.target.result);
                //save photo to database
                fetch('../api/updateBusinessHeaderPhoto.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: sessionStorage.getItem("businessPage"),
                        photo: $('#featuredPhoto').attr('src')
                    })
                })
                .catch(error=>console.log("error on retrieval of this user posts"));
            }    
            reader.readAsDataURL( imageFile );
        }
    }
    
    $("#uploadFeaturedPhoto").change(function(){
        previewProfileImage(this);
    });

    //list items
    getListItems();

    $("#addList").click(()=>{
        if($("#addListInput").val() != ""){
            let item = $("#addListInput").val();
            item = item.replace("'", "\\'");
            fetch('../api/addPremiumPageList.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: sessionStorage.getItem("businessPage"),
                    item: item
                })
            })
            .then(()=>{
                $("#addListInput").val("");
                getListItems();
            })
            .catch(error=>console.log("error on inserting list"));
        }
    });

    //slideshow
    function previewSlideshowImage(uploader) {   
        //ensure a file was selected 
        if (uploader.files && uploader.files[0]) {
            var imageFile = uploader.files[0];
            var reader = new FileReader();    
            reader.onload = function (e) {
                //set the image data as source
                $('.slideshowImage').attr('src', e.target.result);
                //save photo to database
                fetch('../api/uploadBusinessSlideshowPhoto.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: sessionStorage.getItem("businessPage"),
                        photo: $('.slideshowImage').attr('src')
                    })
                })
                .then(()=>{
                    getSlideshowImage();
                })
                .catch(error=>console.log("error on uploading photo"));
            }    
            reader.readAsDataURL( imageFile );
        }
    }
    
    $("#uploadSlideshowPhoto").change(function(){
        previewSlideshowImage(this);
    });


    let getSlideshowImage = ()=>{
        fetch('../api/getBusinessSlideshowPhotos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: sessionStorage.getItem("businessPage"),
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
  
    getSlideshowImage();

    $("#removeSlideshowImage").click(()=>{
        fetch('../api/removeBusinessSlideshowImage.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: slideshowImages[currentImg].pPhotosID
            })
        })
        .then(()=>{
            getSlideshowImage();
        })
        .catch(error=>console.log("error on removing photo"));
    });

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

    //extend subscription
    $("#extend").click(()=>{
        $(".createPostPremiumContainer").css({display: "block"});
    });

    //controls
    $("#createPostPremiumClose").click(()=>{
        $(".createPostPremiumContainer").css({display: "none"});
    });

    $(".createPostPremiumContainer").mousedown(()=>{
        $(".createPostPremiumContainer").css({display: "none"});
    });
    
    $(".createPostPremium").mousedown(()=>{
        window.event.stopPropagation();
    });

    //redeem
    $("#redeem").click(()=>{
        // console.log(sessionStorage.getItem("businessPage"));
        // console.log(pageInfo[0].postDuration);
        // console.log(typeof(pageInfo[0].postDuration));
        
        // let d = new Date(pageInfo[0].postDuration);
        // d.setMonth(d.getMonth() + 1);
        // console.log(d.toISOString().slice(0, 10));
        let d = new Date(pageInfo[0].postDuration);
        let today = new Date();
        if(d < today){
            console.log("kunin date ngayon + 1 month");   
        }else{
            console.log("+1 month agad");   
        }
    });
    
    $("#m1").click(()=>{
        subscription = "20";
    });

    $("#m12").click(()=>{
        subscription = "200"
    });

    paypal.Buttons({
        createOrder: (data, actions)=>{
            if($("#businessName").val() == ""){
                $("#businessName").css({border: "1px solid red"});
                return;
            }
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: subscription,
                        currency_code: "PHP"
                    }
                }]
            })
        },
        onApprove: (data, actions)=>{
            return actions.order.capture().then((details)=>{
                //on successful transaction
                let d = new Date(pageInfo[0].postDuration);
                let today = new Date();
                //check if post duration is from the past then upon extension, get the date today and add the extension
                if(d < today){
                    d = today;   
                }
                switch(subscription){
                    case "20":
                        d.setMonth(d.getMonth() + 1);
                    break;
                    case "200":
                        d.setMonth(d.getMonth() + 12);
                    break;
                }
                console.log(details);
                fetch('../api/extendPremiumPage.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: sessionStorage.getItem("businessPage"),
                        postDuration: d.toISOString().slice(0, 10)
                    })
                })
                .then(res=>{return res.json()})
                .then(data=>{
                    //feedback after success
                    $(".createPostPremiumContainer").css({display: "none"});
                    location.href = "../pages/createBusinessPage.html";
                })
                .catch(error=>console.log("critical error on extending premium post duration"));
            })
        }
    }).render('#paypalButtonContainer');

    //preview
    $("#preview").click(()=>{
        console.log("clc");
        sessionStorage.setItem("toView", sessionStorage.getItem("businessPage"));
        location.href = "businessPage.html";
    });

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
                    pID: sessionStorage.getItem("businessPage"),
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
        fetch('../api/getComments.php?id='+sessionStorage.getItem("businessPage"), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            console.log(data);
            displayComment(data);
        })
        .catch(error=>console.log("error on retrieving comment"));
    };

    let displayComment = (data)=>{
        $(".comments").empty();
        console.log(data);
        for(let i in data){
            let comment = document.createElement("div");
            let rComment = document.createElement("button");
            let commentName = document.createElement("p");
            let cText = document.createElement("p");

            let replyBox = document.createElement("div");
            let replyInput = document.createElement("textarea");
            let replyButton = document.createElement("button");

            comment.setAttribute("class", "comment");
            rComment.setAttribute("class", "removeComment");
            rComment.setAttribute("onclick", "removeComment("+data[i].pCommentsID+")");
            commentName.setAttribute("class", "commentName");
            cText.setAttribute("class", "cText");

            replyBox.setAttribute("class", "replyBox");
            replyInput.setAttribute("class", "replyInput");
            replyInput.setAttribute("placeholder", "write reply");
            replyInput.setAttribute("id", "replyInput" + data[i].pCommentsID);
            replyButton.setAttribute("class", "replyButton");
            replyButton.setAttribute("onclick", "addReply("+data[i].pCommentsID+")");

            commentName.innerText = data[i].name;
            cText.innerText = data[i].comment
            replyButton.innerText = "reply";

            comment.append(rComment);
            comment.append(commentName);
            comment.append(cText);
            replyBox.append(replyInput);
            replyBox.append(replyButton);

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
                    let rReply = document.createElement("button");
                    let replyName = document.createElement("p");
                    let cReply = document.createElement("p");
                    
                    reply.setAttribute("class", "reply");
                    rReply.setAttribute("class", "removeReply");
                    rReply.setAttribute("onclick", "removeReply("+data1[j].pCommentReplyID+")");
                    replyName.setAttribute("class", "replyName")
                    cReply.setAttribute("class", "cReply");

                    replyName.innerText = data1[j].title;
                    cReply.innerText = data1[j].reply;

                    reply.append(rReply);
                    reply.append(replyName);
                    reply.append(cReply);
                    comment.append(reply);
                }
                $(".comments").append(comment);
            })
            .catch(error=>{console.log("error on retrieving replies")});
            comment.append(replyBox);
        }
    };

    getComments();
});

let getListItems = ()=>{
    fetch('../api/getPremiumPageListItems.php?id=' + sessionStorage.getItem("businessPage"), {
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
                    <div class="item">
                        <span>`+data[i].item+`</span>
                        <img src="../images/close.png" class="removeItem" onclick="removeList(`+data[i].pListItemsID+`)">
                    </div>
                </li>
            `);
        }
    })
    .catch(error=>console.log("error on retrieving list list"));

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

    getNotification();
};

let removeComment = (cid)=>{
    console.log(cid);
    fetch('../api/removeComment.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: cid,           
        })
    })
    .then(()=>{
        location.reload();
    })
    .catch(error=>console.log("error on removing comment"));
};

let removeReply = (cid)=>{
    fetch('../api/removeReply.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: cid
        })
    })
    .then(()=>{
        location.reload();
    })
    .catch(error=>console.log("error on inserting reply"));
};

let addReply = (cid)=>{
    fetch('../api/addReply.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pCommentsID: cid,
            pID: sessionStorage.getItem("businessPage"),
            reply: $("#replyInput"+cid).val()
        })
    })
    .then(()=>{
        location.reload();
    })
    .catch(error=>console.log("error on inserting reply"));
};

let removeList = (id)=>{
    fetch('../api/removePremiumPageListItem.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    })
    .then(()=>{
        getListItems();
    })
    .catch(error=>console.log("error on inserting list"));
};
