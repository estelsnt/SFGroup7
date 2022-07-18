$("document").ready(()=>{
    $("#passwordMessage").mouseenter(()=>{
        $("#passWord").attr("type", "text");
    });
    $("#passwordMessage").mouseleave(()=>{
        $("#passWord").attr("type", "password");
    });
});