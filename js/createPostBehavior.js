$("document").ready(()=>{

    let allowedToPost = true;
    let serviceCategories;
    let services;
    let selectedServiceCategory;
    let selectedService;
    let newServiceFlag = true;

    //check premiumpage access
    let checkPremiumPage = ()=>{
        fetch('../api/getPremiumPageID.php?id='+sessionStorage.getItem("id"), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            console.log(data);
            if(data.pID == 0){
                $("#postNormal").after(`
                <div class="post" id="postPremium">
                    <span>
						Have a bussiness?
					</span>
                    <img src="../images/plus-gold.png" id="createNewPostPremium" onclick="createPremiumPost()">
                    <a href="aboutPremiumPost.html" id="learnMorePremium">Advertise it in here.<br>Learn more.</a>
                </div>
                `);
            }else{
                sessionStorage.setItem("businessPage", data[0].pID);
                $("#postNormal").after(`
                <div class="post" id="postPremium">
                    <span>
						`+data[0].title+`
					</span>
                    <img src="../images/editcircle.png" id="createNewPostPremium" onclick="editPremiumPost()">
                </div>
                `);
            }
        })
        .catch(error=>console.log("error on retrieval of premium post"));
    };
    
    checkPremiumPage();

    //paypal sandbox api
    let subscription = "20";

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
                let today = new Date()//.toISOString().slice(0, 10);
                switch(subscription){
                    case "20":
                        today.setMonth(today.getMonth() + 1);
                    break;
                    case "200":
                        today.setMonth(today.getMonth() + 12);
                    break;
                }
                //console.log(today.toISOString().slice(0, 10));
                console.log(details);
                fetch('../api/addPremiumPage.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userID: sessionStorage.getItem("id"),
                        title:  $("#businessName").val(),
                        postDuration: today.toISOString().slice(0, 10)
                    })
                })
                .then(res=>{return res.json()})
                .then(data=>{
                    //feedback after success
                    sessionStorage.setItem("businessPage", data.lastID);
                    $(".createPostPremiumContainer").css({display: "none"});
                    location.href = "../pages/createBusinessPage.html";
                })
                .catch(error=>console.log("critical error on inserting premium post"));
            })
        }
    }).render('#paypalButtonContainer');

    $("#redeem").click(()=>{
        console.log(sessionStorage.getItem("businessPage"));
    });
    
    $("#m1").click(()=>{
        subscription = "20";
    });

    $("#m12").click(()=>{
        subscription = "200"
    });

    $("#businessName").keyup(()=>{
        $("#businessName").css({border: "1px solid grey"});
    });


    //get the users previous posts
    let getUserPosts = ()=>{
        fetch('../api/getServicePosts.php', {
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
            
            if(data.posts == 0){
                console.log("no posts");
                return;
            }
            displayPosts(data);
        })
        .catch(error=>console.log("error on retrieval of this user posts"));
    };
    //write posts to dom
    let displayPosts = (data)=>{
        $(".posts").empty();
        for(let i in data){
            const d = new Date(data[i].servicePostDateTime);
            $(".posts").append(`
            
            <div class="servicePostNormal">
                <div class="postHeading">
                    <p class="postDate">`+ d.toDateString() +`</p>
                    <img src="../images/close.png" id="postDelete" onclick="deletePostNormal(`+ data[i].servicePostingID +`)">
                </div>
                <p class="postLabel">Category: <span class="dataValue">`+ data[i].categoryName +`</span></p>
                <p class="postLabel">Service: <span class="dataValue">`+ data[i].serviceName +`</span></p>
                <p class="postLabel">Pricing:</p>
                <div class="postInputContainer">
                    <textarea name="pricing" id="postPricing`+ data[i].servicePostingID +`" readonly>`+ data[i].pricing +`</textarea>
                    <img src="../images/edit.png" class="postEdit" onclick="toggleEditPricing(`+data[i].servicePostingID+`)">
                </div>
                <p class="postLabel">Description:</p>
                <div class="postInputContainer">
                    <textarea name="description" id="postDescription`+ data[i].servicePostingID +`" readonly>`+ data[i].description +`</textarea>
                    <img src="../images/edit.png" class="postEdit" onclick="toggleEditDescription(`+data[i].servicePostingID+`)">    
                </div>
                <div class="postFooter">
                    <button onclick="savePostNormal(`+ data[i].servicePostingID +`)">Save</button>
                </div>
            </div>

            `);
        }
    };

    getUserPosts();

    let loadServiceCategories = ()=>{
        clearInputFieldsPosting();
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

    $("#create").click(()=>{
        if(!inputCheck()){
            $("#create").text("check input");
            setTimeout(()=>{
                $("#create").text("Create post");
            }, 1000);
            return;
        }
        if(newServiceFlag){
            //insert the specified service before inserting service post
            console.log("to insert");
            fetch('../api/addNewService.php?', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    serviceName: $("#specifyService").val(),
                    serviceDescription: $("#serviceDescription").val()
                })
            })
            .then(res=>{return res.json()})
            .then(data=>{
                $("#create").text("posting..");
                $("#create").attr("disabled", true);
                //insert the service to posting
                fetch('../api/postService.php?', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userID: sessionStorage.getItem("id"),
                        serviceID: data.lastID,
                        pricing: $("#servicePricing").val(),
                        description: $("#serviceDescription").val()
                    })
                })
                .then(res=>{return res.json()})
                .then(data=>{
                    //service posted
                    
                    setTimeout(()=>{
                    $("#create").text("Create post");
                    $("#create").attr("disabled", false);
                    location.reload();
                }, 500);
                })
                .catch(error=>console.log("error on inserting post: " + error));
            })
            .catch(error=>console.log("error on inserting service: " + error));
        }else{
            //insert the service to posting
            fetch('../api/postService.php?', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: sessionStorage.getItem("id"),
                    serviceID: selectedService,
                    pricing: $("#servicePricing").val(),
                    description: $("#serviceDescription").val()
                })
            })
            .then(res=>{return res.json()})
            .then(data=>{
                //service posted
                $("#create").text("posting..");
                $("#create").attr("disabled", true);
                setTimeout(()=>{
                    $("#create").text("Create post");
                    $("#create").attr("disabled", false);
                    location.reload();
                }, 500);
            })
            .catch(error=>console.log("error on inserting post: " + error));
        }
    });

    let inputCheck = ()=>{
        let flag = true;
        if($("#serviceCategory").val() == ""){
            flag = false;
        }
        if(newServiceFlag){
            if($("#specifyService").val() == ""){
                flag = false;
            }
        }else{
            if($("#service").val() == ""){
                flag = false;
            }
        }
        if($("#servicePricing").val() == ""){
            flag = false;
        }
        if($("#serviceDescription").val() == ""){
            flag = false;
        }
        return flag;
    };

    let clearInputFieldsPosting = ()=>{
        $("#serviceCategory").val("");
        $("#service").val("");
        $("#specifyService").val("");
        $("#servicePricing").val("");
        $("#serviceDescription").val("");
    };
    //check if user is verified and restrict posting to 1
    let checkUserVerified = ()=>{
        fetch('../api/checkVerifiedUser.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: sessionStorage.getItem('id')
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            if(data.verified == "TRUE"){
                $("#getVerified").css({display: "none"});
            }
            else{
                fetch('../api/getUserPostCount.php?id='+sessionStorage.getItem("id"), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res=>{return res.json()})
                .then(data=>{
                    if(data[0].posts == "1"){
                        allowedToPost = false;
                    }
                })
                .catch(error=>console.log("error on retrieval of user number of post: " + error));
            }
        })
        .catch(error=>console.log("error on retrieval of user verification: " + error));
    };

    checkUserVerified()

    $("#createNewPostNormal").click(()=>{
        //check if user is not verified (limited to 1 post)
        if(!allowedToPost){
            $("#getVerified").text("limited to 1 post");
            setTimeout(()=>{
                $("#getVerified").text("Get verified! create more posts");
            }, 2000);
            return;
        }
        //initialize services categories 
        loadServiceCategories();
        $(".createPostNormalContainer").css({display: "block"});
    });
    //open create post panel
    $(".createPostNormalContainer").mousedown(()=>{
        $(".createPostNormalContainer").css({display: "none"});
    });

    $(".createPostNormal").mousedown(()=>{
        window.event.stopPropagation();
    });

    $("#createPostClose").click(()=>{
        $(".createPostNormalContainer").css({display: "none"});
    });
    //open create premium post panel
    $("#createPostPremiumClose").click(()=>{
        $(".createPostPremiumContainer").css({display: "none"});
    });

    $(".createPostPremiumContainer").mousedown(()=>{
        $(".createPostPremiumContainer").css({display: "none"});
    });
    
    $(".createPostPremium").mousedown(()=>{
        window.event.stopPropagation();
    });

    $("#createNewPostPremium").click(()=>{
        $(".createPostPremiumContainer").css({display: "block"});
    });
    //for creating premium post go to businesspage
    //this button is for testing
    $("#proceed").click(()=>{
        console.log("hey");
        location.href = "../pages/createBusinessPage.html";
    });
    

    $(".home-button").click(()=>{
        window.location = "../pages/dashboard.html";
    });
});

