//aboutPremiumPageBehavior.js - runs the about page on premium post
$("document").ready(()=>{
    let slideshowImages = ["../images/e1.PNG", "../images/e2.PNG", "../images/e3.PNG"];
    let currentImg = 0;
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