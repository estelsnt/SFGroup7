$("document").ready(()=>{
    
    $(".backToLogin").click(()=>{
        window.location = "login.html";
    });

    $("#send").click(()=>{
        //check contact number
        fetch('../api/checkContactNumber.php?id=' + $("#contactNumber").val(),{
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        })
        .then(res=>{return res.json()})
        .then(data=>{
            if(data[0].userName === 0){
                $(".messageSent").text("number not found");
                $(".messageSent").css({display: "block"});
            }else{
                fetch('../api/retrievePassword.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contactNumber: $("#contactNumber").val()
                    })
                })
                .then(()=>{
                    $(".messageSent").text("Your password is sent to " + $("#contactNumber").val());
                    $(".messageSent").css({display: "block"});  
                })
                .then(()=>{
                    $("#contactNumber").val("");
                })
                .catch(error=>console.log("error on inserting otp: " + error));
            }
        })
        .catch(error=>console.log('error' + error));
    });

});