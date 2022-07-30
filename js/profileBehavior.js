$("document").ready(()=>{

    let userData;
    let userAddress;

    let region;
    let province;
    let cityMunicipality;
    let barangay;
    let brgyCode;
    
    //

   let loadUserData = (id)=>{
        fetch('../api/getUserData.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: id
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            userData = data;
            //write data to fields
            console.log(userData);
            $("#profilePicture").attr("src", userData.address);
            $("#userName").val(userData.userName);
            $("#passWord").val(userData.passWord);
            $("#firstName").val(userData.firstName);
            $("#middleName").val(userData.middleName);
            $("#lastName").val(userData.lastName);
            $("#contactNumber").val(userData.contactNumber);
            $("#email").val(userData.email);
            $("#gender").val(userData.gender);
            $("#birthDate").val(userData.birthDate);

            
        })
        .then(()=>{
            setTimeout(()=>{
                $("#region").val("REGION I (ILOCOS REGION)");   
                $("#region").change();
                console.log("cant");
            }, 1000);
            
        })
        .catch(error=>console.log("error on user data fetch: " + error));
   };

   loadUserData(sessionStorage.getItem("id"));

    $("#backButton").click(()=>{
        window.location.href = "../pages/dashboard.html";
    });

    $(".logout").click(()=>{
        window.localStorage.clear();
        window.sessionStorage.clear();
        window.location.reload(true);
        window.location.replace('/sfa');

    });

    function previewProfileImage( uploader ) {   
        //ensure a file was selected 
        if (uploader.files && uploader.files[0]) {
            var imageFile = uploader.files[0];
            var reader = new FileReader();    
            reader.onload = function (e) {
                //set the image data as source
                $('#profilePicture').attr('src', e.target.result);
            }    
            reader.readAsDataURL( imageFile );
        }
    }
    
    $("#uploadProfilePicture").change(function(){
        previewProfileImage( this );
    });


    //the code below is the codes for registration
    $("#passwordMessage").mouseenter(()=>{
        $("#passWord").attr("type", "text");
    });

    $("#passwordMessage").mouseleave(()=>{
        $("#passWord").attr("type", "password");
    });
    //confirmation on registration
    $("#confirm").click(()=>{
        //check inputs first before opening otp confirmation panel
        if(!validateInput()){
            return;
        }
        let flag = true;
        //check if username already existed (di ko mapagana pag hiwalay kasi asynchronous)
        fetch('../api/checkUsernameDuplicate.php?id=' + $("#userName").val(),{
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        })
        .then(res=>{return res.json()})
        .then(data=>{
            if(data[0].userName === 0){
                flag = true;
                $("#userName").css({border: "1px solid #ccccc4"});
                $("#userNameMessage").text("");
            }
            else{
                flag = false;
                $("#userName").css({border: "1px solid red"});
                $("#userNameMessage").text("username already exist*");
            }
        })
        .then(()=>{
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
                    $("#contactNumber").css({border: "1px solid #ccccc4"});
                    $("#contactNumberMessage").text("");
                    if(flag === true){
                        // $(".otpConfirmationContainer").css({display: "block"});
                        // $("#otpHeading").text("Send OTP code to: " + $("#contactNumber").val());
                    }
                }else{
                    $("#contactNumber").css({border: "1px solid red"});
                    $("#contactNumberMessage").text("this number is already used*");
                }
            })
            .catch(error=>console.log('error' + error));
        })
        .catch(error=>console.log('error' + error));
    });

    // $(".otpConfirmationContainer").click(()=>{
    //     $(".otpConfirmationContainer").css({display: "none"});
    // });

    // $(".otpConfirm").click(()=>{
    //     window.event.stopPropagation();
    // });

    // $("#exit").click(()=>{
    //     $(".otpConfirmationContainer").css({display: "none"});
    // });

    //sending of OTP code
    // $("#sendOtp").click(()=>{
    //     //generate otp and send to database (otp is session variable)
    //     sessionStorage.setItem("otp","1");//otp is set to 1 for now
    //     //once otp is created insert it to database for sms sending

    //     //
    //     $("#sendOtp").attr("disabled", "true");
    //     let counter = 15;
    //     const dsC = setInterval(()=>{
            
    //         $("#sendOtp").text("Send(" + counter + ")");
    //         counter--;
    //         if(counter < 0){
    //             clearInterval(dsC);
    //             $("#sendOtp").removeAttr("disabled");
    //             $("#sendOtp").text("Send");
    //             counter = 15;
    //         }
    //     },1000);
    // });
    //registration allowed on correct OTP
    $("#otp").keyup(()=>{
        if($("#otp").val() == sessionStorage.getItem("otp")){
            //insert userdata to database here
            fetch('../api/addNewUser.php', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    userName: $("#userName").val(),
                    passWord: $("#passWord").val(),
                    lastName: $("#lastName").val(),
                    fistName: $("#firstName").val(),
                    middleName: $("#middleName").val(),
                    contactNumber: $("#contactNumber").val(),
                    email: $("#email").val(),
                    gender: $("#gender").val(),
                    birthDate: $("#birthDate").val(),
                    brgyCode: brgyCode
                })
            })
            .then(()=>{
                fetch('../api/registerUserAddress.php', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        userName: $("#userName").val(),
                        brgyCode: brgyCode,
                        address: $("#addressDetails").val()
                    })
                })
                .then(()=>{
                    $(".otpConfirmationContainer").css({display: "none"});
                    $(".registerSuccessContainer").css({display: "block"});
                })
                .catch(error=>console.log("may error sa pag insert ng address: " + error));
            })
            .catch(error=>console.log("hala gago may error di mo alam ayusin yan tanga: " + error));
        }
    });

    $("#backToLogin").click(()=>{
        window.location.replace("login.html");//send back to login page
    });

    //populate gets data from database, fill updates the options in page
    //region
    let populateRegion = ()=>{
        fetch('../api/populateRegion.php',{
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        })
        .then(res=>{return res.json()})
        .then(data=>fillRegion(data))
        .catch(error=>console.log('error' + error));
    };
    
    let fillRegion = (data)=>{
        region = data;//global variable region

        $("#region").empty();

        const optionini = document.createElement("option");
        optionini.setAttribute("value", "-select-");
        optionini.innerText = "-select-";
        $("#region").append(optionini);

        for(let i in data){
            const option = document.createElement("option");
            option.setAttribute("value", data[i].description);
            option.innerText = data[i].description;
            $("#region").append(option);
        }
    }
    //province
    let populateProvince = (id)=>{
        fetch('../api/populateProvince.php?id=' + id,{
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        })
        .then(res=>{return res.json()})
        .then(data=>fillProvince(data))
        .catch(error=>console.log('error' + error));
    };

    let fillProvince = (data)=>{
        province = data;//global variable province

        $("#province").empty();

        const optionini = document.createElement("option");
        optionini.setAttribute("value", "-select-");
        optionini.innerText = "-select-";
        $("#province").append(optionini);

        for(let i in data){
            const option = document.createElement("option");
            option.setAttribute("value", data[i].description);
            option.innerText = data[i].description;
            $("#province").append(option);
        }
    }
    //city municipality
    let populateCityMunicipality = (id)=>{
        fetch('../api/populateCityMun.php?id=' + id,{
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        })
        .then(res=>{return res.json()})
        .then(data=>fillCityMunicipality(data))
        .catch(error=>console.log('error' + error));
    };

    let fillCityMunicipality = (data)=>{
        cityMunicipality = data;//global variable cityMunicipality
        $("#cityMunicipality").empty();

        const optionini = document.createElement("option");
        optionini.setAttribute("value", "-select-");
        optionini.innerText = "-select-";
        $("#cityMunicipality").append(optionini);

        for(let i in data){
            const option = document.createElement("option");
            option.setAttribute("value", data[i].description);
            option.innerText = data[i].description;
            $("#cityMunicipality").append(option);
        }
    }
    //barangay
    let populateBarangay = (id)=>{
        fetch('../api/populateBarangay.php?id=' + id,{
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        })
        .then(res=>{return res.json()})
        .then(data=>fillBarangay(data))
        .catch(error=>console.log('error' + error));
    };

    let fillBarangay = (data)=>{
        barangay = data;//global variable barangay
        $("#barangay").empty();

        const optionini = document.createElement("option");
        optionini.setAttribute("value", "-select-");
        optionini.innerText = "-select-";
        $("#barangay").append(optionini);

        for(let i in data){
            const option = document.createElement("option");
            option.setAttribute("value", data[i].description);
            option.innerText = data[i].description;
            $("#barangay").append(option);
        }
    }
    //change event listener
    $("#region").change(()=>{   //populate province option when region changes
        for(let i in region){
            if(region[i].description == $("#region").val()){
                populateProvince(region[i].regCode);
                break;
            }
        }
        $("#cityMunicipality").empty();
        $("#barangay").empty();
        $("#region").css({"border": "1px solid #ccccc4"});
    });

    $("#province").change(()=>{     //populate region options when province changes
        for(let i in province){
            if(province[i].description == $("#province").val()){
                populateCityMunicipality(province[i].provCode);
                break;
            }
        }
        $("#barangay").empty();
        $("#province").css({"border": "1px solid #ccccc4"});
    });

    $("#cityMunicipality").change(()=>{     //populate barangay options when city/municipality changes
        for(let i in cityMunicipality){
            if(cityMunicipality[i].description == $("#cityMunicipality").val()){
                populateBarangay(cityMunicipality[i].citymunCode);
                break;
            }
        }
        $("#cityMunicipality").css({"border": "1px solid #ccccc4"});
    });

    $("#barangay").change(()=>{
        for(let i in barangay){
            if(barangay[i].description == $("#barangay").val()){
                brgyCode = barangay[i].brgyCode;
                break;
            }
        }
        $("#barangay").css({"border": "1px solid #ccccc4"});
    });

    //input sanitize and validate

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
        $("#userName").val(sanitize($("#userName").val()));
        $("#userName").css({"border": "1px solid #ccccc4"});
        $("#userNameMessage").text("");
    });
    $("#passWord").keyup(()=>{
        $("#passWord").val(sanitize($("#passWord").val()));
        $("#passWord").css({"border": "1px solid #ccccc4"});
    });
    $("#lastName").keyup(()=>{
        $("#lastName").val(sanitize($("#lastName").val()));
    });
    $("#firstName").keyup(()=>{
        $("#firstName").val(sanitize($("#firstName").val()));
        $("#firstName").css({"border": "1px solid #ccccc4"});
    });
    $("#middleName").keyup(()=>{
        $("#middleName").val(sanitize($("#middleName").val()));
    });
    $("#contactNumber").keyup(()=>{
        $("#contactNumber").val(sanitize($("#contactNumber").val()));
        $("#contactNumber").val( $("#contactNumber").val().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
        $("#contactNumber").css({"border": "1px solid #ccccc4"});
        $("#contactNumberMessage").text("");
    });
    $("#email").keyup(()=>{
        $("#email").val(sanitize($("#email").val()));
    });
    $("#gender").keyup(()=>{
        $("#gender").val(sanitize($("#gender").val()));
    });

    let validateInput = ()=>{
        let valid = true;
        if($("#userName").val().length === 0){
            valid = false;
            $("#userNameMessage").text("this field is required*");
            $("#userName").css({border: "1px solid red"});
        }
        if($("#passWord").val().length === 0){
            valid = false;
            $("#passWord").css({border: "1px solid red"});
        }
        if($("#firstName").val().length === 0){
            valid = false;
            $("#firstName").css({border: "1px solid red"});
        }
        if($("#contactNumber").val().length === 0){
            valid = false
            $("#contactNumber").css({border: "1px solid red"});
        }
        if($("#region").val() === null || $("#region").val() == "-select-"){
            valid = false
            $("#region").css({border: "1px solid red"});
        }
        if($("#province").val() === null || $("#province").val() == "-select-"){
            valid = false
            $("#province").css({border: "1px solid red"});
        }
        if($("#cityMunicipality").val() === null || $("#cityMunicipality").val() == "-select-"){
            valid = false
            $("#cityMunicipality").css({border: "1px solid red"});
        }
        if($("#barangay").val() === null || $("#barangay").val() == "-select-"){
            valid = false
            $("#barangay").css({border: "1px solid red"});
        }
        return valid;
    };
    

    //initial functions call
    populateRegion();
});








