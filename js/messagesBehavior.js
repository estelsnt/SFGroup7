$("document").ready(()=>{

    let contacts;
    let chat;
    

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
            chat = data;
            if(data.chatID == 0){
                return;
            }
            for(let i in data){
                lastChatID = data[i].chatID;
                if(data[i].senderUserID == sessionStorage.getItem('id')){
                    displayChat(0, data[i].message, data[i].chatDateTime);
                }else{
                    displayChat(1, data[i].message, data[i].chatDateTime);
                }
            } 
        })
        .catch(error=>console.log("may error sa pag retrieve ng conversation: " + error));
    };

    let displayChat = (position, message, dateTime)=>{
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
        sendMessage($("#chatInput").val());
    });

    //enter key on textarea
    $("#chatInput").keypress((e)=>{
        if(e.keyCode == 13){
            if($("#chatInput").val()[0] == '\n' || $("#chatInput").val().length == 0){
                e.preventDefault();
                $("#chatInput").val("");
                return;
            }
            sendMessage($("#chatInput").val());
        }
    });
    
    //send message
    let sendMessage = (msg)=>{
        if(msg.length == 0){
            $("#chatInput").val("");
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
                message: mysql_real_escape_string(msg)
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            //message sent
            $("#chatInput").val("");
        })
        .catch(error=>console.log("error on sending message: " + error));
    };

    //sanitize input
    let mysql_real_escape_string = (str)=>{
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\"+char; // prepends a backslash to backslash, percent,
                                      // and double/single quotes
                default:
                    return char;
            }
        });
    }

    //retrieve  contact list
    loadContacts();
    //realtime chat daw
    setInterval(()=>{loadChat()}, 1000);
});

//selecting user from contact
let lastChatID = 0;

let selectContact = (id, name)=>{
    $("#chatSend").css({display: "block"});
    $("#chatInput").css({display: "block"});
    $("#chatHeaderName").text(name);
    $(".conversation").empty();
    lastChatID = 0; 
    sessionStorage.setItem("activeContact", id);
    sessionStorage.setItem("activeContactName", name);
};