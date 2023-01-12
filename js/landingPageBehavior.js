//landing page behavior.js - controls the landing page
$("document").ready(()=>{
    let businessPages;
    let slideshowTracker = 0;
    let getPages = ()=>{
        fetch('api/getPostsPremium.php?cov=&loc=&service=', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            businessPages = data;
            if(data.servicePostingID == 0){
                return;
            }
            beginSlideshow();
        })
        .catch(error=>console.log("error on retrieval of premium posts: " + error));
    };
    let beginSlideshow = ()=>{
        console.log(businessPages);
        if(slideshowTracker == (businessPages.length)){
            slideshowTracker = 0;
        }
        $("#slideshowImage").animate({
            opacity: '0'
        }, 2000, ()=>{
            $("#slideshowImage").attr("src", businessPages[slideshowTracker].featuredPhoto);
            $("#businessName").text(businessPages[slideshowTracker].title);
            $("#address").text(businessPages[slideshowTracker].location);
            $("#slideshowImage").animate({
                opacity: '1'
            }, 500, ()=>{
                slideshowTracker++;
                beginSlideshow();
            });
        });
    };
    getPages();
});