//dashboard events listener
$("document").ready(()=>{
    $(".heading").click(()=>{   //heading scroll to top when clicked
        window.scrollTo(0, 0);
    });

    $(".search-button").click(()=>{     //display the search panel when search icon is clicked
        $("#searchContainer").css({display: "block"});
    });
    
    $("#closeSearch").click(()=>{   //closes the search panel on exit button clicked
        $("#searchContainer").css({display: "none"});
    });

    $("#searchContainer").click(()=>{       //closes the search panel on click outside the search panel
        $("#searchContainer").css({display: "none"});
    });

    $("#search").click(()=>{        //prevents the searchpanel close event propagation (doesnt close when search panel clicked)
        window.event.stopPropagation();
    });
});


