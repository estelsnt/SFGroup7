$("document").ready(()=>{

    $("#backToFrontPage").click(()=>{
        window.location = "../index.html";
    });

    sessionStorage.clear();
    
    $("#login").click(()=>{
        if(checkInput()){
            $("#login").attr("disabled", true);
            //authenticate user credentials
            fetch('../api/userAuthentication.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: $("#userName").val(),
                    passWord:  $("#passWord").val() 
                })
            })
            .then(res=>{return res.json()})
            .then(data=>{
                $("#login").attr("disabled", false);
                console.log(data.userID);
                if(data.userID == 0){
                    $("#loginMessage").text("invalid username or password*");
                }else{
                    //create session variable for user id when login is successful
                    sessionStorage.setItem('id',data.userID);
                    window.location.href = "../pages/dashboard.html";
                }
            })
            .catch(error=>console.log("error on authentication: " + error));
        }else{
            $("#loginMessage").text("enter username and password*");
        }
    });

    let checkInput = ()=>{
        let flag = true;
        if($("#userName").val() === "" || $("#passWord").val() === ""){
            flag = false;
        }
        return flag;
    };

    let sanitize = (string)=>{
        const map = {
            '&': '',
            '<': '',
            '>': '',
            '"': '',
            "'": '',
            "/": '',
        };
        const reg = /[&<>"'/]/ig;
        return string.replace(reg, (match)=>(map[match]));
    }

    $("#userName").keyup(()=>{
        $("#userName").val(sanitize( $("#userName").val()));
        $("#loginMessage").text("");
    });

    $("#passWord").keyup(()=>{
        $("#passWord").val(sanitize( $("#passWord").val()));
        $("#loginMessage").text("");
    });

});