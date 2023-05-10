const express = require('express');
const { connection } = require('./configs/db');
const { adminRouter } = require('./routes/admin.routes');
const {userRouter} = require('./routes/user');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const { logger } = require('./middlewares/logger.middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors())

app.use(express.json());
app.use(logger);


app.use("/users", userRouter)


app.use('/admin', adminRouter);



// app.listen(process.env.PORT, ()=>{
//     connection();
//     console.log(`App is running on ${process.env.PORT}`);
// })


// ++++++++++++++++++++++++++++++++++++++++++
// PORT = 8998

// MONGODB_URI = mongodb+srv://krunalgurao1:vartalap@cluster0.kkg3eom.mongodb.net/vartalap?retryWrites=true&w=majority

// SALT_ROUNDS = 5

// JWT_SECRET_KEY = administration


// ++++++++++++++++++++++++++++++++++++++++++


//rutuja


const http = require("http");

const socketio = require('socket.io');

const { chatting } = require('./configs/chatting');
 


// using http server because express server doesnt support socket.io

const serverHttp = http.createServer(app)
const io = socketio(serverHttp); // with wss we are attaching http server

// const ioG = socketio(serverHttp);


// // const defaultNPS = io.of("/");

// ioG.on("connection",(socket)=>{

//     console.log("One user has joined");

//     socket.on("joinRoom",({username,room})=>{

//       const user = userJoin(socket.id, username, room);

//       socket.join(user.room);

//       // Welcome message 
//       socket.emit("message",formateMessage("Vartalap",`Welcome to ${room}`));

//       // Broadcasting other users
//       socket.broadcast.to(user.room).emit("message",formateMessage("Vartalap",`${username} has joined the chat`));

//       // getting room users.
//          ioG.to(room).emit("roomUsers",{
//             room:user.room,
//             users:getRoomUsers(user.room)
//          })
//     });

//      socket.on("chatMessage",(msg)=>{
//         const user = getCurrentUser(socket.id);

//         ioG.to(user.room).emit("message",formateMessage(user.username,msg));

//      });

    
//     socket.on("disconnect",()=>{

//     const user = userLeave(socket.id);
//         console.log("one user left");

//           // Broadcastion other users on leaving 
//        ioG.to(user.room).emit("message",formateMessage("Masai Server",`${user.username} has left the chat`));
 
//        // getting room users.
//   ioG.to(user.room).emit("roomUsers",{
//     room:user.room,
//     users:getRoomUsers(user.room)
//  })
 
//         })

  

// })


chatting(io); // using the imported chatting function and passing io instance/ object 











serverHttp.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("connected to db ")

    }
    catch (err) {
        console.log("error | connection", err)
    }
    console.log(`server started @ http://localhost:${process.env.PORT}`)
})

