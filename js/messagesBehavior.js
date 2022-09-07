$("document").ready(()=>{

    let contacts;

    $(".home-button").click(()=>{
        window.location = "../pages/dashboard.html";
    });

    let loadContacts = ()=>{
        fetch('../api/getContacts.php', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                userID: sessionStorage.getItem("id")
            })
        })
        .then(res=>{return res.json()})
        .then(data=>{
            console.log(data);
            contacts = data;
            displayContacts(data);
        })
        .catch(error=>console.log("may error sa pag insert ng address: " + error));
    };
    
    let displayContacts = (data)=>{
        for(let i in data){
            let name;
            let picture;
            console.log(data[i].user1ID);
            console.log(data[i].user2ID);
            if(data[i].user1ID == sessionStorage.getItem("id")){
                name = data[i].user2;
                picture = data[i].user2Picture;
            }else{
                name = data[i].user1;
                picture = data[i].user1Picture;
            }
            $(".contacts").append(`
                <div class="contact">
                    <img src="`+picture+`" class="contactPicture">
                    <span class="contactName">`+name+`</span>
                </div>
            `);

        }
    };
    
    loadContacts();

});