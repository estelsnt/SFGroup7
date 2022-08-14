$("document").ready(()=>{

    let allowedToPost = true;
    let serviceCategories;
    let services;
    let selectedServiceCategory;
    let selectedService;
    let newServiceFlag = true;
    
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
                fetch('../api/getUserOrderCount.php?id='+sessionStorage.getItem("id"), {
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

    checkUserVerified();

    //get the users previous order posts
    let getUserPosts = ()=>{
        fetch('../api/getOrderPosts.php', {
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
            const d = new Date(data[i].serviceOrderDateTime);
            $(".posts").append(`
            
            <div class="servicePostNormal">
                <div class="postHeading">
                    <p class="postDate">`+ d.toDateString() +`</p>
                    <img src="../images/close.png" id="postDelete" onclick="deletePostNormal(`+ data[i].serviceOrderID +`)">
                </div>
                <p class="postLabel">Category: <span class="dataValue">`+ data[i].categoryName +`</span></p>
                <p class="postLabel">Service: <span class="dataValue">`+ data[i].serviceName +`</span></p>
                <p class="postLabel">Description:</p>
                <div class="postInputContainer">
                    <textarea name="description" id="postDescription`+ data[i].servicePostingID +`" readonly>`+ data[i].description +`</textarea>  
                </div>
                <div class="footer">

                </div>
            </div>

            `);
        }
    };

    getUserPosts();

    //load services categories
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

    //on category and service change
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

    //create new order
    $("#createNewOrder").click(()=>{
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

    //creating new order post
    $("#create").click(()=>{
        if(!inputCheck()){
            $("#create").text("check input");
            setTimeout(()=>{
                $("#create").text("Create order");
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
                fetch('../api/postOrder.php?', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userID: sessionStorage.getItem("id"),
                        serviceID: data.lastID,
                        description: $("#serviceDescription").val()
                    })
                })
                .then(res=>{return res.json()})
                .then(data=>{
                    //service posted
                    
                    setTimeout(()=>{
                    $("#create").text("Create order");
                    $("#create").attr("disabled", false);
                    location.reload();
                }, 500);
                })
                .catch(error=>console.log("error on inserting post: " + error));
            })
            .catch(error=>console.log("error on inserting service: " + error));
        }else{
            //insert the service to posting
            fetch('../api/postOrder.php?', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: sessionStorage.getItem("id"),
                    serviceID: selectedService,
                    description: $("#serviceDescription").val()
                })
            })
            .then(res=>{return res.json()})
            .then(data=>{
                //service posted
                $("#create").text("posting..");
                $("#create").attr("disabled", true);
                setTimeout(()=>{
                    $("#create").text("Create order");
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
        if($("#serviceDescription").val() == ""){
            flag = false;
        }
        return flag;
    };

    //clear input fields
    let clearInputFieldsPosting = ()=>{
        $("#serviceCategory").val("");
        $("#service").val("");
        $("#specifyService").val("");
        $("#serviceDescription").val("");
    };

    //closing the container
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
    //

});

let deletePostNormal = (id)=>{
    fetch('../api/removeOrderPost.php', {
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
        location.href = "../pages/createOrder.html";
    })
    .catch(error=>console.log("error on editing post: " + error));
};