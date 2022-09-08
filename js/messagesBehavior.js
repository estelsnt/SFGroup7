$("document").ready(()=>{

    let contacts;

    $(".home-button").click(()=>{
        window.location = "../pages/dashboard.html";
    });

    if(sessionStorage.getItem("activeContact") == null){
        $("#chatSend").css({display: "none"});
        $("#chatInput").css({display: "none"}); 
    }else{
        $("#chatHeaderName").text(sessionStorage.getItem("activeContactName"));
    }

    let loadContacts = ()=>{
        fetch('../api/getContacts.php', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                userID: sessionStorage.getItem('id')
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            console.log(data);
            contacts = data;
            displayContacts(data);
        })
        .catch(error=>console.log("may error sa pag retrieve ng contacts: " + error));
    };
    
    let displayContacts = (data)=>{
        if(data.userID == 0){
            return;
        }
        for(let i in data){
            let name;
            let picture;
            let uid;
            console.log(data[i].user1ID);
            console.log(data[i].user2ID);
            if(data[i].user1ID == sessionStorage.getItem("id")){
                name = data[i].user2;
                picture = data[i].user2Picture;
                uid = data[i].user2ID;
            }else{
                name = data[i].user1;
                picture = data[i].user1Picture;
                uid = data[i].user1ID;
            }
            $(".contacts").append(`
                <div class="contact" onclick="selectContact(`+uid+", '"+name+`')">
                    <img src="`+picture+`" class="contactPicture">
                    <span class="contactName">`+name+`</span>
                </div>
            `);
        }
    };

    //sending message
    $("#chatSend").click(()=>{
        if($("#chatInput").val() == ""){
            return;
        }
        fetch('../api/sendMessage.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                senderUserID: sessionStorage.getItem("id"),
                receiverUserID: sessionStorage.getItem("activeContact"),
                message: $("#chatInput").val()
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            //message sent
            console.log("message sent");
            $("#chatInput").val("");
        })
        .catch(error=>console.log("error on sending message: " + error));
    });
    
    loadContacts();

});

//selecting user from contact
let selectContact = (id, name)=>{
    $("#chatSend").css({display: "block"});
    $("#chatInput").css({display: "block"});
    $("#chatHeaderName").text(name); 
    sessionStorage.setItem("activeContact", id);
    sessionStorage.setItem("activeContactName", name);
};