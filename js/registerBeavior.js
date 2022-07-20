$("document").ready(()=>{
    let region;
    let province;
    let cityMunicipality;
    let barangay;

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
        
        
        $(".otpConfirmationContainer").css({display: "block"});
        $("#otpHeading").text("Send OTP code to: " + $("#contactNumber").val());
    });

    $(".otpConfirmationContainer").click(()=>{
        $(".otpConfirmationContainer").css({display: "none"});
    });

    $(".otpConfirm").click(()=>{
        window.event.stopPropagation();
    });

    $("#exit").click(()=>{
        $(".otpConfirmationContainer").css({display: "none"});
    });

    //sending of OTP code
    $("#sendOtp").click(()=>{
        //generate otp and send to database (otp is session variable)


        //
        $("#sendOtp").attr("disabled", "true");
        let counter = 15;
        const dsC = setInterval(()=>{
            
            $("#sendOtp").text("Send(" + counter + ")");
            counter--;
            if(counter < 0){
                clearInterval(dsC);
                $("#sendOtp").removeAttr("disabled");
                $("#sendOtp").text("Send");
                counter = 15;
            }
        },1000);

        

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

    });

    $("#province").change(()=>{     //populate region options when province changes
        for(let i in province){
            if(province[i].description == $("#province").val()){
                populateCityMunicipality(province[i].provCode);
                break;
            }
        }
        $("#barangay").empty();
    });

    $("#cityMunicipality").change(()=>{     //populate barangay options when city/municipality changes
        for(let i in cityMunicipality){
            if(cityMunicipality[i].description == $("#cityMunicipality").val()){
                populateBarangay(cityMunicipality[i].citymunCode);
                break;
            }
        }
    });

    //input sanitize, validate, and authenticate
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








