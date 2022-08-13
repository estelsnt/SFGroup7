$("document").ready(()=>{

    let businessPageID = sessionStorage.getItem("businessPage");
    let slideshowImages = ["../images/icons8-picture-500.png"];
    //track the index of current image from slideshow image array
    let currentImg = 0;

    console.log(businessPageID);

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
});