$("document").ready(()=>{
    
    $(".backToLogin").click(()=>{
        window.location = "login.html";
    });

    $("#send").click(()=>{
        spamProtect();
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

    let spamProtect = ()=>{
        localStorage.setItem("atst", new Date());
    };

    let chkp = ()=>{
        if(localStorage.getItem("atst") == null){
            clearInterval(chki);
            return;
        }else{
            let saved = new Date(localStorage.getItem("atst"));
            let test = new Date(saved.getTime() + 30*60000)
            let now = new Date();
            if(now > test){
                $("#send").prop("disabled", false);
                localStorage.removeItem("atst");
                clearInterval(chki);
            }else{  
                $("#send").prop("disabled", true);
                $(".messageSent").css({display: "block"});
                $(".messageSent").text("try again in 30 minutes...");
            }
            
        }
    };

    let chki = setInterval(chkp, 1000);
});