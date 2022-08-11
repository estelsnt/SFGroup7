$("document").ready(()=>{
    let slideshowImages = ["../images/close.png", "../images/id-card.png", "../images/home.png"];
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