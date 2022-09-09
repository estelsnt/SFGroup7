$("document").ready(()=>{

    let contacts;
    let chat;
    let lastChatID = 0;

    $(".home-button").click(()=>{
        window.location = "../pages/dashboard.html";
    });

    //selecting contact to be loaded
    if(sessionStorage.getItem("activeContact") == null){
        $("#chatSend").css({display: "none"});
        $("#chatInput").css({display: "none"}); 
    }else{
        $("#chatHeaderName").text(sessionStorage.getItem("activeContactName"));
    }

    //get conversation
    let loadChat = ()=>{
        if(sessionStorage.getItem('activeContact') == null){
            return;
        }
        fetch('../api/getChat.php', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                userID: sessionStorage.getItem('id'),
                contactID: sessionStorage.getItem('activeContact'),
                lastID: lastChatID
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            console.log(data);
            chat = data;
            if(data.chatID == 0){
                console.log("last message found");
                return;
            }
            for(let i in data){
                lastChatID = data[i].chatID;
                console.log(lastChatID);
                if(data[i].senderUserID == sessionStorage.getItem('id')){
                    displayChat(0, data[i].message, data[i].chatDateTime);
                }else{
                    displayChat(1, data[i].message, data[i].chatDateTime);
                }
            } 
        })
        .catch(error=>console.log("may error sa pag retrieve ng conversation: " + error));
    };
    
    setInterval(()=>{loadChat()}, 1000);

    let displayChat = (position, message, dateTime)=>{
        console.log("writing");
        if(position == 0){
            $(".conversation").append(`
                <div class="chatSent convo">
                <span class="message">`+message+`</span>
                <span class="messageDateTime">`+dateTime+`</span>
                </div>
            `);
        }else{
            $(".conversation").append(`
                <div class="chatReceived convo">
                <span class="message">`+message+`</span>
                <span class="messageDateTime">`+dateTime+`</span>
                </div>
            `);
        }
        $(".conversation").scrollTop($(".conversation")[0].scrollHeight); 
    };

    //get contacts list
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