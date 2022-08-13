$("document").ready(()=>{

    let businessPageID = sessionStorage.getItem("businessPage");
    let slideshowImages = ["../images/icons8-picture-500.png"];
    let pageInfo;
    //track the index of current image from slideshow image array
    let currentImg = 0;

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
            console.log(data);
            pageInfo = data;
            $("#duration").text("duration: " + data[0].postDuration);
            $("#businessName").val(data[0].title);
            if(data[0].featuredPhoto == undefined){
                console.log("wala");
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
        console.log( $("#businessName").prop('scrollHeight'));
        $("#businessName").css({height: "0"});
        $("#businessName").css({height: $("#businessName").prop('scrollHeight') + "px"});
    });

    $("#businessDetails").keyup(()=>{
        console.log( $("#businessDetails").prop('scrollHeight'));
        $("#businessDetails").css({height: "0"});
        $("#businessDetails").css({height: $("#businessDetails").prop('scrollHeight') + "px"});
    });

    //always trigger keyup to resize textarea
    $("#businessName").keyup();
    $("#businessDetails").keyup();

    //slideshow behavior
    let setImage = (img)=>{
        $(".slideshowImage").attr("src", slideshowImages[0]);
    };

    setImage();

    $(".right").click(()=>{
        if(currentImg == slideshowImages.length -1){
            currentImg = 0;
        }else{
            currentImg += 1;
        }
        $(".slideshowImage").attr("src", slideshowImages[currentImg]);
    });
    
    $(".left").click(()=>{
        if(currentImg == 0){
            currentImg = slideshowImages.length - 1;
        }else{
            currentImg -= 1;
        }
        $(".slideshowImage").attr("src", slideshowImages[currentImg]);
    });
    
    //edit title
    $("#businessName").keyup(()=>{
        $("#editBusinessName").attr("src", "../images/check.png");
    });

    $("#editBusinessName").click(()=>{
        let name = $("#businessName").val();
        name = name.replace("'", "\\'");
        if($("#businessName").val() == pageInfo[0].title){
            $("#businessName").css({border: "1px solid gold"});
            setTimeout(()=>{
                $("#businessName").css({border: "1px solid grey"});
            }, 1000);
        }else{
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
        let details = $("#businessDetails").val();
        details = details.replace("'", "\\'");
        if($("#businessDetails").val() == pageInfo[0].details){
            $("#businessDetails").css({border: "1px solid gold"});
            setTimeout(()=>{
                $("#businessDetails").css({border: "1px solid grey"});
            }, 1000);
        }else{
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

});