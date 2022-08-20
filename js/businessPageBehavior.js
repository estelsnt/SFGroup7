$("document").ready(()=>{
    let id = sessionStorage.getItem("toView");
    let pageInfo;
    let slideshowImage;
    let currentImg = 0;

    console.log(sessionStorage.getItem("toView"));

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

    //initial functions call
    getPostdata();
    getListItems();
    getSlideshowImage();
    getLocation();
});