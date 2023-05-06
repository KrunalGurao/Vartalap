
const socket = io();

var username;
let chats= document.querySelector(".chats");
let users_list= document.querySelector(".users-list");
let users_count= document.querySelector(".users-count");
let msg_send = document.querySelector("#msg-send");
let user_msg= document.querySelector("#user-msg");

do{
    username= prompt("Enter your name");
} while(!username);


/* It will be called when user will join */
socket.emit("new-user-joined", username);

// Notifying that user is joined
socket.on("user-connected" ,(socket_name)=>{
    userJoinLeft(socket_name, "joined");
})

/* Function to create joined/ left  status div */
function userJoinLeft(name,status){
    let div= document.createElement("div");
    div.classList.add("user-join");
    let content = `<p><b>${name}</b> ${status} the chat`;
    div.innerHTML= content;
    chats.appendChild(div);
    chats.scrollTop= chats.scrollHeight; // scroll upward when new message come
}

// Notifying that user has left
socket.on('user-disconnected', (user) => {
    userJoinLeft(user,"left");
})

/* For updating users list and user counts */
socket.on("user-list", (users) =>{
    users_list.innerHTML= "";
    users_arr= Object.values(users);
    for(let i=0; i<users_arr.length; i++){
        let p = document.createElement("p");
        p.innerText= users_arr[i];
        users_list.appendChild(p);
    }

    users_count.innerHTML= users_arr.length;
})


/*  For sending message */

msg_send.addEventListener("click", () =>{
    let data={
        user: username,
        msg: user_msg.value
    };
    if(user_msg.value != ""){
        appendMessage(data, 'outgoing');
        socket.emit("message", data);
        user_msg.value="";
    }
})

function appendMessage(data, status){
    let div= document.createElement("div");
    div.classList.add("message", status);
    let content= `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;

    div.innerHTML= content;
    chats.appendChild(div);
    chats.scrollTop= chats.scrollHeight; // scroll upward when new message come
}

socket.on("message", (data) =>{
    appendMessage(data,"incoming");
})