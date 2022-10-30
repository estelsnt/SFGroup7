$("document").ready(()=>{

    let slideshowImages;
    let pageInfo;
    //track the index of current image from slideshow image array
    let currentImg = 0;

    let subscription = "20";
    //load data
    let getPostdata = ()=>{
        $(".loading").css({display: "block"});
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
            let curd = new Date();
            let gdt = new Date(data[0].postDuration);
            pageInfo = data;
            pid = sessionStorage.getItem("businessPage");
            $(".loading").css({display: "none"});
            $("#duration").text("duration: " + data[0].postDuration);
            if(gdt < curd){
                $("#duration").css({color: "red"});
                $("#duration").text( $("#duration").text() + " (expired)");
            }
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
            $(".loading").css({display: "block"});
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
                $(".loading").css({display: "none"});
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
            $(".loading").css({display: "block"});
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
                $(".loading").css({display: "none"});
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
        if(uploader.files[0].size > 150000){
            alert("file too large");
            $("#uploadFeaturedPhoto").val("");
            return;
        }
        if (uploader.files && uploader.files[0]) {
            var imageFile = uploader.files[0];
            var reader = new FileReader();    
            reader.onload = function (e) {
                //set the image data as source
                $('#featuredPhoto').attr('src', e.target.result);
                //save photo to database
                $(".loading").css({display: "block"});
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
                .then(()=>{
                    $(".loading").css({display: "none"});
                    location.reload();
                })
                .catch((error)=>{
                    console.log("error on updating featured photo" + error);
                    location.reload();
                });
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
            $(".loading").css({display: "block"});
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
                $(".loading").css({display: "none"});
                $("#addListInput").val("");
                getListItems();
            })
            .catch(error=>console.log("error on inserting list"));
        }
    });

    //slideshow
    function previewSlideshowImage(uploader) {   
        //ensure a file was selected 
        if(uploader.files[0].size > 150000){
            alert("file too large");
            $("#uploadSlideshowPhoto").val("");
            return;
        }
        if (uploader.files && uploader.files[0]) {
            var imageFile = uploader.files[0];
            var reader = new FileReader();    
            reader.onload = function (e) {
                //set the image data as source
                $('.slideshowImage').attr('src', e.target.result);
                //save photo to database
                $(".loading").css({display: "block"});
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
                    $(".loading").css({display: "none"});
                    location.reload();
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
        $(".loading").css({display: "block"});
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
            $(".loading").css({display: "none"});
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
        $(".loading").css({display: "block"});
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
            $(".loading").css({display: "none"});
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
        if($("#businessName").val() == ""){
            $("#businessName").css({border: "1px solid red"});
            return;
        }
        $("#redeem").css({display: "none"});
        $("#redeemInput").css({display: "block"});
    });

    $("#redeemInput").keyup(()=>{
        if($("#redeemInput").val() == "capstone2022"){
            //on successful transaction
            let d = new Date(pageInfo[0].postDuration);
            let today = new Date();
            //check if post duration is from the past then upon extension, get the date today and add the extension
            if(d < today){
                d = today;   
            }
            d.setMonth(d.getMonth() + 12);
            $(".loading").css({display: "block"});
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
                $(".loading").css({display: "none"});
                $(".createPostPremiumContainer").css({display: "none"});
                location.href = "../pages/createBusinessPage.html";
            })
            .catch(error=>console.log("critical error on extending premium post duration"));
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
                $(".loading").css({display: "block"});
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
                    $(".loading").css({display: "none"});
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
            $(".loading").css({display: "block"});
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
                $(".loading").css({display: "none"});
                $("#submitComment").attr("disabled", false);
                $("#commentText").val("");
                getComments();
            })
            .catch(error=>console.log("error on sending comment"));
        }
    });

    let getComments = ()=>{
        $(".loading").css({display: "block"});
        fetch('../api/getComments.php?id='+sessionStorage.getItem("businessPage"), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            $(".loading").css({display: "none"});
            displayComment(data);
        })
        .catch(error=>console.log("error on retrieving comment"));
    };

    let displayComment = (data)=>{
        $(".comments").empty();
        if(data.pCommentsID == 0){
            return;
        }
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
    $(".loading").css({display: "block"});
    fetch('../api/getPremiumPageListItems.php?id=' + sessionStorage.getItem("businessPage"), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res=>{return res.json()})
    .then(data=>{
        $(".loading").css({display: "none"});
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

    //get ratings
    let getRatings = ()=>{
        $(".loading").css({display: "block"});
        fetch('../api/getRating.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pID: sessionStorage.getItem("businessPage")
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            $(".loading").css({display: "none"});
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

    //get rating info
    let getRatingInfo = ()=>{
        $(".loading").css({display: "block"});
        fetch('../api/getRatingInfo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pID: sessionStorage.getItem("businessPage")
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            $(".loading").css({display: "none"});
            if(data == "[{name:0, rating:0}]"){
                return;
            }
            if(data[0].name != 0){
                for(let i in data){
                    $("#ratingInfo").append("<li>" + data[i].name + ": " + data[i].rating + " stars" + "</li>");
                }
            }
        })
        .catch(error=>console.log("error on retrieval of rating"));
    };

    getNotification();
    getRatings();
    getRatingInfo();
};

let removeComment = (cid)=>{
    $(".loading").css({display: "block"});
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
        $(".loading").css({display: "none"});
        location.reload();
    })
    .catch(error=>console.log("error on removing comment"));
};

let removeReply = (cid)=>{
    $(".loading").css({display: "block"});
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
        $(".loading").css({display: "none"});
        location.reload();
    })
    .catch(error=>console.log("error on inserting reply"));
};

let addReply = (cid)=>{
    $(".loading").css({display: "block"});
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
        $(".loading").css({display: "none"});
        location.reload();
    })
    .catch(error=>console.log("error on inserting reply"));
};

let removeList = (id)=>{
    $(".loading").css({display: "block"});
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
        $(".loading").css({display: "none"});
        getListItems();
    })
    .catch(error=>console.log("error on inserting list"));
};
