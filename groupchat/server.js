const http = require("http");
const express= require("express");


const app = express();

const server = http.createServer(app);

const port = process.env.PORT || 5555;

app.use(express.static(__dirname+"/public"));

app.get("/", (req,res) =>{
    res.sendFile(__dirname+"/groupchat.html")
})


/******************* socket.io setup  *************/

const io= require("socket.io")(server);
let users={};

io.on("connection", (socket) =>{
    // console.log("new connection established! "+ socket.id)

    socket.on("new-user-joined", (username) =>{
        users[socket.id] = username;
        console.log(users)
        socket.broadcast.emit("user-connected", username);

        io.emit("user-list",users); // for updating user list
    });

    socket.on("disconnect", () =>{
        socket.broadcast.emit("user-disconnected", user =users[socket.id]);
        delete users[socket.id];

        io.emit("user-list",users); // for updating user list
    })

    socket.on("message",(data) =>{
        socket.broadcast.emit("message", {user: data.user, msg: data.msg});
    })

});


/**********************  socket.io setup Ends *******************/



 /* server listen */
server.listen(port, () =>{
    console.log("server started at "+port);
})