$("document").ready(()=>{

    let allowedToPost = true;
    let serviceCategories;
    let services;
    let selectedServiceCategory;
    let selectedService;
    let newServiceFlag = true;

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
                    $("#create").text("posting..");
                    $("#create").attr("disabled", true);
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

    $(".createPostNormalContainer").mousedown(()=>{
        $(".createPostNormalContainer").css({display: "none"});
    });

    $(".createPostNormal").mousedown(()=>{
        window.event.stopPropagation();
    });

    $("#createPostClose").click(()=>{
        $(".createPostNormalContainer").css({display: "none"});
    });

    $(".home-button").click(()=>{
        window.location = "../pages/dashboard.html";
    });

    


});

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