let createPremiumPost = () =>{
    $(".createPostPremiumContainer").css({display: "block"});
}

let editPremiumPost = () =>{
    location.href = "../pages/createBusinessPage.html";
}

let savePostNormal = (id)=>{
    fetch('../api/updateServicePost.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            pricing: $("#postPricing"+id).val(),
            description: $("#postDescription"+id).val()
        })
    })
    .then(()=>{
        console.log("post updated");
        location.href = "../pages/createPost.html";
    })
    .catch(error=>console.log("error on editing post: " + error));
};

let deletePostNormal = (id)=>{
    fetch('../api/removeServicePost.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    })
    .then(()=>{
        console.log("post deleted");
        location.href = "../pages/createPost.html";
    })
    .catch(error=>console.log("error on editing post: " + error));
};

let toggleEditPricing = (item)=>{
    if($("#postPricing"+item).prop("readonly")){
        $("#postPricing"+item).attr("readonly", false);
        $("#postPricing"+item).css({"border" : "2px solid #ffab1e"});
    }else{
        $("#postPricing"+item).attr("readonly", true);
        $("#postPricing"+item).css({"border" : "1px solid #ccccc4"});
    }
};

let toggleEditDescription = (item)=>{
    if($("#postDescription"+item).prop("readonly")){
        $("#postDescription"+item).attr("readonly", false);
        $("#postDescription"+item).css({"border" : "2px solid #ffab1e"});
    }else{
        $("#postDescription"+item).attr("readonly", true);
        $("#postDescription"+item).css({"border" : "1px solid #ccccc4"});
    }
};