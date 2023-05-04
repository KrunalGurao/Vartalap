const express = require('express');
const { connection } = require('./configs/db');
const { adminRouter } = require('./routes/admin.routes');
const {userRouter} = require('./routes/user');
require('dotenv').config();

const app = express();
app.use(express.json());


app.use("/users", userRouter)


app.use('/admin', adminRouter);


app.listen(process.env.PORT, ()=>{
    connection();
    console.log(`App is running on ${process.env.PORT}`);
})


// ++++++++++++++++++++++++++++++++++++++++++
// PORT = 8998

// MONGODB_URI = mongodb+srv://krunalgurao1:vartalap@cluster0.kkg3eom.mongodb.net/vartalap?retryWrites=true&w=majority

// SALT_ROUNDS = 5

// JWT_SECRET_KEY = administration
// ++++++++++++++++++++++++++++++++++++++++++
