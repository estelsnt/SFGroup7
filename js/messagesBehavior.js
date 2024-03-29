//messagesBehavior.js - controls the messaging processes
$("document").ready(()=>{
    let contacts;
    let chat;
    $(".home-button").click(()=>{
        window.location = "../pages/dashboard.html";
    });
    //loading icon
    loading(1);
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
        .then(()=>{
            //recursion
            setTimeout(()=>{
                loadChat();
            }, 500)
        })
        .then(()=>{
            loading(0);
        })
        .catch((error)=>{
            console.log("may error sa pag retrieve ng conversation: " + error)
            location.reload();
        });
        
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
        .then(()=>{
            setTimeout(()=>{
                loadContacts();
            }, 4000);
        })
        .then(()=>{
            loading(false);
        })
        .catch((error)=>{
            console.log("may error sa pag retrieve ng contacts: " + error)
            location.reload();
        });
    };
    let displayContacts = (data)=>{
        $(".contacts").empty();
        if(data.userID == 0){
            
            $(".noContacts").css({display: "block"});
            return;
        }else{
            $(".noContacts").css({display: "none"});
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
            //build the elements
            let contact = document.createElement("div");
            let pic = document.createElement("img");
            let n = document.createElement("span");
            let notif = document.createElement("span");
            let arg = "'"+uid+"',"+"'"+name+"'";
            contact.setAttribute("class", "contact");
            contact.setAttribute("onclick", "selectContact("+arg+")");
            pic.setAttribute("src", picture);
            pic.setAttribute("class", "contactPicture");
            n.setAttribute("class", "contactName");
            notif.setAttribute("class", "notif");
            n.innerText = name;
            if(data[i].notif != 0 && data[i].notif != null){
                notif.innerText = data[i].notif;
                n.append(notif);
            }
            contact.append(pic);
            contact.append(n);
            $(".contacts").append(contact);
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
        disableInput(true);
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
        .then(()=>{
            //message sent proceed to notify
            notify(sessionStorage.getItem("activeContact"));
            clearNotification(sessionStorage.getItem("activeContact"));
            $("#chatInput").val("");
            disableInput(false);
        })
        .catch(error=>console.log("error on sending message: " + error));
    };
    //notify user
    let notify = (nid)=>{
        //check if user and contact is already in notification table
        fetch('../api/checkNotification.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                notifierID: sessionStorage.getItem("id"),
                receiverID: nid
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            if(data[0].notificationID == 0){
                //if not, add to notification then notify
                fetch('../api/addToNotification.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        notifierID: sessionStorage.getItem("id"),
                        receiverID: nid
                    })
                })
                .then(()=>{
                    console.log("added to notification");
                })
                .catch(error=>console.log("error on adding to notificator: " + error));
            }else{
                //if true, notify contact
                fetch('../api/notify.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        notifierID: sessionStorage.getItem("id"),
                        receiverID: nid
                    })
                })
                .catch(error=>console.log("error on notification: " + error));
            }
        })
        .catch(error=>console.log("error on checking notification: " + error));
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
    //input disable/enable
    let disableInput = (state)=>{
        if(state){
            $("#chatSend").prop("disabled", true);
            $("#chatInput").prop("disabled", true);
        }else{
            $("#chatSend").prop("disabled", false);
            $("#chatInput").prop("disabled", false);
        }
    };
    //check of no contacts
    let checkContacts = ()=>{
        if($(".contacts").children().length == 0){
            $(".noContacts").css({display: "block"});
        }else{
            $(".noContacts").css({display: "none"});
        }
    };
    //retrieve  contact list
    loadContacts();
    //realtime chat daw
    //setInterval(()=>{loadChat()}, 1000);
    loadChat();
});
let loading = (state)=>{
    if(state == 1){
        $(".loadingConversation").css({display: "block"});
    }else{
        $(".loadingConversation").css({display: "none"});
    }
};
//selecting user from contact
let lastChatID = 0;
let selectContact = (id, name)=>{
    loading(1);
    $("#chatSend").css({display: "block"});
    $("#chatInput").css({display: "block"});
    $("#chatHeaderName").text(name);
    $(".conversation").empty();
    lastChatID = 0; 
    sessionStorage.setItem("activeContact", id);
    sessionStorage.setItem("activeContactName", name);
    clearNotification(id);
    location.reload();
};
//clear notification
let clearNotification = (nid)=>{
    fetch('../api/clearNotification.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            notifierID: nid,
            receiverID: sessionStorage.getItem("id")
        })
    })
    .catch(error=>console.log("error on notification: " + error));
};