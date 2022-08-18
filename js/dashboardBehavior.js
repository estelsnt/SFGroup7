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
        fetch('../api/getPostspremium.php?cov='+cov+"&loc="+loc+"&service="+service, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            postPremium = data;
            console.log(postPremium);
            displayPremiumPost(postPremium);
        })
        .catch(error=>console.log("error on retrieval of premium posts: " + error));
    };
    //write premium posts to dom
    let displayPremiumPost = (posts)=>{
        try{
            for(let i in posts){
                console.log(posts[i].verified);
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
                        
                        <button class="messageButton">Visit page</button>
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
            console.log(postNormal);
            displayNormalPost(postNormal);
        })
        .catch(error=>console.log("error on retrieval of normal posts: " + error));
    };
    //write normal posts to dom
    let displayNormalPost = (posts)=>{
        try{
            for(let i in posts){
                console.log(posts[i].verified);
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
                        <button class="messageButton">Message me</button>
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
            console.log(postOrder);
            displayOrderPost(postOrder);
        })
        .catch(error=>console.log("error on retrieval of normal posts: " + error));
    };
    //write order posts to dom
    let displayOrderPost = (posts)=>{
        try{
            for(let i in posts){
                console.log(posts[i].serviceName);
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
                        <button class="messageButton">Message me</button>
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
        console.log(postLimit);
        postLimit += 5;
        displayPremiumPost(postPremium);
        displayNormalPost(postNormal);
        displayOrderPost(postOrder);
    });

    loadPremiumPost("", "", "");
    loadNormalPost("", "", "");
    loadOrderPost("", "", "");

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
            console.log(userAddress[0].brgy.brgyCode);
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
});


