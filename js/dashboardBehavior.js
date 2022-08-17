//dashboard events listener
$("document").ready(()=>{

    let userAddress;
    let postNormal;
    let postOrder;

    const pageProtection = ()=>{
        if(sessionStorage.getItem("id") == undefined){
            window.location = "../pages/login.html";
        }
    }

    pageProtection();

    //posts
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
        for(let i in posts){
            console.log(posts[i].verified);
            $(".main").append(`
                <div class="post `+posts[i].verified+`">
                    <div class="postHeader">
                        <img src="`+posts[i].picture+`" class="profilePicture">
                        <span class="name">`+posts[i].name+`</span>
                    </div>
                    <div class="postContent">
                        <span class="service">`+posts[i].serviceName+`</span>
                        <span class="description">`+posts[i].description+`</span>
                        <span class="pricing">pricing: `+posts[i].pricing+`</span>
                        <span class="location">`+posts[i].location+`</span>
                    </div>
                    <img src="`+posts[i].postPicture+`">
                    <button class="messageButton">Message me</button>
                </div>
            `);
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
        for(let i in posts){
            console.log(posts[i].serviceName);
            $(".main").append(`
                <div class="post `+posts[i].verified+`">
                    <div class="postHeader">
                        <img src="`+posts[i].picture+`" class="profilePicture">
                        <span class="name">`+posts[i].name+`</span>
                    </div>
                    <div class="postContent">
                        <span>Is looking for: </span>
                        <span class="service">`+posts[i].serviceName+`</span>
                        <span class="description">`+posts[i].description+`</span>
                        <span class="location">`+posts[i].location+`</span>
                    </div>
                    <img src="`+posts[i].picture+`" class="postPicture">
                    <button class="messageButton">Message me</button>
                </div>
            `);
        }
    };


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


