//dashboard events listener
$("document").ready(()=>{

    let userAddress;
    let postNormal;
    let postOrder;
    let postPremium;

    let postLimit = 10;
    let postNormalCount = 0, postOrderCount  = 0, postPremiumCount = 0;
    let postNormalLastIndex = 0, postOrderLastIndex = 0, postPremiumLastIndex = 0;

    let limit = 0;

    const pageProtection = ()=>{
        if(sessionStorage.getItem("id") == undefined){
            window.location = "../pages/login.html";
        }
    }

    pageProtection();

    //posts
    //business service offers (posts api needs coverage location and service, for all posts pass empty string)
    let loadPremiumPost = (cov, loc, service)=>{
        fetch('../api/getPostsPremium.php?cov='+cov+"&loc="+loc+"&service="+service, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            postPremium = data;
            displayPremiumPost(postPremium);
        })
        .catch(error=>console.log("error on retrieval of premium posts: " + error));
    };
    //write premium posts to dom
    let displayPremiumPost = (posts)=>{
        try{
            for(let i in posts){
                if(postPremiumCount >= postLimit){
                    return;
                }
                $(".postsContainer").append(`
                    <div class="post `+posts[postPremiumLastIndex].verified+` premiumPostContainer">
                        <div class="postHeader">
                            <span class="businessTitle">`+posts[postPremiumLastIndex].title+`</span>
                        </div>
                        <img src="`+posts[postPremiumLastIndex].featuredPhoto+`" class="postPicture">
                        <div class="postContent">
                            <span class="description">`+posts[postPremiumLastIndex].description+`</span>
                            <span class="location">`+posts[postPremiumLastIndex].location+`</span>
                        </div>
                        
                        <button class="messageButton" onclick="visitPage(`+posts[postPremiumLastIndex].pID+`)">Visit page</button>
                    </div>
                `);
                postPremiumLastIndex++;
                postPremiumCount++;
            }
        }catch(e){
            limit++;
            console.log("reached limit");
            if(limit >= 3){
                $(".loadMore").css({display: "none"});
            }
            return;
        }
    };

    //normal service offers (posts api needs coverage location and service, for all posts pass empty string)
    let loadNormalPost = (cov, loc, service)=>{
        fetch('../api/getPostsNormal.php?cov='+cov+"&loc="+loc+"&service="+service, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            postNormal = data;
            displayNormalPost(postNormal);
        })
        .catch(error=>console.log("error on retrieval of normal posts: " + error));
    };
    //write normal posts to dom
    let displayNormalPost = (posts)=>{
        try{
            for(let i in posts){
                if(postNormalCount >= postLimit){
                    return;
                }
                $(".postsContainer").append(`
                    <div class="post `+posts[postNormalLastIndex].verified+`">
                        <div class="postHeader">
                            <img src="`+posts[postNormalLastIndex].picture+`" class="profilePicture">
                            <span class="name">`+posts[postNormalLastIndex].name+`</span>
                        </div>
                        <div class="postContent">
                            <span class="service">`+posts[postNormalLastIndex].serviceName+`</span>
                            <span class="description">`+posts[postNormalLastIndex].description+`</span>
                            <span class="pricing">pricing: `+posts[postNormalLastIndex].pricing+`</span>
                            <span class="location">`+posts[postNormalLastIndex].location+`</span>
                        </div>
                        <img src="`+posts[postNormalLastIndex].postPicture+`" class="postPicture">
                        <button class="messageButton" onclick="messageMe(`+posts[postNormalLastIndex].userID+`, '`+posts[postNormalLastIndex].name+ `', '`+posts[postNormalLastIndex].serviceName+`')">Message me</button>
                    </div>
                `);
                postNormalLastIndex++;
                postNormalCount++;
            }
        }catch(e){
            limit++;
            console.log("reached limit");
            if(limit >= 3){
                $(".loadMore").css({display: "none"});
            }
            return;
        }
    };

    //service orders
    let loadOrderPost = (cov, loc, service)=>{
        fetch('../api/getPostsOrder.php?cov='+cov+"&loc="+loc+"&service="+service, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            postOrder = data;
            displayOrderPost(postOrder);
        })
        .catch(error=>console.log("error on retrieval of normal posts: " + error));
    };
    //write order posts to dom
    let displayOrderPost = (posts)=>{
        try{
            for(let i in posts){
                if(postOrderCount >= postLimit){
                    return;
                }
                $(".postsContainer").append(`
                    <div class="post `+posts[postOrderLastIndex].verified+`">
                        <div class="postHeader">
                            <img src="`+posts[postOrderLastIndex].picture+`" class="profilePicture">
                            <span class="name">`+posts[postOrderLastIndex].name+`</span>
                        </div>
                        <div class="postContent">
                            <span>Is looking for: <b>`+posts[postOrderLastIndex].serviceName+`</b></span>
                            <span class="description">`+posts[postOrderLastIndex].description+`</span>
                            <span class="location">`+posts[postOrderLastIndex].location+`</span>
                        </div>
                        <img src="`+posts[postOrderLastIndex].postPicture+`" class="postPicture">
                        <button class="messageButton" onclick="messageMe(`+posts[postOrderLastIndex].userID+`,'`+posts[postOrderLastIndex].name+`', '`+posts[postOrderLastIndex].serviceName+`')">Message me</button>
                    </div>
                `);
                postOrderLastIndex++;
                postOrderCount++;
            }
        }catch(e){
            limit++;
            console.log("reached limit");
            if(limit >= 3){
                $(".loadMore").css({display: "none"});
            }
            return;
        }
    };

    $(".loadMore").click(()=>{
        postLimit += 5;
        displayPremiumPost(postPremium);
        displayNormalPost(postNormal);
        displayOrderPost(postOrder);
    });

    let getUserAddress = ()=>{
        fetch('../api/getUserAddress.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: sessionStorage.getItem("id") 
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            userAddress = data;
            //initial retrieval of posts based in user location
            $(".coverageIndicator").text("Coverage: " + userAddress[1].citymun.citymunDesc);
            loadPremiumPost("cityMunicipality", userAddress[1].citymun.citymunDesc, "");
            loadNormalPost("cityMunicipality", userAddress[1].citymun.citymunDesc, "");
            loadOrderPost("cityMunicipality", userAddress[1].citymun.citymunDesc, "");
        })
        .catch(error=>console.log("error on retrieval of user address: " + error));
    };

    getUserAddress();
    
    $(".heading").click(()=>{   //heading scroll to top when clicked
        window.scrollTo(0, 0);
    });

    $(".search-button").click(()=>{     //display the search panel when search icon is clicked
        $("#searchContainer").css({display: "block"});
    });
    
    $("#closeSearch").click(()=>{   //closes the search panel on exit button clicked
        $("#searchContainer").css({display: "none"});
    });

    $("#searchContainer").mousedown(()=>{       //closes the search panel on click outside the search panel
        $("#searchContainer").css({display: "none"});
    });

    $("#search").mousedown(()=>{        //prevents the searchpanel close event propagation (doesnt close when search panel clicked)
        window.event.stopPropagation();
    });

    //send message panel
    $("#closeSendMessage").click(()=>{   //closes the search panel on exit button clicked
        $(".sendMessageContainer").css({display: "none"});
    });

    $(".sendMessageContainer").mousedown(()=>{       //closes the search panel on click outside the search panel
        $(".sendMessageContainer").css({display: "none"});
    });

    $(".sendMessage").mousedown(()=>{        //prevents the searchpanel close event propagation (doesnt close when search panel clicked)
        window.event.stopPropagation();
    });


    let loadServiceCategories = ()=>{
        
        fetch('../api/getServiceCategories.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            serviceCategories = data;
            $("#serviceCategory").empty();
            for(let i = 0; i < data.length; i++){
                $("#serviceCategory").append("<option value="+ data[i].categoryName+">"+data[i].categoryName+"</option>");
            }
            $("#serviceCategory").change();
        })
        .catch(error=>console.log("error on retrieval of service categories: " + error));
    };

    loadServiceCategories();

    $("#serviceCategory").change(()=>{
        for(let i = 0; i < serviceCategories.length; i++){
            if($("#serviceCategory").val() == serviceCategories[i].categoryName){
                selectedServiceCategory = serviceCategories[i].serviceCategoryID;
            }
        }
        if($("#serviceCategory").val() === "--Others--"){
            newServiceFlag = true;
            $("#service").css({display: "none"});
            $("#specifyService").css({display: "block"});
        }else{
            newServiceFlag = false;
            $("#service").css({display: "block"});
            $("#specifyService").css({display: "none"}); 
            //fetch services based on service catagory
            fetch('../api/getServicesList.php?id='+selectedServiceCategory, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res=>{return res.json()})
            .then(data=>{
                services = data;
                $("#service").empty();
                for(let i = 0; i < data.length; i++){
                    $("#service").append("<option value="+ data[i].serviceName+">"+data[i].serviceName+"</option>");
                }
                $("#service").change();
            })
            .catch(error=>console.log("error on retrieval of services: " + error));
        }
    });

    $("#service").change(()=>{
        for(let i = 0; i < services.length; i++){
            if($("#service").val() == services[i].serviceName){
                selectedService = services[i].serviceID;
            }
        }
        console.log(selectedService);
    });

    //search and filter functions have arguments coverage location and service
    $("#search-button").click(()=>{
        let cov, loc, service;
        $(".postsContainer").empty();
        postLimit = 10;
        postNormalCount = 0, postOrderCount  = 0, postPremiumCount = 0;
        postNormalLastIndex = 0, postOrderLastIndex = 0, postPremiumLastIndex = 0;
        limit = 0;
        $(".loadMore").css({display: "block"});
        switch($("#coverage").val()){
            case "all":
                cov = "";
                loc = "";
                $(".coverageIndicator").text("Coverage: All");
            break;
            case "barangay":
                cov = "barangay";
                loc = userAddress[0].brgy.brgyDesc;
                $(".coverageIndicator").text("Coverage: " + userAddress[0].brgy.brgyDesc);
            break;
            case "cityMunicipality":
                cov = "cityMunicipality";
                loc = userAddress[1].citymun.citymunDesc;
                $(".coverageIndicator").text("Coverage: " + userAddress[1].citymun.citymunDesc);
            break;
            case "province":
                cov = "provice";
                loc = userAddress[2].prov.provDesc;
                $(".coverageIndicator").text("Coverage: " + userAddress[2].prov.provDesc);
            break;
            case "region":
                cov = "region";
                loc = userAddress[3].reg.regDesc;
                $(".coverageIndicator").text("Coverage: " + userAddress[3].reg.regDesc);
            break;
        }

        if($("#serviceCategory").val() == "--Others--"){
            service = $("#specifyService").val();
        }else{
            service = $("#service").val();
        }

        switch($("#finds").val()){
            case "all":
                $(".servicesIndicator").text("All posts");
                loadPremiumPost(cov, loc, service);
                loadNormalPost(cov, loc, service);
                loadOrderPost(cov, loc, service);
            break;
            case "offers":
                $(".servicesIndicator").text("Service providers");
                loadPremiumPost(cov, loc, service);
                loadNormalPost(cov, loc, service);
            break;
            case "orders":
                $(".servicesIndicator").text("Clients");
                loadOrderPost(cov, loc, service);
            break;
        }
        $("#searchContainer").css({display: "none"});
    });

    $(".heading h1").click(()=>{
        location.reload();
    });

    //add add service owner to user contact
    $("#sendMessageButton").click(()=>{
        $("sendMessageButton").prop("disabled", true);
        //check if user is already in contact
        fetch('../api/checkContact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: sessionStorage.getItem("id"),
                cID: idTemp
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            //variable for identifying active contact to be passed on messaging page
            sessionStorage.setItem("activeContact", idTemp);
            sessionStorage.setItem("activeContactName",  $(".cname").text());
            if(data[0].contactID > 0){
                //user already in contact proceed to messaging
                //send message
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
                        receiverUserID: idTemp,
                        message: msg
                    })
                })
                .then(res=>{return res.json()})
                .then(()=>{
                    //send initial message to user
                    notify();
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
                        user2ID: idTemp,
                        subject: $("#headerText").text() 
                    })
                })
                .then(res=>{return res.json()})
                .then(data=>{
                    //send initial message to user
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
                            receiverUserID: idTemp,
                            message: msg
                        })
                    })
                    .then(res=>{return res.json()})
                    .then(()=>{
                        notify();
                    })
                    .then(()=>{
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

    //notify contact
    let notify = ()=>{
        //check if user and contact is already in notification table
        fetch('../api/checkNotification.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                notifierID: sessionStorage.getItem("id"),
                receiverID: idTemp
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            if(data[0].notificationID == 0){
                //if not, add to notification then notify
                fetch('../api/addToNotification.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        notifierID: sessionStorage.getItem("id"),
                        receiverID: idTemp
                    })
                })
                .then(()=>{
                    console.log("added to notification");
                })
                .catch(error=>console.log("error on adding to notificator: " + error));
            }else{
                //if true, notify contact
                fetch('../api/notify.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        notifierID: sessionStorage.getItem("id"),
                        receiverID: idTemp
                    })
                })
                .then(()=>{
                    console.log("notified");
                })
                .catch(error=>console.log("error on notification: " + error));
            }
        })
        .catch(error=>console.log("error on checking notification: " + error));
    };

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
                console.log($(window).width());
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

});

let visitPage = (id)=>{
    sessionStorage.setItem("toView", id);
    location.href = "businessPage.html";
}; 

//setting up contact
let idTemp;

let messageMe = (id, name, header)=>{
    if(sessionStorage.getItem("id") == id){
        return;
    }
    $(".sendMessageContainer").css({display: "block"});
    $(".cname").text(name);
    $("#headerText").text(header);
    idTemp = id;
    console.log("reciever id: " + id + "name: " + name);
};